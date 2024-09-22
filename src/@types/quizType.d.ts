export interface MediaContent {
  text?: string;
  image?: string;
}

export interface QuestionOption {
  text: string;
  image?: string;
  explanation?: MediaContent;
}

export interface QuestionData {
  id: number;
  category: string;
  question: MediaContent;
  options: QuestionOption[];
  answer: number;
  explanation?: MediaContent;
}

export interface QuestionAnswerPair {
  id: number;
  answer: number;
}
