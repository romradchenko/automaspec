'use client'

import type { ComponentProps } from 'react'

import { Avatar as AvatarPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

const Avatar = ({ ref, className, ...props }: ComponentProps<typeof AvatarPrimitive.Root>) => (
    <AvatarPrimitive.Root
        ref={ref}
        className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
        {...props}
    />
)
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = ({ ref, className, ...props }: ComponentProps<typeof AvatarPrimitive.Image>) => (
    <AvatarPrimitive.Image ref={ref} className={cn('aspect-square h-full w-full', className)} {...props} />
)
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = ({ ref, className, ...props }: ComponentProps<typeof AvatarPrimitive.Fallback>) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted', className)}
        {...props}
    />
)
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
