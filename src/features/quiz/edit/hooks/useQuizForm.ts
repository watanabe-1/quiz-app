import { updateQuiz } from "@/features/quiz/edit/actions/quiz";
import {
  questionDataSchema,
  type QuestionDataSchema,
} from "@/features/quiz/edit/lib/schema";
import { useZodConForm } from "@/hooks/useZodConForm";
import { QuestionData } from "@/types/quizType";

type Props = { defaultValues: QuestionData };

export const useQuizForm = (props: Props) => {
  return useZodConForm<QuestionDataSchema>({
    schema: questionDataSchema,
    action: updateQuiz,
    defaultValues: props.defaultValues,
  });
};
