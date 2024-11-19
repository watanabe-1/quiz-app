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
   * @type {FieldMetadata<T | undefined, any, string[]>}
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
   * @type {FormMetadata<any>}
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
