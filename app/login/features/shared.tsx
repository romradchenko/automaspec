'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFieldContext, useFormContext } from '@/lib/shared/tanstack-form'
import { FieldInfo } from '@/lib/shared/tanstack-form'

export const SignInSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
})

export const SignUpSchema = z.object({
    name: z.string().min(4, 'Name must be at least 4 characters'),
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
})

export const SubmitButton = () => {
    const form = useFormContext()
    const hasNameField = 'name' in form.state.values
    return (
        <form.Subscribe>
            {(state) => (
                <Button type="submit" className="w-full" disabled={!state.canSubmit || state.isSubmitting}>
                    {state.isSubmitting
                        ? hasNameField
                            ? 'Creating account...'
                            : 'Signing in...'
                        : hasNameField
                          ? 'Create account'
                          : 'Sign in'}
                </Button>
            )}
        </form.Subscribe>
    )
}

export const SyncEmailAndPasswordValues = ({
    onValuesChange
}: {
    onValuesChange: (values: { email?: string; password?: string }) => void
}) => {
    const form = useFormContext()
    return (
        <form.Subscribe selector={(state) => [state.values.email, state.values.password]}>
            {([email, password]) => {
                useEffect(() => {
                    onValuesChange({ email, password })
                }, [email, password])
                return null
            }}
        </form.Subscribe>
    )
}

export const EmailField = ({ label }: { label: string }) => {
    const field = useFieldContext<string>()
    return (
        <div className="space-y-2">
            <Label htmlFor={field.name}>{label}</Label>
            <Input
                id={field.name}
                name={field.name}
                placeholder="name@example.com"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldInfo field={field} />
        </div>
    )
}

export const NameField = ({ label }: { label: string }) => {
    const field = useFieldContext<string>()
    return (
        <div className="space-y-2">
            <Label htmlFor={field.name}>{label}</Label>
            <Input
                id={field.name}
                name={field.name}
                placeholder="John Doe"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldInfo field={field} />
        </div>
    )
}

export const PasswordField = ({ label }: { label: string }) => {
    const field = useFieldContext<string>()
    const [showPassword, setShowPassword] = useState(false)
    return (
        <div className="space-y-2">
            <Label htmlFor={field.name}>{label}</Label>
            <div className="relative">
                <Input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="pr-10"
                />
                <Button
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    size="sm"
                    type="button"
                    variant="ghost"
                >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
            </div>
            <FieldInfo field={field} />
        </div>
    )
}
