import * as React from "react";
import { Input } from "shared-ui";
import { cn } from "@/shared/lib/utils";

export interface ColorFieldProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  className?: string;
}

export const ColorField = React.forwardRef<HTMLInputElement, ColorFieldProps>(
  ({ value, onChange, id, className }, ref) => {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="relative h-9 w-12 shrink-0 overflow-hidden rounded-md border">
          <input
            ref={ref}
            id={id}
            type="color"
            value={isValidHex(value) ? value : "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer border-0 p-0"
            aria-label="Color picker"
          />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="font-mono text-sm uppercase"
          placeholder="#000000"
        />
      </div>
    );
  },
);
ColorField.displayName = "ColorField";

function isValidHex(value: string): boolean {
  return /^#([0-9a-f]{3}){1,2}$/i.test(value);
}
