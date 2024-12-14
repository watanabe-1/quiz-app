import { Submission } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { ZodSchema } from "zod";
import { LOGIN_ROUTE } from "@/features/auth/lib/authConstants";
import { permission } from "@/features/permission/lib/permission";
import { withPermissionAll } from "@/features/permission/lib/withPermissionAll";
import { FormState } from "@/types/conform";

/**
 * Extracts the successful submission type from a generic submission.
 *
 * @template Schema - The schema type representing the form data structure.
 * @template FormError - The type representing form errors (default: string array).
 * @template FormValue - The type representing form values (default: Schema).
 */
type SuccessSubmission<
  Schema,
  FormError = string[],
  FormValue = Schema,
> = Extract<Submission<Schema, FormError, FormValue>, { status: "success" }>;

/**
 * Callback type for server action logic.
 * @template T - The schema type.
 * @param submission - The submission object containing form data and validation state.
 * @returns A promise resolving to the updated form state.
 */
type ServerActionCallback<T> = (
  submission: SuccessSubmission<T, string[], T>,
) => Promise<FormState>;

/**
 * Creates a server action for handling form submissions with Zod validation,
 * permission checks, and business logic.
 *
 * @template T - The schema type.
 * @param schema - The Zod schema used for form validation.
 * @param path - The source path from which the server action is invoked. This path is used for permission checks.
 * @param callback - The callback containing the business logic to execute on successful validation.
 * @returns A function that handles the server-side form submission.
 */
export function createServerAction<T>(
  schema: ZodSchema<T>,
  path: string,
  callback: ServerActionCallback<T>,
) {
  return async (prevState: FormState, data: FormData): Promise<FormState> => {
    return withPermissionAll(
      async () => {
        // Parse and validate the form data using the Zod schema
        const submission = await parseWithZod(data, {
          schema: schema,
        });

        // If validation fails, return an error state
        if (submission.status !== "success") {
          return {
            status: "error",
            submission: submission.reply(),
          };
        }

        // Execute the provided business logic callback
        return callback(submission);
      },
      [permission.page.access(path)],
      () => redirect(LOGIN_ROUTE), // Redirect to login if permission checks fail
    );
  };
}
