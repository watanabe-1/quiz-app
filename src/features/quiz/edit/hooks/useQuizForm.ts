import { updateQuiz } from "@/features/quiz/edit/actions/quiz";
import { questionDataSchema } from "@/features/quiz/edit/lib/schema";
import { useZodConForm } from "@/hooks/useZodConForm";
import { SchemaDefaultValue } from "@/types/conform";

type Props = {
  defaultValues: SchemaDefaultValue<typeof questionDataSchema>;
};

export const useQuizForm = (props: Props) => {
  return useZodConForm({
    schema: questionDataSchema,
    action: updateQuiz,
    defaultValues: props.defaultValues,
  });
};
