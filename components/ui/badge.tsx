import type { ComponentProps } from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-smooth shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20',
                secondary:
                    'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-secondary/10',
                destructive:
                    'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-destructive/20',
                success: 'border-transparent bg-success text-success-foreground hover:bg-success/90 shadow-success/20',
                warning: 'border-transparent bg-warning text-warning-foreground hover:bg-warning/90 shadow-warning/20',
                info: 'border-transparent bg-info text-info-foreground hover:bg-info/90 shadow-info/20',
                outline: 'text-foreground border-primary/30 hover:bg-primary/5'
            }
        },
        defaultVariants: {
            variant: 'default'
        }
    }
)

export interface BadgeProps extends ComponentProps<'div'>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

// oxlint-disable-next-line only-export-components
export { Badge, badgeVariants }
