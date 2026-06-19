import { z } from "zod";

export const dynamicFieldSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.any(), // Support string, array of strings, etc.
  fieldType: z.enum(["text", "video", "video_list"]),
});

export const sectionFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  displayOrder: z.number().int().optional(),
  status: z.string(),
  dynamicFields: z.array(dynamicFieldSchema),
});

export type SectionFormValues = z.infer<typeof sectionFormSchema>;
