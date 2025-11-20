'use client'

import type { VariantProps } from 'class-variance-authority'

import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui'
import { type ComponentProps, createContext, use } from 'react'

import { toggleVariants } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'

const ToggleGroupContext = createContext<VariantProps<typeof toggleVariants>>({
    size: 'default',
    variant: 'default'
})

const ToggleGroup = ({
    ref,
    className,
    variant,
    size,
    children,
    ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>) => (
    <ToggleGroupPrimitive.Root ref={ref} className={cn('flex items-center justify-center gap-1', className)} {...props}>
        <ToggleGroupContext value={{ variant, size }}>{children}</ToggleGroupContext>
    </ToggleGroupPrimitive.Root>
)

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = ({
    ref,
    className,
    children,
    variant,
    size,
    ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>) => {
    const context = use(ToggleGroupContext)

    return (
        <ToggleGroupPrimitive.Item
            ref={ref}
            className={cn(
                toggleVariants({
                    variant: context.variant || variant,
                    size: context.size || size
                }),
                className
            )}
            {...props}
        >
            {children}
        </ToggleGroupPrimitive.Item>
    )
}

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }
