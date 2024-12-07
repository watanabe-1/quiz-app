import { DefaultValue } from "@conform-to/react";
import { z } from "zod";
import { updateQuiz } from "@/features/quiz/edit/actions/quiz";
import { questionDataSchema } from "@/features/quiz/edit/lib/schema";
import { useZodConForm } from "@/hooks/useZodConForm";

type Props = {
  defaultValues: DefaultValue<z.infer<typeof questionDataSchema>>;
};

export const useQuizForm = (props: Props) => {
  return useZodConForm({
    schema: questionDataSchema,
    action: updateQuiz,
    defaultValues: props.defaultValues,
  });
};
