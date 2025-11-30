// 백엔드 /upload API 응답 타입 정의

export interface SpacingViolation {
  id1: number;
  id2: number;
  classes: string[];
  distance: number;
}

export interface TargetSizeViolation {
  id: number;
  element: string;
  bbox: number[];
  reason: string;
  detail: string;
}

export interface LabelPairingViolation {
  // label_pairing_result.violations의 구조 (현재는 비어있음)
  [key: string]: any;
}

export interface Violation {
  rule: 'spacing' | 'target_size' | 'label_pairing';
  ids: number[];
  classes: string[];
  detail: string;
  index: number;
}

export interface AnalysisSummary {
  passed: boolean;
  total_violations: number;
  score: number;
}

export interface SpacingResult {
  passed: boolean;
  violations: SpacingViolation[];
}

export interface TargetSizeResult {
  passed: boolean;
  violations: TargetSizeViolation[];
}

export interface LabelPairingResult {
  passed: boolean;
  details: any[];
  violations: LabelPairingViolation[];
}

export interface Analysis {
  summary: AnalysisSummary;
  violations: Violation[];
  spacing_result: SpacingResult;
  target_size_result: TargetSizeResult;
  label_pairing_result: LabelPairingResult;
}

export interface AiResult {
  detections: any[];
  analysis: Analysis;
  message: string;
}

export interface UploadResponseItem {
  user_id: string;
  image_url: string;
  debug_image_url: string;
  score: number;
  ai_result: AiResult;
  message: string;
}

// API는 항상 배열로 반환
export type UploadResponse = UploadResponseItem[];

// Result 페이지에서 사용할 처리된 Issue 타입
export interface ProcessedIssue {
  id: string;
  title: string;
  description: string;
  count: number;
  details?: string[];
}

