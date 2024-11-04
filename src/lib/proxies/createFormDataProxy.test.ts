import { createFormDataProxy } from "@/lib/proxies/createFormDataProxy";

describe("createFormDataProxy", () => {
  let formData: FormData;
  let proxy: Record<string, FormDataEntryValue | undefined> & {
    getFormData: () => FormData;
  };

  beforeEach(() => {
    formData = new FormData();
    proxy = createFormDataProxy(formData);
  });

  it("should create a new FormData instance when no argument is provided", () => {
    const proxyWithoutArg = createFormDataProxy<{
      param1: FormDataEntryValue | undefined;
    }>();
    proxyWithoutArg.param1 = "testValue";
    expect(proxyWithoutArg.formData.get("param1")).toBe("testValue");
  });

  it("should get string values from FormData", () => {
    formData.append("param1", "value1");
    expect(proxy.param1).toBe("value1");
  });

  it("should return undefined for non-existent properties", () => {
    expect(proxy.nonExistent).toBeUndefined();
  });

  it("should set string values in FormData", () => {
    proxy.param2 = "value2";
    expect(formData.get("param2")).toBe("value2");
    expect(proxy.param2).toBe("value2");
  });

  it("should delete values from FormData when set to undefined", () => {
    formData.append("param3", "value3");
    proxy.param3 = undefined;
    expect(formData.has("param3")).toBe(false);
    expect(proxy.param3).toBeUndefined();
  });

  it("should update existing string values in FormData", () => {
    proxy.param4 = "initialValue";
    expect(formData.get("param4")).toBe("initialValue");

    proxy.param4 = "updatedValue";
    expect(formData.get("param4")).toBe("updatedValue");
    expect(proxy.param4).toBe("updatedValue");
  });

  it("should set and get File values in FormData", () => {
    const file = new File(["file content"], "test.txt", { type: "text/plain" });
    proxy.fileParam = file;
    expect(formData.get("fileParam")).toBe(file);
    expect(proxy.fileParam).toBe(file);
  });

  it("should handle setting File values to undefined", () => {
    const file = new File(["file content"], "test.txt", { type: "text/plain" });
    formData.set("fileParam", file);

    // Set to undefined to delete the file entry
    proxy.fileParam = undefined;
    expect(formData.has("fileParam")).toBe(false);
    expect(proxy.fileParam).toBeUndefined();
  });

  it("should return the original FormData instance via getFormData", () => {
    // Confirm that the formData instance retrieved via getFormData is the same as the original
    expect(proxy.formData).toBe(formData);
  });
});
