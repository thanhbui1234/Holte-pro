import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Film } from "lucide-react";
import { useSection, useUpdateSectionData } from "@/features/layout/hooks/use-layout";
import { PageContainer } from "@/components/composite/PageContainer";
import { SectionCard } from "@/components/composite/SectionCard";
import { FormField } from "@/components/composite/FormField";
import { FormMediaField } from "@/components/composite/FormMediaField";
import { FormVideoPicker } from "@/components/composite/FormVideoPicker";
import { SaveBar } from "@/components/composite/SaveBar";
import { Input } from "shared-ui";
import type { BannerData } from "@/features/banner/types/banner.types";

function mapToBannerData(map: Record<string, unknown>): BannerData {
  return {
    videoSrc: (map.videoSrc as string) ?? "",
    mobileVideo: (map.mobileVideo as string) ?? "",
    logoSrc: (map.logoSrc as string) ?? "",
    logoAlt: (map.logoAlt as string) ?? "",
    scrollLabel: (map.scrollLabel as string) ?? "",
  };
}

export function BannerPage() {
  const [searchParams] = useSearchParams();
  const sectionId = Number(searchParams.get("id"));

  const { data: section, isLoading } = useSection(sectionId);
  const { mutate: save } = useUpdateSectionData();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isDirty },
  } = useForm<BannerData>({
    defaultValues: mapToBannerData({}),
  });

  useEffect(() => {
    if (section) reset(mapToBannerData(section.data.map));
  }, [section, reset]);

  const submit = handleSubmit((values) => {
    save({ id: sectionId, data: values as unknown as Record<string, unknown> });
    reset(values);
  });

  if (isLoading) {
    return (
      <PageContainer title="Banner Chính" description="Đang tải...">
        <div className="p-8">Đang tải...</div>
      </PageContainer>
    );
  }

  return (
    <form onSubmit={submit}>
      <PageContainer
        title="Banner Chính"
        description="Video toàn màn hình trên trang chủ, cùng với logo ở giữa."
      >
        <SectionCard
          icon={<Film className="h-4 w-4" />}
          title="Phương tiện"
          description="Tải lên hoặc kéo thả file video."
        >
          <div className="space-y-4">
            <FormVideoPicker
              control={control}
              name="videoSrc"
              label="Admin Video"
            />
            <FormVideoPicker
              control={control}
              name="mobileVideo"
              label="Mobile Video"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Văn bản alt logo" htmlFor="banner-alt">
                <Input id="banner-alt" {...register("logoAlt")} />
              </FormField>
              <FormField
                label="Nhãn nút cuộn"
                htmlFor="banner-scroll"
                hint="Dùng làm aria-label cho mũi tên xuống ở cuối banner."
              >
                <Input id="banner-scroll" {...register("scrollLabel")} />
              </FormField>
            </div>
          </div>
        </SectionCard>

        <SaveBar
          isDirty={isDirty}
          onSave={submit}
          onReset={() => reset(mapToBannerData(section?.data?.map ?? {}))}
          saveLabel="Lưu banner"
        />
      </PageContainer>
    </form>
  );
}
