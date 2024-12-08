import { DefaultValue, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import type { ZodType, ZodTypeDef } from "zod";
import { useZodErrorMap } from "@/hooks/useZodErrorMap";
import { FormState, SchemaConstraint } from "@/types/conform";

/**
 * Options for configuring the `useZodConForm` hook.
 *
 * @template Schema - The type of the form schema.
 */
interface UseZodConFormOptions<Schema extends SchemaConstraint> {
  /**
   * The Zod schema used to validate form data.
   */
  schema: ZodType<Schema, ZodTypeDef, unknown>;

  /**
   * The action function to handle form submissions.
   *
   * @param prevState - The previous form state.
   * @param data - The submitted form data.
   * @returns A promise resolving to the new form state.
   */
  action: (prevState: FormState, data: FormData) => Promise<FormState>;

  /**
   * Default values for the form fields.
   */
  defaultValues?: DefaultValue<Schema>;
}

/**
 * A custom hook for managing forms with Zod validation and Conform.js integration.
 *
 * @template Schema - The type of the form schema.
 * @param options - Configuration options for the form.
 * @returns An object containing form utilities.
 * @example
 * ```tsx
 * const { submitAction, loading, form, fields } = useZodConForm({
 *   schema: myZodSchema,
 *   action: handleFormSubmission,
 *   defaultValues: { name: "John Doe" },
 * });
 * ```
 */
export const useZodConForm = <Schema extends SchemaConstraint>({
  schema,
  action,
  defaultValues,
}: UseZodConFormOptions<Schema>) => {
  // Initialize the Zod error map
  useZodErrorMap();

  const [state, submitAction, loading] = useActionState(action, {
    status: "idle",
  });

  const [form, fields] = useForm<Schema>({
    lastResult: state.submission,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema,
      });
    },
    shouldValidate: "onInput",
    defaultValue: defaultValues,
  });

  return { submitAction, loading, form, fields };
};
