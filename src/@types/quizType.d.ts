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
  // 全体の解説が必要な場合は残す
  explanation?: MediaContent;
}
