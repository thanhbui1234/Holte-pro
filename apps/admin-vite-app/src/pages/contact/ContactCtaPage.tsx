import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Mail, Palette, Type } from "lucide-react";
import { useContactCta, useUpdateContactCta } from "@/features/contact/hooks/use-contact";
import { PageContainer } from "@/components/composite/PageContainer";
import { SectionCard } from "@/components/composite/SectionCard";
import { FormField } from "@/components/composite/FormField";
import { SaveBar } from "@/components/composite/SaveBar";
import { ColorField } from "@/components/composite/ColorField";
import { Input } from "shared-ui";
import { Textarea } from "shared-ui";
import type { ContactCtaData } from "@/features/contact/types/contact.types";

export function ContactCtaPage() {
  const { data, isLoading } = useContactCta();
  const { mutate: save } = useUpdateContactCta();
  
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<ContactCtaData>({ defaultValues: data });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const submit = handleSubmit((values) => {
    save(values);
    reset(values);
  });

  if (isLoading) {
    return <PageContainer title="Contact CTA" description="Loading..."><div className="p-8">Loading...</div></PageContainer>;
  }

  return (
    <form onSubmit={submit}>
      <PageContainer
        title="Contact CTA"
        description="The closing call-to-action block on the homepage with the gold button."
      >
        <SectionCard
          icon={<Type className="h-4 w-4" />}
          title="Heading"
          description="Eyebrow, headline split into prefix + italic highlight, and the supporting copy."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Eyebrow" htmlFor="cta-eyebrow" className="md:col-span-2">
              <Input id="cta-eyebrow" {...register("eyebrow")} />
            </FormField>
            <FormField label="Title prefix" htmlFor="cta-prefix">
              <Input id="cta-prefix" {...register("titlePrefix")} />
            </FormField>
            <FormField label="Italic highlight word" htmlFor="cta-highlight">
              <Input id="cta-highlight" {...register("titleHighlight")} />
            </FormField>
            <FormField label="Description" htmlFor="cta-desc" className="md:col-span-2">
              <Textarea id="cta-desc" rows={3} {...register("description")} />
            </FormField>
          </div>
        </SectionCard>

        <SectionCard
          icon={<Mail className="h-4 w-4" />}
          title="Call to action"
          description="Button label and target."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Button label" htmlFor="cta-label">
              <Input id="cta-label" {...register("ctaLabel")} />
            </FormField>
            <FormField label="Target URL" htmlFor="cta-href">
              <Input id="cta-href" placeholder="/contact" {...register("ctaHref")} />
            </FormField>
          </div>
        </SectionCard>

        <SectionCard
          icon={<Palette className="h-4 w-4" />}
          title="Background"
          description="The wash behind this closing block."
        >
          <FormField label="Background colour" htmlFor="cta-bg">
            <Controller
              control={control}
              name="backgroundColor"
              render={({ field }) => (
                <ColorField
                  id="cta-bg"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FormField>
        </SectionCard>

        <SaveBar
          isDirty={isDirty}
          onSave={submit}
          onReset={() => reset(data)}
          saveLabel="Save CTA"
        />
      </PageContainer>
    </form>
  );
}
