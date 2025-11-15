import type { AnyFieldApi } from '@tanstack/react-form'

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
