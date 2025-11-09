'use client'

import type { ComponentProps } from 'react'

import { cva } from 'class-variance-authority'
import { Label as LabelPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

const labelVariants = cva('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70')

const Label = ({ ref, className, ...props }: ComponentProps<typeof LabelPrimitive.Root>) => (
    <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
)
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
