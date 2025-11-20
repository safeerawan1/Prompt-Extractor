export interface VideoAnalysis {
  visualStyle: string;
  cinematography: string;
  pacingAndMood: string;
  technicalDetails: string;
  generatedPrompt: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  PROCESSING_FILE = 'PROCESSING_FILE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}