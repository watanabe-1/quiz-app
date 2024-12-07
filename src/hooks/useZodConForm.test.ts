/**
 * @jest-environment jsdom
 */

import { renderHook } from "@testing-library/react";
import { useActionState } from "react";
import { z } from "zod";
import { useZodConForm } from "@/hooks/useZodConForm";

// モック関数を準備
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn(),
}));
jest.mock("@/hooks/useZodErrorMap", () => ({
  useZodErrorMap: jest.fn(),
}));

describe("useZodConForm", () => {
  const mockAction = jest.fn();
  const mockUseActionState = useActionState as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseActionState.mockReturnValue([
      { submission: null, status: "idle" },
      jest.fn(),
      false,
    ]);
  });

  it("initializes with default values", () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });

    const { result } = renderHook(() =>
      useZodConForm({
        schema,
        action: mockAction,
        defaultValues: { name: "John Doe", age: 30 },
      }),
    );

    const { fields } = result.current;

    expect(fields.name.value).toBe("John Doe");
    expect(fields.age.value).toBe("30");
    expect(mockUseActionState).toHaveBeenCalled();
  });

  it("returns loading state correctly", () => {
    const schema = z.object({
      password: z.string(),
    });

    mockUseActionState.mockReturnValue([
      { submission: null, status: "submitting" },
      jest.fn(),
      true,
    ]);

    const { result } = renderHook(() =>
      useZodConForm({
        schema,
        action: mockAction,
      }),
    );

    expect(result.current.loading).toBe(true);
  });
});
