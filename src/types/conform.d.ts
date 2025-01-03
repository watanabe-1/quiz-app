import {
  type FieldMetadata,
  type FormMetadata,
  type DefaultValue,
} from "@conform-to/react";
import { z, type ZodType } from "zod";

/**
 * A generic type representing props used for conform components.
 * This type is designed to be flexible and accommodate different metadata structures for fields and forms.
 *
 * @template T - The type of the data associated with the field.
 */
export type ConformProps<T> = {
  /**
   * Metadata for a specific field. This can include various details about the field, such as its current value,
   * validation status, error messages, etc. The type `T` is used to represent the field's value type.
   *
   * @remarks
   * The use of `any` here is intentional to allow flexibility, as this type is meant for use in a wide range of form fields.
   * The `string[]` represents potential error messages.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldMetadata: FieldMetadata<T | undefined, any, string[]>;

  /**
   * Metadata related to the entire form. This includes general information about the form, such as its state,
   * submission status, and validation messages.
   *
   * @remarks
   * The use of `any` here allows for flexibility, as form metadata can vary significantly depending on the form's structure.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formMetadata: FormMetadata<any>;
};

/**
 * Represents optional metadata for fields.
 * Use this type to indicate that a value is related to optional field metadata.
 */
export type OptionalFieldMetadata = "fieldMetadata";

/**
 * Represents optional metadata for forms.
 * Use this type to indicate that a value is related to optional form metadata.
 */
export type OptionalFormMetadata = "formMetadata";

/**
 * Represents the state of a form during its lifecycle.
 */
export type FormState =
  | {
      /**
       * Indicates the form submission was successful.
       */
      status: "success";
      /**
       * Message providing additional information about the successful submission.
       */
      message: string;
      /**
       * Optional data returned as a result of the submission.
       */
      submission?: SubmissionResult;
    }
  | {
      /**
       * Indicates the form encountered an error during submission.
       */
      status: "error";
      /**
       * Optional data returned as a result of the submission.
       */
      submission?: SubmissionResult;
    }
  | {
      /**
       * Indicates the form is idle and has not been submitted.
       */
      status: "idle";
      /**
       * Optional data returned as a result of the submission.
       */
      submission?: SubmissionResult;
    };

/**
 * Represents a set of constraints for a schema where the keys are strings
 * and the values can be of any type.
 *
 * @remarks
 * This type is designed to provide flexibility when defining schema constraints.
 * However, using `any` for the values may reduce type safety and should be used cautiously.
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SchemaConstraint = Record<string, any>;

/**
 * Represents the default value for a schema constraint.
 *
 * @template Schema - A Zod schema that extends `ZodType` with a specific schema constraint.
 * The schema constraint is inferred and used to determine the default value type.
 *
 * This type is resolved by inferring the type from the provided Zod schema
 * and passing it to the `DefaultValue` type utility.
 */
export type SchemaDefaultValue<Schema extends ZodType<SchemaConstraint>> =
  DefaultValue<z.infer<Schema>>;

/**
 * MimeType
 */
export type FileMimeType =
  | "image/jpeg"
  | "image/png"
  | "image/gif"
  | "image/svg+xml"
  | "video/mp4"
  | "video/webm"
  | "video/ogg"
  | "audio/mpeg"
  | "audio/ogg"
  | "audio/wav"
  | "text/plain"
  | "text/html"
  | "text/css"
  | "text/csv"
  | "application/json"
  | "application/pdf"
  | "application/zip"
  | "application/vnd.ms-excel"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | ""; // For unknown file formats, an empty string ("") is used

/**
 * A type-safe extension of the FormData interface that restricts keys and values
 * based on the generic type parameter `T`.
 * @template T - An object type that defines the keys and value types for the FormData instance.
 */
export interface RestrictedFormData<T> extends FormData {
  /**
   * Appends a new value onto an existing key, or adds the key if it does not already exist.
   * @param key - The key of the form data. Must be a key of `T`.
   * @param value - The value to append. If the type of the value is Blob, it will be added as-is.
   *                Otherwise, it will be converted to a string.
   */
  append<Key extends keyof T>(
    key: Key,
    value: T[Key] extends Blob ? T[Key] : string,
  ): void;

  /**
   * Retrieves the first value associated with the specified key.
   * @param key - The key of the form data. Must be a key of `T`.
   * @returns The first value associated with the key, or `null` if the key does not exist.
   */
  get<Key extends keyof T>(key: Key): FormDataEntryValue | null;

  /**
   * Retrieves all values associated with the specified key.
   * @param key - The key of the form data. Must be a key of `T`.
   * @returns An array of all values associated with the key.
   */
  getAll<Key extends keyof T>(key: Key): FormDataEntryValue[];

  /**
   * Deletes all values associated with the specified key.
   * @param key - The key of the form data. Must be a key of `T`.
   */
  delete<Key extends keyof T>(key: Key): void;

  /**
   * Checks if a key exists in the FormData instance.
   * @param key - The key of the form data. Must be a key of `T`.
   * @returns `true` if the key exists, `false` otherwise.
   */
  has<Key extends keyof T>(key: Key): boolean;

  /**
   * Sets a new value for a key, overwriting any existing value.
   * @param key - The key of the form data. Must be a key of `T`.
   * @param value - The value to set. If the type of the value is Blob, it will be added as-is.
   *                Otherwise, it will be converted to a string.
   */
  set<Key extends keyof T>(
    key: Key,
    value: T[Key] extends Blob ? T[Key] : string,
  ): void;
}

/**
 * Type definition for a server action function that processes form data.
 *
 * This function takes the current form state and new form data as input,
 * processes them, and returns a Promise resolving to the updated form state.
 *
 * @template FormState - The type representing the state of the form.
 * @param prevState - The current state of the form.
 * @param data - The new data to be processed.
 * @returns A Promise resolving to the updated form state.
 */
export type ServerActionHandler<T> = (
  prevState: FormState,
  data: RestrictedFormData<T>,
) => Promise<FormState>;
