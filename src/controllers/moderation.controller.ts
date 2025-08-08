import type { Request, Response } from "express";
import { z } from "zod";

const bodySchema = z.object({
  text: z.string().min(1, "text is required")
});

export async function moderateComment(req: Request, res: Response) {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { text } = parsed.data;

  const decision = {
    allowed: true,
    reasons: [] as string[]
  };

  return res.json(decision);
}
