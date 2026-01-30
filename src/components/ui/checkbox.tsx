"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

export function Checkbox(
    props: React.ComponentProps<typeof CheckboxPrimitive.Root>,
) {
    return (
        <CheckboxPrimitive.Root className="checkbox" {...props}>
            <span className="checkbox-thumb" />
        </CheckboxPrimitive.Root>
    );
}
