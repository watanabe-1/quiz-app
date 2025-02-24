/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from "@testing-library/react";
import { useData } from "@/hooks/useData";
import { client } from "@/lib/client";

type User = {
  id: number;
  name: string;
  email: string;
};

describe("useData", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("should return data on successful fetch", async () => {
    const mockData: User[] = [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Doe", email: "jane@example.com" },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() =>
      useData(() => client.api.questions.$get(), "/api/users"),
    );

    await waitFor(() => expect(result.current.data).toEqual(mockData));
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBeFalsy();
  });

  it("should handle error on failed fetch", async () => {
    const mockData = { error: "Failed to fetch: Internal Server Error" };

    // fetch の失敗ケースをモック
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockData,
    });

    const { result } = renderHook(() =>
      useData(() => client.api.questions.$get(), "/api/users2"),
    );

    // エラーがスローされるまで待機
    await waitFor(() => expect(result.current.error).toBeDefined());

    expect(result.current.error?.message).toBe(
      "Failed to fetch: Internal Server Error",
    );

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBeFalsy();
  });
});
