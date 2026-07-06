import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Mail, Palette, Type } from "lucide-react";
import { useSection, useUpdateSectionData } from "@/features/layout/hooks/use-layout";
import { PageContainer } from "@/components/composite/PageContainer";
import { SectionCard } from "@/components/composite/SectionCard";
import { FormField } from "@/components/composite/FormField";
import { SaveBar } from "@/components/composite/SaveBar";
import { ColorField } from "@/components/composite/ColorField";
import { Input } from "shared-ui";
import { Textarea } from "shared-ui";
import type { ContactCtaData } from "@/features/contact/types/contact.types";

function mapToContactCtaData(map: Record<string, unknown>): ContactCtaData {
  return {
    eyebrow: (map.eyebrow as string) ?? "",
    titlePrefix: (map.titlePrefix as string) ?? "",
    titleHighlight: (map.titleHighlight as string) ?? "",
    description: (map.description as string) ?? "",
    ctaLabel: (map.ctaLabel as string) ?? "",
    ctaHref: (map.ctaHref as string) ?? "",
    backgroundColor: (map.backgroundColor as string) ?? "#0a0a0a",
    eyebrowColor: (map.eyebrowColor as string) ?? "#fbbf24",
    titleColor: (map.titleColor as string) ?? "#ffffff",
    highlightColor: (map.highlightColor as string) ?? "#fbbf24",
    descriptionColor: (map.descriptionColor as string) ?? "#a8a29e",
    buttonBgColor: (map.buttonBgColor as string) ?? "#fbbf24",
    buttonTextColor: (map.buttonTextColor as string) ?? "#1c1917",
  };
}

export function ContactCtaPage() {
  const [searchParams] = useSearchParams();
  const sectionId = Number(searchParams.get("id"));

  const { data: section, isLoading } = useSection(sectionId);
  const { mutate: save } = useUpdateSectionData();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<ContactCtaData>({ defaultValues: mapToContactCtaData({}) });

  useEffect(() => {
    if (section) reset(mapToContactCtaData(section.data.map));
  }, [section, reset]);

  const submit = handleSubmit((values) => {
    save({ id: sectionId, data: values as unknown as Record<string, unknown> });
    reset(values);
  });

  if (isLoading) {
    return (
      <PageContainer title="CTA Liên hệ" description="Đang tải...">
        <div className="p-8">Đang tải...</div>
      </PageContainer>
    );
  }

  return (
    <form onSubmit={submit}>
      <PageContainer
        title="CTA Liên hệ"
        description="Khối kêu gọi hành động cuối trang chủ với nút vàng."
      >
        <SectionCard
          icon={<Type className="h-4 w-4" />}
          title="Tiêu đề"
          description="Eyebrow, tiêu đề chia thành tiền tố + in nghiêng nổi bật, và nội dung hỗ trợ."
        >
          <div className="grid gap-5">
            {/* Eyebrow */}
            <div className="grid grid-cols-[1fr_160px] items-start gap-3">
              <FormField label="Eyebrow" htmlFor="cta-eyebrow">
                <Input id="cta-eyebrow" {...register("eyebrow")} />
              </FormField>
              <FormField label="Màu eyebrow" htmlFor="cta-eyebrow-color">
                <Controller
                  control={control}
                  name="eyebrowColor"
                  render={({ field }) => (
                    <ColorField id="cta-eyebrow-color" value={field.value} onChange={field.onChange} />
                  )}
                />
              </FormField>
            </div>

            {/* Tiêu đề chính */}
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid grid-cols-[1fr_160px] items-start gap-3">
                <FormField label="Tiền tố tiêu đề" htmlFor="cta-prefix">
                  <Input id="cta-prefix" {...register("titlePrefix")} />
                </FormField>
                <FormField label="Màu tiêu đề" htmlFor="cta-title-color">
                  <Controller
                    control={control}
                    name="titleColor"
                    render={({ field }) => (
                      <ColorField id="cta-title-color" value={field.value} onChange={field.onChange} />
                    )}
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-[1fr_160px] items-start gap-3">
                <FormField label="Từ in nghiêng nổi bật" htmlFor="cta-highlight">
                  <Input id="cta-highlight" {...register("titleHighlight")} />
                </FormField>
                <FormField label="Màu từ nổi bật" htmlFor="cta-highlight-color">
                  <Controller
                    control={control}
                    name="highlightColor"
                    render={({ field }) => (
                      <ColorField id="cta-highlight-color" value={field.value} onChange={field.onChange} />
                    )}
                  />
                </FormField>
              </div>
            </div>

            {/* Mô tả */}
            <div className="grid grid-cols-[1fr_160px] items-start gap-3">
              <FormField label="Mô tả" htmlFor="cta-desc">
                <Textarea id="cta-desc" rows={3} {...register("description")} />
              </FormField>
              <FormField label="Màu mô tả" htmlFor="cta-desc-color">
                <Controller
                  control={control}
                  name="descriptionColor"
                  render={({ field }) => (
                    <ColorField id="cta-desc-color" value={field.value} onChange={field.onChange} />
                  )}
                />
              </FormField>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          icon={<Mail className="h-4 w-4" />}
          title="Kêu gọi hành động"
          description="Nhãn nút và đích đến."
        >
          <div className="grid gap-5">
            {/* Nhãn nút + 2 màu nút */}
            <div className="grid grid-cols-[1fr_160px_160px] items-start gap-3">
              <FormField label="Nhãn nút" htmlFor="cta-label">
                <Input id="cta-label" {...register("ctaLabel")} />
              </FormField>
              <FormField label="Màu chữ nút" htmlFor="cta-btn-text">
                <Controller
                  control={control}
                  name="buttonTextColor"
                  render={({ field }) => (
                    <ColorField id="cta-btn-text" value={field.value} onChange={field.onChange} />
                  )}
                />
              </FormField>
              <FormField label="Màu nền nút" htmlFor="cta-btn-bg">
                <Controller
                  control={control}
                  name="buttonBgColor"
                  render={({ field }) => (
                    <ColorField id="cta-btn-bg" value={field.value} onChange={field.onChange} />
                  )}
                />
              </FormField>
            </div>

            {/* URL */}
            <FormField label="URL đích" htmlFor="cta-href">
              <Input id="cta-href" placeholder="/contact" {...register("ctaHref")} />
            </FormField>
          </div>
        </SectionCard>

        <SectionCard
          icon={<Palette className="h-4 w-4" />}
          title="Nền"
          description="Màu nền phía sau toàn bộ khối."
        >
          <div className="max-w-[340px]">
            <FormField label="Màu nền" htmlFor="cta-bg">
              <Controller
                control={control}
                name="backgroundColor"
                render={({ field }) => (
                  <ColorField id="cta-bg" value={field.value} onChange={field.onChange} />
                )}
              />
            </FormField>
          </div>
        </SectionCard>

        <SaveBar
          isDirty={isDirty}
          onSave={submit}
          onReset={() => reset(mapToContactCtaData(section?.data?.map ?? {}))}
          saveLabel="Lưu CTA"
        />
      </PageContainer>
    </form>
  );
}
