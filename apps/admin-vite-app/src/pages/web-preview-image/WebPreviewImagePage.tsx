import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Image as ImageIcon } from "lucide-react";
import { useWebPreviewImage, useUpsertWebPreviewImage, useRemoveWebPreviewImage } from "@/features/web-preview-image";
import { PageContainer } from "@/components/composite/PageContainer";
import { SectionCard } from "@/components/composite/SectionCard";
import { FormField } from "@/components/composite/FormField";
import { SaveBar } from "@/components/composite/SaveBar";
import { Input, Button } from "shared-ui";
import type { WebPreviewImageData } from "@/features/web-preview-image";

export function WebPreviewImagePage() {
  const { data, isLoading } = useWebPreviewImage();
  const { mutate: save } = useUpsertWebPreviewImage();
  const { mutate: remove } = useRemoveWebPreviewImage();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isDirty },
  } = useForm<WebPreviewImageData>({ defaultValues: { imageUrl: data?.imageUrl || "" } });

  useEffect(() => {
    if (data) reset({ imageUrl: data.imageUrl || "" });
  }, [data, reset]);

  const submit = handleSubmit((values: WebPreviewImageData) => {
    save({ imageUrl: values.imageUrl || "" });
    reset(values);
  });

  const handleRemove = () => {
    remove();
    reset({ imageUrl: "" });
  };

  const currentImageUrl = useWatch({ control, name: "imageUrl" });

  if (isLoading) {
    return <PageContainer title="Web Preview Image" description="Đang tải..."><div className="p-8">Đang tải...</div></PageContainer>;
  }

  return (
    <form onSubmit={submit}>
      <PageContainer
        title="Web Preview Image (OG Image)"
        description="Quản lý ảnh đại diện khi link trang web được chia sẻ lên các mạng xã hội như Facebook, Zalo."
      >
        <SectionCard
          icon={<ImageIcon className="h-4 w-4" />}
          title="Nguồn ảnh"
          description="Dán đường dẫn trực tiếp của một hình ảnh bất kỳ vào đây."
        >
          <div className="space-y-4">
            <FormField label="URL hình ảnh" htmlFor="og-image-url">
              <Input
                id="og-image-url"
                placeholder="https://example.com/image.jpg"
                {...register("imageUrl")}
              />
            </FormField>
            
            {currentImageUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Ảnh xem trước:</p>
                <div className="relative border rounded-md overflow-hidden bg-muted flex items-center justify-center max-w-[600px] h-[315px]">
                  {/* Aspect ratio for OG image is typically 1200x630, which is roughly 1.91:1 */}
                  <img 
                    src={currentImageUrl} 
                    alt="Preview" 
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSI1MCUiIHg9IjUwJSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkludmFsaWQgSW1hZ2UgVVJMPC90ZXh0Pjwvc3ZnPg=='; // fallback "Invalid Image URL" svg
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
               <Button 
                 type="button" 
                 variant="destructive" 
                 onClick={handleRemove}
                 disabled={!data?.imageUrl && !currentImageUrl}
               >
                 Xóa ảnh hiện tại
               </Button>
            </div>
          </div>
        </SectionCard>

        <SaveBar
          isDirty={isDirty}
          onSave={submit}
          onReset={() => reset({ imageUrl: data?.imageUrl || "" })}
          saveLabel="Lưu ảnh"
        />
      </PageContainer>
    </form>
  );
}
