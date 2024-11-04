/**
 * Creates a proxy for FormData to enable dynamic property access.
 * The proxy allows accessing and setting form data parameters as properties of an object.
 *
 * @typeParam T - A generic type representing an object where keys are strings, and values are optional FormDataEntryValue.
 * @param {FormData} [formData=new FormData()] - The FormData instance used to access and set form parameters. If omitted, a new FormData instance will be created.
 * @returns {T & { formData: FormData }} A proxy object that allows dynamic access and setting of form parameters by property names, and includes a direct `formData` property to retrieve the original FormData instance.
 *
 * @example
 * // Creating a new proxy with a parameter and accessing the FormData instance
 * const params = createFormDataProxy<{ param1: FormDataEntryValue | undefined }>();
 * params.param1 = "value1"; // Sets param1 in formData
 * console.log(params.formData); // Outputs: FormData instance with param1 set to "value1"
 *
 * @example
 * // Using an existing FormData instance and accessing parameters directly
 * const formData = new FormData();
 * formData.append("param1", "value1");
 * const params = createFormDataProxy<{ param1: FormDataEntryValue | undefined }>(formData);
 * console.log(params.param1); // Outputs: "value1"
 * console.log(params.formData); // Outputs the original FormData instance with param1
 */
export const createFormDataProxy = <
  T extends Record<string, FormDataEntryValue | undefined>,
>(
  formData: FormData = new FormData(),
): T & { formData: FormData } => {
  return new Proxy(
    {
      formData, // formData を直接アクセスできるように追加
    } as T & { formData: FormData },
    {
      get: (target, prop: string) => {
        if (prop === "formData") return target.formData;
        const value = formData.get(prop);
        return value === null ? undefined : value;
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
