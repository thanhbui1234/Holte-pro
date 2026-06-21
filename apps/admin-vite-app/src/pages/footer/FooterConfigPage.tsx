import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Globe, Phone, Share2 } from "lucide-react";
import { useFooter, useUpdateFooter } from "@/features/footer/hooks/use-footer";
import { PageContainer } from "@/components/composite/PageContainer";
import { SectionCard } from "@/components/composite/SectionCard";
import { FormField } from "@/components/composite/FormField";
import { SaveBar } from "@/components/composite/SaveBar";
import { Input } from "shared-ui";
import { Textarea } from "shared-ui";
import type { FooterData } from "@/features/footer/types/footer.types";

export function FooterConfigPage() {
  const { data, isLoading } = useFooter();
  const { mutate: save } = useUpdateFooter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<FooterData>({ defaultValues: data });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const submit = handleSubmit((values) => {
    save(values);
    reset(values);
  });

  if (isLoading) {
    return <PageContainer title="Footer" description="Đang tải..."><div className="p-8">Đang tải...</div></PageContainer>;
  }

  return (
    <form onSubmit={submit}>
      <PageContainer
        title="Footer"
        description="Tagline, thông tin liên hệ, liên kết mạng xã hội và dòng bản quyền."
      >
        <SectionCard
          icon={<Globe className="h-4 w-4" />}
          title="Thương hiệu"
          description="Tagline bên dưới logo và văn bản tín dụng ở thanh dưới."
        >
          <div className="space-y-4">
            <FormField label="Tagline" htmlFor="ft-tagline">
              <Textarea
                id="ft-tagline"
                rows={2}
                {...register("tagline")}
              />
            </FormField>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Bản quyền"
                htmlFor="ft-copy"
                hint="Dùng {year} như placeholder cho năm hiện tại."
              >
                <Input id="ft-copy" {...register("copyright")} />
              </FormField>
              <FormField label="Dòng tín dụng" htmlFor="ft-credit">
                <Input id="ft-credit" {...register("credit")} />
              </FormField>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          icon={<Phone className="h-4 w-4" />}
          title="Liên hệ"
          description="Cột liên hệ ở bên trái footer."
        >
          <div className="space-y-4">
            <FormField label="Tiêu đề" htmlFor="ft-contact-heading">
              <Input id="ft-contact-heading" {...register("contactHeading")} />
            </FormField>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Điện thoại" htmlFor="ft-phone">
                <Input id="ft-phone" {...register("phone")} />
              </FormField>
              <FormField label="Email" htmlFor="ft-email">
                <Input id="ft-email" type="email" {...register("email")} />
              </FormField>
              <FormField label="Địa chỉ" htmlFor="ft-address" className="md:col-span-2">
                <Input id="ft-address" {...register("address")} />
              </FormField>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          icon={<Share2 className="h-4 w-4" />}
          title="Theo dõi chúng tôi"
          description="Cột mạng xã hội ở bên phải footer."
        >
          <div className="space-y-4">
            <FormField label="Tiêu đề" htmlFor="ft-social-heading">
              <Input id="ft-social-heading" {...register("socialHeading")} />
            </FormField>
            <div className="grid gap-4 md:grid-cols-3">
              <FormField label="Facebook" htmlFor="ft-fb">
                <Input id="ft-fb" {...register("facebookUrl")} />
              </FormField>
              <FormField label="Instagram" htmlFor="ft-ig">
                <Input id="ft-ig" {...register("instagramUrl")} />
              </FormField>
              <FormField label="YouTube" htmlFor="ft-yt">
                <Input id="ft-yt" {...register("youtubeUrl")} />
              </FormField>
            </div>
          </div>
        </SectionCard>

        <SaveBar
          isDirty={isDirty}
          onSave={submit}
          onReset={() => reset(data)}
          saveLabel="Lưu footer"
        />
      </PageContainer>
    </form>
  );
}
