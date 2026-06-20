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
import { Input } from "shared-ui";
import { Textarea } from "shared-ui";
import type { AboutData } from "@/features/about/types/about.types";

function mapToAboutData(map: Record<string, unknown>): AboutData {
  return {
    eyebrow: (map.eyebrow as string) ?? "",
    titlePrefix: (map.titlePrefix as string) ?? "",
    titleHighlight: (map.titleHighlight as string) ?? "",
    descriptionEn: (map.descriptionEn as string) ?? "",
    descriptionVi: (map.descriptionVi as string) ?? "",
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
      <PageContainer title="About section" description="Loading...">
        <div className="p-8">Loading...</div>
      </PageContainer>
    );
  }

  return (
    <form onSubmit={submit}>
      <PageContainer
        title="About section"
        description="The dark intro block on the homepage: heading, story, brand pillars and credibility stats."
      >
        <SectionCard
          icon={<Type className="h-4 w-4" />}
          title="Heading"
          description="Eyebrow, the long title split into prefix + italic highlight word."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Eyebrow" htmlFor="about-eyebrow" className="md:col-span-2">
              <Input id="about-eyebrow" {...register("eyebrow")} />
            </FormField>
            <FormField label="Title prefix" htmlFor="about-prefix">
              <Input id="about-prefix" {...register("titlePrefix")} />
            </FormField>
            <FormField label="Italic highlight word" htmlFor="about-highlight">
              <Input id="about-highlight" {...register("titleHighlight")} />
            </FormField>
          </div>
        </SectionCard>

        <SectionCard
          icon={<Palette className="h-4 w-4" />}
          title="Background"
          description="The dark wash behind this section."
        >
          <FormField label="Background colour" htmlFor="about-bg">
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
          title="Story"
          description="English copy is the primary body. Vietnamese copy is shown italicised below."
        >
          <div className="space-y-4">
            <FormField label="English description" htmlFor="about-desc-en">
              <Textarea id="about-desc-en" rows={4} {...register("descriptionEn")} />
            </FormField>
            <FormField label="Vietnamese description" htmlFor="about-desc-vi">
              <Textarea id="about-desc-vi" rows={4} {...register("descriptionVi")} />
            </FormField>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Core pillars" hint="Shown inline inside the description.">
                <Controller
                  control={control}
                  name="pillars"
                  render={({ field }) => (
                    <TagInput value={field.value} onChange={field.onChange} />
                  )}
                />
              </FormField>
              <FormField label="Legacy label" htmlFor="about-legacy">
                <Input id="about-legacy" {...register("legacyLabel")} />
              </FormField>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          icon={<BarChart3 className="h-4 w-4" />}
          title="Stats"
          description="Three numeric pills under the description."
        >
          <div className="space-y-3">
            {stats.fields.map((field, index) => (
              <div
                key={field.id}
                className="grid gap-3 rounded-lg border border-border/60 bg-muted/30 p-3 sm:grid-cols-2"
              >
                <FormField label={`Value ${index + 1}`}>
                  <Input {...register(`stats.${index}.value` as const)} />
                </FormField>
                <FormField label="Label">
                  <Input {...register(`stats.${index}.label` as const)} />
                </FormField>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          icon={<ImageIcon className="h-4 w-4" />}
          title="Images"
          description="First image renders large; the rest as the two small tiles."
        >
          <div className="space-y-3">
            {images.fields.map((field, index) => (
              <div
                key={field.id}
                className="grid gap-3 rounded-lg border border-border/60 bg-muted/30 p-3 sm:grid-cols-[1fr_1fr_auto]"
              >
                <FormField label={`Source ${index + 1}`}>
                  <Input
                    placeholder="/images/demo/a1.jpg"
                    {...register(`images.${index}.src` as const)}
                  />
                </FormField>
                <FormField label="Caption">
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
          saveLabel="Save About"
        />
      </PageContainer>
    </form>
  );
}
