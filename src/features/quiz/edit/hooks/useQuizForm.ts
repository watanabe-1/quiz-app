import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { updateQuiz } from "@/features/quiz/edit/actions/quiz";
import {
  questionDataSchema,
  type QuestionDataSchema,
} from "@/features/quiz/edit/lib/schema";
import { useZodErrorMap } from "@/hooks/useZodErrorMap";
import { QuestionData } from "@/types/quizType";

type Props = { defaultValues: QuestionData };

export const useQuizForm = (props: Props) => {
  // zodの初期化
  useZodErrorMap();

  const [state, submitAction, loading] = useActionState(updateQuiz, {
    status: "idle",
  });

  const [form, fields] = useForm<QuestionDataSchema>({
    lastResult: state.submission,
    onValidate({ formData }) {
      const parseWithZoded = parseWithZod(formData, {
        schema: questionDataSchema,
      });
      return parseWithZoded;
    },
    shouldValidate: "onInput",
    defaultValue: props.defaultValues,
  });

  return { submitAction, loading, form, fields };
};
