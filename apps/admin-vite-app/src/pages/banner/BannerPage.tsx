import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Film, Loader2 } from "lucide-react";
import { useBanner, useUpdateBanner } from "@/features/banner/hooks/use-banner";
import { PageContainer } from "@/components/composite/PageContainer";
import { SectionCard } from "@/components/composite/SectionCard";
import { FormField } from "@/components/composite/FormField";
import { FormMediaField } from "@/components/composite/FormMediaField";
import { FormVideoPicker } from "@/components/composite/FormVideoPicker";
import { SaveBar } from "@/components/composite/SaveBar";
import { Input } from "shared-ui";
import type { BannerData } from "@/features/banner/types/banner.types";
import { videoApi } from "@/shared/api";

export function BannerPage() {
  const { data, isLoading } = useBanner();
  const { mutate: save } = useUpdateBanner();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { isDirty },
  } = useForm<BannerData>({ defaultValues: data });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const submit = handleSubmit((values) => {
    save(values);
    reset(values);
  });

  if (isLoading) {
    return <PageContainer title="Hero Banner" description="Loading..."><div className="p-8">Loading...</div></PageContainer>;
  }

  return (
    <form onSubmit={submit}>
      <PageContainer
        title="Hero Banner"
        description="The fullscreen video on the homepage, plus the centred logo overlay."
      >
        <SectionCard
          icon={<Film className="h-4 w-4" />}
          title="Media"
          description="Upload or drag & drop video and logo files."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative">
              <FormVideoPicker
                control={control}
                name="videoSrc"
                label="Video source"
                onChange={(youtubeEmbedUrl) => {
                  if (youtubeEmbedUrl) {
                    // Auto save banner config immediately
                    handleSubmit((values) => {
                      const newValues = { ...values, videoSrc: youtubeEmbedUrl };
                      save(newValues);
                      reset(newValues);
                    })();
                  }
                }}
              />
            </div>
            <FormMediaField
              control={control}
              name="logoSrc"
              label="Logo source"
              accept="image/*"
              placeholder="Drop a logo image or click to select"
            />
            <FormField label="Logo alt text" htmlFor="banner-alt">
              <Input id="banner-alt" {...register("logoAlt")} />
            </FormField>
            <FormField
              label="Scroll button label"
              htmlFor="banner-scroll"
              hint="Used as an aria-label for the chevron at the bottom of the hero."
            >
              <Input id="banner-scroll" {...register("scrollLabel")} />
            </FormField>
          </div>
        </SectionCard>

        <SaveBar
          isDirty={isDirty}
          onSave={submit}
          onReset={() => reset(data)}
          saveLabel="Save banner"
        />
      </PageContainer>
    </form>
  );
}
