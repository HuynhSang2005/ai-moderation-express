import type { Request, Response } from "express";
import { z } from "zod";
import { config } from "../config/env";
import { moderateWithHF } from "../services/moderation/huggingface.service";
import { moderateWithOpenAI } from "../services/moderation/openai.service";

const bodySchema = z.object({
  text: z.string().min(1, "text is required"),
});

export async function moderateComment(req: Request, res: Response) {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { text } = parsed.data;

  try {
    const decision = config.provider === "huggingface" ? await moderateWithHF(text) : await moderateWithOpenAI(text);

    // log lại decision + text để check
    console.log("Moderation decision:", decision, "for text:", text);

    return res.json(decision);
  } catch (e: any) {
    return res.status(500).json({ error: e.message ?? "server error" });
  }
}
