export interface QuestionProps {
  questionId: number;
}

export interface QuestionData {
  id: number;
  category: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}
