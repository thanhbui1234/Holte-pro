import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button, Input, Textarea, Switch, Label } from "shared-ui";
import { PageContainer } from "@/components/composite/PageContainer";
import { FormField } from "@/components/composite/FormField";
import { SaveBar } from "@/components/composite/SaveBar";
import { FormVideoPicker } from "@/components/composite/FormVideoPicker";
import { FormVideoListPicker } from "@/components/composite/FormVideoListPicker";
import { sectionFormSchema } from "@/features/section-crud/schema";
import type { SectionFormValues } from "@/features/section-crud/schema";
import {
  useSection,
  useCreateSection,
  useUpdateSection,
} from "@/features/section-crud/hooks/use-section-crud";

export function SectionCrudFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const sectionId = Number(id);

  const { data: section, isLoading } = useSection(sectionId);
  const { mutate: createSection, isPending: isCreating } = useCreateSection();
  const { mutate: updateSection, isPending: isUpdating } = useUpdateSection();

  const isSaving = isCreating || isUpdating;

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: {
      name: "",
      description: "",
      displayOrder: 0,
      status: "ACTIVE",
      dynamicFields: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "dynamicFields",
  });

  useEffect(() => {
    if (section && isEditing) {
      const map = section.data?.map ?? {};
      const meta = (map.__meta as Record<string, string>) ?? {};
      const dynamicFields = Object.entries(map)
        .filter(([key]) => key !== "__meta")
        .map(([key, value]) => {
          const type = (meta[key] as "text" | "video" | "video_list") || "text";
          let parsedValue = value;
          if (type === "text") {
            parsedValue = typeof value === "string" ? value : JSON.stringify(value);
          } else if (type === "video_list") {
            parsedValue = Array.isArray(value) ? value : [];
          }
          return {
            key,
            value: parsedValue,
            fieldType: type,
          };
        });

      form.reset({
        name: section.name,
        description: section.description || "",
        displayOrder: section.displayOrder || 0,
        status: section.status || "ACTIVE",
        dynamicFields,
      });
    }
  }, [section, isEditing, form]);

  const onSubmit = (values: SectionFormValues) => {
    // Transform dynamic fields array back to JSON object
    const meta: Record<string, "text" | "video" | "video_list"> = {};
    const dataObject = values.dynamicFields.reduce((acc, field) => {
      acc[field.key] = field.value;
      meta[field.key] = field.fieldType;
      return acc;
    }, {} as Record<string, any>);

    dataObject.__meta = meta;

    if (isEditing) {
      updateSection(
        {
          id: sectionId,
          name: values.name,
          description: values.description,
          displayOrder: values.displayOrder,
          status: values.status,
          data: dataObject,
        },
        {
          onSuccess: () => navigate("/section-crud"),
        }
      );
    } else {
      createSection(
        {
          name: values.name,
          description: values.description,
          displayOrder: values.displayOrder,
          status: values.status,
          data: dataObject,
        },
        {
          onSuccess: () => navigate("/section-crud"),
        }
      );
    }
  };

  if (isEditing && isLoading) {
    return (
      <PageContainer title="Đang tải...">
        <div className="flex h-32 items-center justify-center">Đang tải section...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={isEditing ? "Chỉnh sửa section" : "Tạo section mới"}
      description="Xác định các trường chuẩn và trường động tùy chỉnh cho section này."
      badge="CMS"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-24">
        {/* Basic Fields */}
        <div className="space-y-6 rounded-xl border border-border/60 bg-background p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Cấu hình cơ bản</h3>
            <p className="text-sm text-muted-foreground">Cài đặt chuẩn cho section</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="Tên section" htmlFor="name">
              <Input
                id="name"
                placeholder="vd: Hero Banner"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </FormField>

            <FormField label="Thứ tự hiển thị" htmlFor="displayOrder">
              <Input
                id="displayOrder"
                type="number"
                {...form.register("displayOrder", { valueAsNumber: true })}
              />
            </FormField>
          </div>

          <FormField label="Mô tả" htmlFor="description">
            <Textarea
              id="description"
              placeholder="Ghi chú nội bộ về section này"
              className="h-20 resize-none"
              {...form.register("description")}
            />
          </FormField>

          <div className="flex items-center justify-between rounded-lg border border-border/60 p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Trạng thái kích hoạt</Label>
              <p className="text-sm text-muted-foreground">
                Xác định section này có hiển thị trên trang khách hàng không.
              </p>
            </div>
            <Switch
              checked={form.watch("status") === "ACTIVE"}
              onCheckedChange={(checked) => form.setValue("status", checked ? "ACTIVE" : "INACTIVE", { shouldDirty: true })}
            />
          </div>
        </div>

        {/* Dynamic Fields */}
        <div className="space-y-6 rounded-xl border border-border/60 bg-background p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium">Trường dữ liệu tùy chỉnh</h3>
              <p className="text-sm text-muted-foreground">Thuộc tính động có sẵn trong giao diện</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ key: "", value: "", fieldType: "text" })}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Thêm trường
            </Button>
          </div>

          {fields.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
              Chưa có trường tùy chỉnh. Nhấp "Thêm trường" để tạo.
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <Label className="text-xs text-muted-foreground">Tên khóa</Label>
                    <Input
                      placeholder="vd: title, layout, imageUrl"
                      {...form.register(`dynamicFields.${index}.key` as const)}
                    />
                    {form.formState.errors.dynamicFields?.[index]?.key && (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.dynamicFields[index]?.key?.message}
                      </p>
                    )}

                    <div className="pt-2">
                      <Label className="text-xs text-muted-foreground">Loại trường</Label>
                      <select
                        className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        {...form.register(`dynamicFields.${index}.fieldType` as const)}
                      >
                        <option value="text">Văn bản / Tổng quát</option>
                        <option value="video">Video (Đơn)</option>
                        <option value="video_list">Danh sách video (Nhiều)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex-[2] space-y-2">
                    <Label className="text-xs text-muted-foreground">Giá trị</Label>
                    {form.watch(`dynamicFields.${index}.fieldType`) === "video" ? (
                      <FormVideoPicker
                        name={`dynamicFields.${index}.value`}
                        control={form.control}
                        className="mt-1"
                      />
                    ) : form.watch(`dynamicFields.${index}.fieldType`) === "video_list" ? (
                      <FormVideoListPicker
                        name={`dynamicFields.${index}.value`}
                        control={form.control}
                        className="mt-1"
                      />
                    ) : (
                      <Textarea
                        placeholder="Nhập giá trị..."
                        className="min-h-[108px] resize-y"
                        {...form.register(`dynamicFields.${index}.value` as const)}
                      />
                    )}
                  </div>
                  <div className="pt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Bar */}
        <SaveBar
          isDirty={form.formState.isDirty}
          onSave={form.handleSubmit(onSubmit)}
          onReset={() => navigate("/section-crud")}
          isSubmitting={isSaving}
        />
      </form>
    </PageContainer>
  );
}
