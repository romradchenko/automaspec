'use client'

import { Label as LabelPrimitive, Slot as SlotPrimitive } from 'radix-ui'
import { type ComponentProps, createContext, use, useId } from 'react'
import {
    Controller,
    FormProvider,
    useFormContext,
    type ControllerProps,
    type FieldPath,
    type FieldValues
} from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const Form = FormProvider

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
    name: TName
}

const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue)

const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    ...props
}: ControllerProps<TFieldValues, TName>) => {
    return (
        <FormFieldContext value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext>
    )
}

const useFormField = () => {
    const fieldContext = use(FormFieldContext)
    const itemContext = use(FormItemContext)
    const { getFieldState, formState } = useFormContext()

    const fieldState = getFieldState(fieldContext.name, formState)

    if (!fieldContext) {
        throw new Error('useFormField should be used within <FormField>')
    }

    const { id } = itemContext

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState
    }
}

type FormItemContextValue = {
    id: string
}

const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue)

const FormItem = ({ ref, className, ...props }: ComponentProps<'div'>) => {
    const id = useId()

    return (
        <FormItemContext value={{ id }}>
            <div ref={ref} className={cn('space-y-2', className)} {...props} />
        </FormItemContext>
    )
}
FormItem.displayName = 'FormItem'

const FormLabel = ({ ref, className, ...props }: ComponentProps<typeof LabelPrimitive.Root>) => {
    const { error, formItemId } = useFormField()

    return <Label ref={ref} className={cn(error && 'text-destructive', className)} htmlFor={formItemId} {...props} />
}
FormLabel.displayName = 'FormLabel'

const FormControl = ({ ref, ...props }: ComponentProps<typeof SlotPrimitive.Slot>) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

    return (
        <SlotPrimitive.Slot
            ref={ref}
            id={formItemId}
            aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
            aria-invalid={!!error}
            {...props}
        />
    )
}
FormControl.displayName = 'FormControl'

const FormDescription = ({ ref, className, ...props }: ComponentProps<'p'>) => {
    const { formDescriptionId } = useFormField()

    return <p ref={ref} id={formDescriptionId} className={cn('text-sm text-muted-foreground', className)} {...props} />
}
FormDescription.displayName = 'FormDescription'

const FormMessage = ({ ref, className, children, ...props }: ComponentProps<'p'>) => {
    const { error, formMessageId } = useFormField()
    const body = error ? String(error?.message ?? '') : children

    if (!body) {
        return null
    }

    return (
        <p ref={ref} id={formMessageId} className={cn('text-sm font-medium text-destructive', className)} {...props}>
            {body}
        </p>
    )
}
FormMessage.displayName = 'FormMessage'

export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField }
