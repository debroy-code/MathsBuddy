export type HistoryItem = {
  id: string;
  problem: string;
  explanation: string;
  topic: string;
};

export type ExplanationState = {
  id?: string;
  problem?: string;
  explanation?: string;
  topic?: string;
  error?: string;
  key?: number;
};
