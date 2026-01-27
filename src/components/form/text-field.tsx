"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type TextFieldProps = {
    id: string;
    label: string;
    value: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    onChange: (value: string) => void;
};

export function TextField({
    id,
    label,
    value,
    placeholder,
    required = false,
    disabled = false,
    error,
    onChange,
}: TextFieldProps) {
    return (
        <div className="space-y-1">
            <Label htmlFor={id} className="mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </Label>

            <Input
                id={id}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
            />

            {error && <p className="text-red-500 mt-1">{error}</p>}
        </div>
    );
}
