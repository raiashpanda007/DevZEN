import { z } from "zod";

export const TemplateSchema = z.object({
  name: z.string(),
  id: z.string(),
  image: z.string() // Assuming the image is a URL
});


export const CreateProjectSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  template: TemplateSchema, // Use TemplateSchema instead of z.infer<Template>()
});


export type Template = z.infer<typeof TemplateSchema>;
export type CreateProject = z.infer<typeof CreateProjectSchema>;
