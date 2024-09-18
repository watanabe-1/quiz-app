interface Option {
  text: string;
  explanation: string;
}

export interface QuestionData {
  id: number;
  category: string;
  question: string;
  options: Option[];
  answer: number;
  // 全体の解説が必要な場合は残す
  explanation?: string;
}
