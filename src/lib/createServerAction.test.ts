import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { ZodSchema } from "zod";
import { LOGIN_ROUTE } from "@/features/auth/lib/authConstants";
import { withPermissionAll } from "@/features/permission/lib/withPermissionAll";
import { createServerAction } from "@/lib/createServerAction";
import { FormState } from "@/types/conform";

jest.mock("@conform-to/zod", () => ({
  parseWithZod: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/features/permission/lib/withPermissionAll");

describe("createServerAction", () => {
  const mockSchema = { parse: jest.fn() } as unknown as ZodSchema<unknown>;
  const mockCallback = jest.fn();
  const mockPath = "dummy";

  const mockPrevState: FormState = {
    status: "idle",
    submission: null,
  };

  const mockFormData = new FormData();
  mockFormData.append("key", "value");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return error state when validation fails", async () => {
    const mockSubmission = {
      status: "error",
      reply: jest.fn(() => "mock_error_reply"),
    };
    (parseWithZod as jest.Mock).mockReturnValue(mockSubmission);
    (withPermissionAll as jest.Mock).mockImplementation(async (callback) =>
      callback(),
    );

    const serverAction = createServerAction(mockSchema, mockPath, mockCallback);

    const result = await serverAction(mockPrevState, mockFormData);

    expect(parseWithZod).toHaveBeenCalledWith(mockFormData, {
      schema: mockSchema,
    });
    expect(mockSubmission.reply).toHaveBeenCalled();
    expect(result).toEqual({
      status: "error",
      submission: "mock_error_reply",
    });
    expect(mockCallback).not.toHaveBeenCalled();
    expect(withPermissionAll).toHaveBeenCalled();
  });

  it("should execute callback and return its result on successful validation", async () => {
    const mockSubmission = {
      status: "success",
      data: { key: "value" },
    };
    const mockCallbackResult = {
      status: "success",
      submission: null,
    };
    (parseWithZod as jest.Mock).mockReturnValue(mockSubmission);
    mockCallback.mockResolvedValueOnce(mockCallbackResult);
    (withPermissionAll as jest.Mock).mockImplementation(async (callback) =>
      callback(),
    );

    const serverAction = createServerAction(mockSchema, mockPath, mockCallback);

    const result = await serverAction(mockPrevState, mockFormData);

    expect(parseWithZod).toHaveBeenCalledWith(mockFormData, {
      schema: mockSchema,
    });
    expect(mockCallback).toHaveBeenCalledWith(mockSubmission);
    expect(result).toEqual(mockCallbackResult);
    expect(withPermissionAll).toHaveBeenCalled();
  });

  it("should redirect to login when permission checks fail", async () => {
    (withPermissionAll as jest.Mock).mockImplementation(
      async (_, __, onFailure) => onFailure(),
    );

    const serverAction = createServerAction(mockSchema, mockPath, mockCallback);

    await serverAction(mockPrevState, mockFormData);

    expect(redirect).toHaveBeenCalledWith(LOGIN_ROUTE);
    expect(mockCallback).not.toHaveBeenCalled();
    expect(parseWithZod).not.toHaveBeenCalled();
  });
});
