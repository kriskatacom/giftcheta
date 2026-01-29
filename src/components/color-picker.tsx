"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import copy from "copy-to-clipboard";
import { toast } from "sonner";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
    value: string;
    onChange: (newColor: string) => void;
    presets?: string[];
}

export function ColorPicker({
    value,
    onChange,
    presets = [],
}: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleCopy = () => {
        copy(value);
        toast.success("Цветът е копиран!");
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    className="w-10 h-10 rounded-full border border-muted-foreground p-0"
                    style={{ backgroundColor: value }}
                />
            </PopoverTrigger>

            <PopoverContent className="w-70 p-4 space-y-3">
                <HexColorPicker
                    color={value}
                    onChange={(newColor) => onChange(newColor.toUpperCase())}
                />
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value.toUpperCase())}
                    className="mt-2"
                />

                {presets.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-2">
                        {presets.map((preset) => (
                            <button
                                key={preset}
                                className="w-6 h-6 rounded-full border border-muted-foreground"
                                style={{ backgroundColor: preset }}
                                onClick={() => onChange(preset)}
                                aria-label={`Select preset color ${preset}`}
                            />
                        ))}
                    </div>
                )}

                <Button onClick={handleCopy} className="w-full mt-2">
                    Копиране на кода
                </Button>
            </PopoverContent>
        </Popover>
    );
}
