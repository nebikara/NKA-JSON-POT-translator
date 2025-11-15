
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  content: string;
  lineCount: number;
  parsedJson: any;
}

export interface Language {
  code: string;
  name: string;
}

export interface TranslationSettings {
  preserveFormatting: boolean;
  preserveCase: boolean;
  excludeNumbers: boolean;
  style: 'Standard' | 'Formal' | 'Informal' | 'Technical' | 'Simple';
  tone: 'Neutral' | 'Friendly' | 'Professional' | 'Excited' | 'Confident';
  creativity: number;
  customInstructions: string;
  glossary: string;
  chunkSize: number;
}

export interface ApiConfig {
    model: string;
}

export type FullTranslationConfig = TranslationSettings & ApiConfig;

export interface TranslationJob {
    file: UploadedFile;
    language: Language;
}

export interface TranslationResult {
    fileName: string;
    languageCode: string;
    translatedJson: any;
}
