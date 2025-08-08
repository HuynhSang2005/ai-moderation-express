import { z } from "zod";

export const OpenAIModerationResultSchema = z.object({
  flagged: z.boolean(),
  categories: z.record(z.string(), z.boolean()),
  category_scores: z.record(z.string(), z.number()).optional()
});

export const OpenAIModerationResponseSchema = z.object({
  id: z.string(),
  model: z.string(),
  results: z.array(OpenAIModerationResultSchema)
});

export type OpenAIModerationResponse = z.infer<typeof OpenAIModerationResponseSchema>;
