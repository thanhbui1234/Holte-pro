import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PanelsTopLeft } from "lucide-react";
import { useHeader, useUpdateHeader } from "@/features/header/hooks/use-header";
import { PageContainer } from "@/components/composite/PageContainer";
import { SectionCard } from "@/components/composite/SectionCard";
import { FormField } from "@/components/composite/FormField";
import { SaveBar } from "@/components/composite/SaveBar";
import { Input } from "shared-ui";
import type { HeaderData } from "@/features/header/types/header.types";

export function HeaderPage() {
  const { data, isLoading } = useHeader();
  const { mutate: save } = useUpdateHeader();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<HeaderData>({ defaultValues: data ?? undefined });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const submit = handleSubmit((values: HeaderData) => {
    save(values);
    reset(values);
  });

  if (isLoading) {
    return <PageContainer title="Header" description="Đang tải..."><div className="p-8">Đang tải...</div></PageContainer>;
  }

  return (
    <form onSubmit={submit}>
      <PageContainer
        title="Header"
        description="Ba liên kết mạng xã hội hiển thị ở góc trên phải mỗi trang."
      >
        <SectionCard
          icon={<PanelsTopLeft className="h-4 w-4" />}
          title="Liên kết mạng xã hội"
          description="Dùng URL https:// đầy đủ. Email dùng tiền tố mailto:."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="URL Facebook" htmlFor="hdr-fb">
              <Input
                id="hdr-fb"
                placeholder="https://facebook.com/..."
                {...register("facebookUrl")}
              />
            </FormField>
            <FormField label="URL Instagram" htmlFor="hdr-ig">
              <Input
                id="hdr-ig"
                placeholder="https://instagram.com/..."
                {...register("instagramUrl")}
              />
            </FormField>
            <FormField label="Liên kết email" htmlFor="hdr-email" className="md:col-span-2">
              <Input
                id="hdr-email"
                placeholder="mailto:hello@jowfilm.vn"
                {...register("emailHref")}
              />
            </FormField>
          </div>
        </SectionCard>

        <SaveBar
          isDirty={isDirty}
          onSave={submit}
          onReset={() => reset(data ?? undefined)}
          saveLabel="Lưu header"
        />
      </PageContainer>
    </form>
  );
}
