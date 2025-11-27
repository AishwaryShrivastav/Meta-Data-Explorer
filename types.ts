export interface FileMetaData {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  webkitRelativePath?: string;
}

export interface CustomField {
  id: string;
  key: string;
  value: string;
}

export interface EditableMetaData {
  name: string;
  type: string;
  lastModified: string; // ISO string for date input
  description: string;
  keywords: string[];
  customFields: CustomField[];
}

export interface AIAnalysisResult {
  summary: string;
  keywords: string[];
  suggestedFilename: string;
  detectedMimeType: string;
  technicalDetails: Record<string, any>;
}

export enum AppState {
  IDLE = 'IDLE',
  EDITING = 'EDITING',
}