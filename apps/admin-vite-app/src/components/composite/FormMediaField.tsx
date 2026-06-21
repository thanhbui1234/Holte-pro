import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { MediaUpload, type MediaUploadProps } from "shared-ui";
import { FormField } from "./FormField";

interface FormMediaFieldProps<T extends FieldValues>
  extends Omit<MediaUploadProps, "value" | "onChange"> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  hint?: string;
  onChange?: (url: string, file?: File) => void;
  urlOnly?: boolean;
}

export function FormMediaField<T extends FieldValues>({
  control,
  name,
  label,
  hint,
  className,
  onChange: customOnChange,
  ...mediaProps
}: FormMediaFieldProps<T>) {
  return (
    <FormField label={label} htmlFor={name} hint={hint} className={className}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <MediaUpload
            id={name}
            value={field.value ?? ""}
            onChange={(url, file) => {
              if (customOnChange) {
                 customOnChange(url, file as any);
              } else {
                 field.onChange(url);
              }
            }}
            {...mediaProps}
          />
        )}
      />
    </FormField>
  );
}
