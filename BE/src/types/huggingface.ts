export interface HFLabelScore {
  label: string;
  score: number;
}

export type HFModelResponse = HFLabelScore[];

export interface ModerationDecision {
  allowed: boolean;
  reasons: string[];
  debug?: any;
}