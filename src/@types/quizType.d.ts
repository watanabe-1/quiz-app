export interface MediaContent {
  id?: number;
  text?: string;
  image?: string;
}

export interface QuestionOption {
  id?: number;
  text: string;
  image?: string;
  explanation?: MediaContent;
}

export interface Category {
  id?: number;
  name: string;
}

export interface Grade {
  id?: number;
  name: string;
}

export interface QuestionData {
  id?: number;
  questionId: number;
  category: string; // カテゴリー名を文字列として扱う
  question: MediaContent;
  options: QuestionOption[];
  answer: number;
  explanation?: MediaContent;
}

export interface QuestionAnswerPair {
  questionId: number;
  answer: number;
}

export interface AnswerHistory {
  [key: string]: number | undefined;
}

export interface MenuItem {
  name: string;
  href?: string;
  children?: MenuItem[];
}

export interface NonLinkableSegment {
  label: string;
  index: number;
}
