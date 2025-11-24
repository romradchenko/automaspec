import type { ComponentProps } from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const alertVariants = cva(
    'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground transition-smooth',
    {
        variants: {
            variant: {
                default: 'bg-background text-foreground',
                destructive:
                    'border-destructive/50 bg-destructive/5 text-destructive dark:border-destructive dark:bg-destructive/10 [&>svg]:text-destructive',
                success:
                    'border-success/50 bg-success/5 text-success dark:border-success dark:bg-success/10 [&>svg]:text-success',
                warning:
                    'border-warning/50 bg-warning/5 text-warning dark:border-warning dark:bg-warning/10 [&>svg]:text-warning',
                info: 'border-info/50 bg-info/5 text-info dark:border-info dark:bg-info/10 [&>svg]:text-info'
            }
        },
        defaultVariants: {
            variant: 'default'
        }
    }
)

const Alert = ({ ref, className, variant, ...props }: ComponentProps<'div'> & VariantProps<typeof alertVariants>) => (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
)
Alert.displayName = 'Alert'

const AlertTitle = ({ ref, className, children, ...props }: ComponentProps<'h5'>) => (
    <h5 ref={ref} className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props}>
        {children}
    </h5>
)
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = ({ ref, className, ...props }: ComponentProps<'div'>) => (
    <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
)
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
