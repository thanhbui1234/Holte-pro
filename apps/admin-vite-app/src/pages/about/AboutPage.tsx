import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { BarChart3, Image as ImageIcon, Palette, Sparkles, Type } from "lucide-react";
import { useSection, useUpdateSectionData } from "@/features/layout/hooks/use-layout";
import { PageContainer } from "@/components/composite/PageContainer";
import { SectionCard } from "@/components/composite/SectionCard";
import { FormField } from "@/components/composite/FormField";
import { SaveBar } from "@/components/composite/SaveBar";
import { TagInput } from "@/components/composite/TagInput";
import { ColorField } from "@/components/composite/ColorField";
import { RichTextEditor } from "@/components/composite/RichTextEditor";
import { Input } from "shared-ui";
import type { AboutData } from "@/features/about/types/about.types";

function mapToAboutData(map: Record<string, unknown>): AboutData {
  return {
    eyebrow: (map.eyebrow as string) ?? "",
    eyebrowColor: (map.eyebrowColor as string) ?? "",
    titlePrefix: (map.titlePrefix as string) ?? "",
    titlePrefixColor: (map.titlePrefixColor as string) ?? "",
    titleHighlight: (map.titleHighlight as string) ?? "",
    titleHighlightColor: (map.titleHighlightColor as string) ?? "",
    descriptionEn: (map.descriptionEn as string) ?? "",
    descriptionEnColor: (map.descriptionEnColor as string) ?? "",
    descriptionVi: (map.descriptionVi as string) ?? "",
    descriptionViColor: (map.descriptionViColor as string) ?? "",
    pillars: (map.pillars as string[]) ?? [],
    legacyLabel: (map.legacyLabel as string) ?? "",
    backgroundColor: (map.backgroundColor as string) ?? "#0a0a0a",
    stats: (map.stats as AboutData["stats"]) ?? [],
    images: (map.images as AboutData["images"]) ?? [],
  };
}

