import type { HFLabelScore, HFModelResponse, ModerationDecision } from "../huggingface";

// Kiểm tra một object có phải là HFLabelScore
export function isHFLabelScore(obj: any): obj is HFLabelScore {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.label === "string" &&
    typeof obj.score === "number"
  );
}

// Kiểm tra một object có phải là HFModelResponse (mảng các HFLabelScore)
export function isHFModelResponse(obj: any): obj is HFModelResponse {
  return Array.isArray(obj) && obj.every(isHFLabelScore);
}

// Kiểm tra một object có phải là ModerationDecision
export function isModerationDecision(obj: any): obj is ModerationDecision {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.allowed === "boolean" &&
    Array.isArray(obj.reasons) &&
    (obj.debug === undefined || typeof obj.debug === "object" || typeof obj.debug === "string")
  );
}