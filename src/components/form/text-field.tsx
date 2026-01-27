"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type TextFieldProps = {
    id: string;
    label: string;
    type?: "text" | "number";
    value: string | number;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    onChange: (value: string) => void;
};

export function TextField({
    id,
    label,
    type = "text",
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
                type={type}
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
