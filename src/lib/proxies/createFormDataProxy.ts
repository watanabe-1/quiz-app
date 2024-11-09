/**
 * Creates a proxy for FormData to enable dynamic property access.
 * The proxy allows accessing and setting form data parameters as properties of an object.
 *
 * @typeParam T - A generic type representing an object where keys are strings, and values are optional FormDataEntryValue.
 * @param {FormData} [formData=new FormData()] - The FormData instance used to access and set form parameters. If omitted, a new FormData instance will be created.
 * @returns {T & { getFormData: () => FormData }} A proxy object that allows dynamic access and setting of form parameters by property names, and includes a method to retrieve the original FormData instance.
 *
 * @example
 * const params = createFormDataProxy<{ param1: FormDataEntryValue | undefined }>();
 * params.param1 = "value1"; // Sets param1 in formData
 * console.log(params.getFormData()); // Outputs: new FormData instance with param1 set to "value1"
 *
 * @example
 * const formData = new FormData();
 * formData.append("param1", "value1");
 * const params = createFormDataProxy<{ param1: FormDataEntryValue | undefined }>(formData);
 * console.log(params.param1); // Outputs: "value1"
 */
export const createFormDataProxy = <
  T extends Record<string, FormDataEntryValue | undefined>,
>(
  formData: FormData = new FormData(), // デフォルト値として新しいFormDataを使用
): T & { getFormData: () => FormData } => {
  return new Proxy(
    {
      getFormData: () => formData,
    } as T & { getFormData: () => FormData },
    {
      get: (target, prop: string) => {
        if (prop === "getFormData") return target.getFormData;
        return formData.get(prop) ?? undefined;
      },
      set: (_, prop: string, value: FormDataEntryValue | undefined) => {
        if (value !== undefined) {
          formData.set(prop, value);
        } else {
          formData.delete(prop);
        }
        return true;
      },
    },
  );
};
