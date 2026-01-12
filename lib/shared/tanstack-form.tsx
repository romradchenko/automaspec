import { type AnyFieldApi, createFormHookContexts, createFormHook } from '@tanstack/react-form'

import {
    EmailField,
    PasswordField,
    NameField,
    SubmitButton,
    SyncEmailAndPasswordValues
} from '@/app/login/features/shared'

export const FieldInfo = ({ field }: { field: AnyFieldApi }) => {
    return (
        <>
            {field.state.meta.isTouched && !field.state.meta.isValid ? (
                <p className="text-red-500 text-sm">{field.state.meta.errors.map((err) => err.message).join(',')}</p>
            ) : null}
            {field.state.meta.isValidating ? 'Validating...' : null}
        </>
    )
}

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()

export const { useAppForm, withForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        EmailField,
        PasswordField,
        NameField
    },
    formComponents: {
        SubmitButton,
        SyncEmailAndPasswordValues
    }
})
