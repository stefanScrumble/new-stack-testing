import {
    Field,
    FieldContent,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { type InputHTMLAttributes } from 'react';

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
};

export function FormField({
    label,
    error,
    className,
    ...inputProps
}: FormFieldProps) {
    const id = inputProps.id ?? inputProps.name;

    return (
        <Field data-invalid={!!error}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <FieldContent>
                <Input
                    {...inputProps}
                    id={id}
                    aria-invalid={!!error}
                    className={className}
                />
                <FieldError errors={error ? [{ message: error }] : []} />
            </FieldContent>
        </Field>
    );
}
