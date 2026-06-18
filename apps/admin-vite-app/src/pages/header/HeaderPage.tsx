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
  } = useForm<HeaderData>({ defaultValues: data });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const submit = handleSubmit((values) => {
    save(values);
    reset(values);
  });

  if (isLoading) {
    return <PageContainer title="Header" description="Loading..."><div className="p-8">Loading...</div></PageContainer>;
  }

  return (
    <form onSubmit={submit}>
      <PageContainer
        title="Header"
        description="Three social links rendered top-right on every page."
      >
        <SectionCard
          icon={<PanelsTopLeft className="h-4 w-4" />}
          title="Social links"
          description="Use full https:// URLs. Email uses a mailto: prefix."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Facebook URL" htmlFor="hdr-fb">
              <Input
                id="hdr-fb"
                placeholder="https://facebook.com/..."
                {...register("facebookUrl")}
              />
            </FormField>
            <FormField label="Instagram URL" htmlFor="hdr-ig">
              <Input
                id="hdr-ig"
                placeholder="https://instagram.com/..."
                {...register("instagramUrl")}
              />
            </FormField>
            <FormField label="Email link" htmlFor="hdr-email" className="md:col-span-2">
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
          onReset={() => reset(data)}
          saveLabel="Save header"
        />
      </PageContainer>
    </form>
  );
}