export function AboutPage() {
  const [searchParams] = useSearchParams();
  const sectionId = Number(searchParams.get("id"));

  const { data: section, isLoading } = useSection(sectionId);
  const { mutate: save } = useUpdateSectionData();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm<AboutData>({ defaultValues: mapToAboutData({}) });

  useEffect(() => {
    if (section) reset(mapToAboutData(section.data.map));
  }, [section, reset]);

  const stats = useFieldArray({ control, name: "stats" });
  const images = useFieldArray({ control, name: "images" });

  const submit = handleSubmit((values) => {
    save({ id: sectionId, data: values as unknown as Record<string, unknown> });
    reset(values);
  });

  if (isLoading) {
    return (
      <PageContainer title="Phần Giới thiệu" description="Đang tải...">
        <div className="p-8">Đang tải...</div>
      </PageContainer>
    );
  }

  return (
    <form onSubmit={submit}>
      <PageContainer
        title="Phần Giới thiệu"
        description="Khối giới thiệu tối trên trang chủ: tiêu đề, câu chuyện, trụ cột thương hiệu và số liệu uy tín."
      >
        <SectionCard
          icon={<Type className="h-4 w-4" />}
          title="Tiêu đề"
          description="Eyebrow, tiêu đề dài chia thành tiền tố + từ in nghiêng nổi bật."
        >
          <div className="space-y-4">
            <FormField label="Eyebrow" htmlFor="about-eyebrow">
              <div className="flex gap-2">
                <Input id="about-eyebrow" className="flex-1" {...register("eyebrow")} />
                <Controller
                  control={control}
                  name="eyebrowColor"
                  render={({ field }) => (
                    <ColorField id="about-eyebrow-color" value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>
            </FormField>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Tiền tố tiêu đề" htmlFor="about-prefix">
                <div className="flex gap-2">
                  <Input id="about-prefix" className="flex-1" {...register("titlePrefix")} />
                  <Controller
                    control={control}
                    name="titlePrefixColor"
                    render={({ field }) => (
                      <ColorField id="about-prefix-color" value={field.value} onChange={field.onChange} />
                    )}
                  />
                </div>
              </FormField>
              <FormField label="Từ in nghiêng nổi bật" htmlFor="about-highlight">
                <div className="flex gap-2">
                  <Input id="about-highlight" className="flex-1" {...register("titleHighlight")} />
                  <Controller
                    control={control}
                    name="titleHighlightColor"
                    render={({ field }) => (
                      <ColorField id="about-highlight-color" value={field.value} onChange={field.onChange} />
                    )}
                  />
                </div>
              </FormField>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          icon={<Palette className="h-4 w-4" />}
          title="Nền"
          description="Nền tối phía sau phần này."
        >
          <FormField label="Màu nền" htmlFor="about-bg">
            <Controller
              control={control}
              name="backgroundColor"
              render={({ field }) => (
                <ColorField id="about-bg" value={field.value} onChange={field.onChange} />
              )}
            />
          </FormField>
        </SectionCard>

        <SectionCard
          icon={<Sparkles className="h-4 w-4" />}
          title="Câu chuyện"
          description="Nội dung tiếng Anh là chính. Nội dung tiếng Việt hiển thị in nghiêng bên dưới."
        >
          <div className="space-y-4">
            <FormField label="Mô tả tiếng Anh">
              <Controller
                control={control}
                name="descriptionEn"
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Nhập mô tả tiếng Anh..."
                  />
                )}
              />
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Màu chữ</span>
                <Controller
                  control={control}
                  name="descriptionEnColor"
                  render={({ field }) => (
                    <ColorField id="about-desc-en-color" value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>
            </FormField>
            <FormField label="Mô tả tiếng Việt">
              <Controller
                control={control}
                name="descriptionVi"
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Nhập mô tả tiếng Việt..."
                  />
                )}
              />
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Màu chữ</span>
                <Controller
                  control={control}
                  name="descriptionViColor"
                  render={({ field }) => (
                    <ColorField id="about-desc-vi-color" value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>
            </FormField>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Trụ cột cốt lõi" hint="Hiển thị ngay trong mô tả.">
                <Controller
                  control={control}
                  name="pillars"
                  render={({ field }) => (
                    <TagInput value={field.value} onChange={field.onChange} />
                  )}
                />
              </FormField>
              <FormField label="Nhãn di sản" htmlFor="about-legacy">
                <Input id="about-legacy" {...register("legacyLabel")} />
              </FormField>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          icon={<BarChart3 className="h-4 w-4" />}
          title="Số liệu"
          description="Ba thẻ số liệu bên dưới mô tả."
        >
          <div className="space-y-3">
            {stats.fields.map((field, index) => (
              <div
                key={field.id}
                className="grid gap-3 rounded-lg border border-border/60 bg-muted/30 p-3 sm:grid-cols-2"
              >
                <FormField label={`Giá trị ${index + 1}`}>
                  <Input {...register(`stats.${index}.value` as const)} />
                </FormField>
                <FormField label="Nhãn">
                  <Input {...register(`stats.${index}.label` as const)} />
                </FormField>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          icon={<ImageIcon className="h-4 w-4" />}
          title="Hình ảnh"
          description="Ảnh đầu tiên hiển thị lớn; các ảnh còn lại là hai ô nhỏ."
        >
          <div className="space-y-3">
            {images.fields.map((field, index) => (
              <div
                key={field.id}
                className="grid gap-3 rounded-lg border border-border/60 bg-muted/30 p-3 sm:grid-cols-[1fr_1fr_auto]"
              >
                <FormField label={`Nguồn ${index + 1}`}>
                  <Input
                    placeholder="/images/demo/a1.jpg"
                    {...register(`images.${index}.src` as const)}
                  />
                </FormField>
                <FormField label="Chú thích">
                  <Input {...register(`images.${index}.description` as const)} />
                </FormField>
                <div className="hidden h-9 w-16 self-end overflow-hidden rounded-md border bg-background sm:block">
                  <img
                    src={field.src}
                    alt={field.description}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SaveBar
          isDirty={isDirty}
          onSave={submit}
          onReset={() => reset(mapToAboutData(section?.data?.map ?? {}))}
          saveLabel="Lưu Giới thiệu"
        />
      </PageContainer>
    </form>
  );
}
