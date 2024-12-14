import { Submission } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { ZodSchema } from "zod";
import { LOGIN_ROUTE } from "@/features/auth/lib/authConstants";
import { withPermissionAll } from "@/features/permission/lib/withPermissionAll";
import { PermissionCheck } from "@/features/permission/types/permission";
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
 * @param callback - The callback containing the business logic to execute on successful validation.
 * @param permissions - The list of permissions to check before executing the action.
 * @returns A function that handles the server-side form submission.
 */
export function createServerAction<T>(
  schema: ZodSchema<T>,
  permissions: PermissionCheck[],
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
      permissions, // Permissions to check
      () => redirect(LOGIN_ROUTE), // Redirect to login if permission checks fail
    );
  };
}
