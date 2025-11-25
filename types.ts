export interface FileMetaData {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  webkitRelativePath?: string;
}

export interface EditableMetaData {
  name: string;
  type: string;
  lastModified: string; // ISO string for date input
  description: string;
  keywords: string[];
}

export interface AIAnalysisResult {
  summary: string;
  keywords: string[];
  suggestedFilename: string;
  detectedMimeType: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  EDITING = 'EDITING',
}
