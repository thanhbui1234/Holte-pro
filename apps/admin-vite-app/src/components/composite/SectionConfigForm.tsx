import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Palette } from "lucide-react";
import { Input } from "shared-ui";
import { Textarea } from "shared-ui";
import { FormField } from "@/components/composite/FormField";
import { SectionCard } from "@/components/composite/SectionCard";
import { ColorField } from "@/components/composite/ColorField";
import { SaveBar } from "@/components/composite/SaveBar";
import type { ThemedSection } from "@/shared/types";

interface SectionConfigFormProps {
  value: ThemedSection;
  onSave: (next: ThemedSection) => void;
}

/**
 * Form for the shared section heading config:
 * eyebrow, title prefix, italic highlight word, description, bg color.
 */
export function SectionConfigForm({ value, onSave }: SectionConfigFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<ThemedSection>({ defaultValues: value });

  useEffect(() => reset(value), [value, reset]);

  const submit = handleSubmit((data) => {
    onSave(data);
    reset(data);
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      <SectionCard
        icon={<Palette className="h-4 w-4" />}
        title="Tiêu đề phần"
        description="Kiểm soát cách phần này hiển thị trên trang công khai."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Eyebrow" htmlFor="cfg-eyebrow">
            <Input
              id="cfg-eyebrow"
              placeholder="Featured Works"
              {...register("eyebrow")}
            />
          </FormField>
          <FormField label="Màu nền" htmlFor="cfg-bg">
            <Controller
              control={control}
              name="backgroundColor"
              render={({ field }) => (
                <ColorField
                  id="cfg-bg"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FormField>
          <FormField label="Tiền tố tiêu đề" htmlFor="cfg-title">
            <Input
              id="cfg-title"
              placeholder="Wedding"
              {...register("titlePrefix")}
            />
          </FormField>
          <FormField label="Từ in nghiêng nổi bật" htmlFor="cfg-highlight">
            <Input
              id="cfg-highlight"
              placeholder="Highlights"
              {...register("titleHighlight")}
            />
          </FormField>
          <FormField label="Mô tả" htmlFor="cfg-desc" className="md:col-span-2">
            <Textarea
              id="cfg-desc"
              rows={3}
              placeholder="Mô tả ngắn cho phần này"
              {...register("description")}
            />
          </FormField>
        </div>
      </SectionCard>

      <SaveBar
        isDirty={isDirty}
        onSave={submit}
        onReset={() => reset(value)}
        saveLabel="Lưu tiêu đề"
      />
    </form>
  );
}
