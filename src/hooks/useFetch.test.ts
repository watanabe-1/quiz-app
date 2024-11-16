/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from "@testing-library/react";
import { useFetch } from "@/hooks/useFetch";

type User = {
  id: number;
  name: string;
  email: string;
};

describe("useFetch", () => {
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

    const { result } = renderHook(() => useFetch<User[]>("/api/users"));

    await waitFor(() => expect(result.current.data).toEqual(mockData));
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBeFalsy();
  });

  it("should handle error on failed fetch", async () => {
    // fetch の失敗ケースをモック
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    const { result } = renderHook(() => useFetch<User[]>("/api/users2"));

    // エラーがスローされるまで待機
    await waitFor(() => expect(result.current.error).toBeDefined());

    expect(result.current.error?.message).toBe(
      "Failed to fetch: Internal Server Error",
    );

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBeFalsy();
  });

  it("should send a POST request with a body", async () => {
    const mockResponse = { success: true };
    const requestBody = { name: "New User" };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() =>
      useFetch<{ success: boolean }, typeof requestBody>("/api/create-user", {
        method: "POST",
        body: requestBody,
      }),
    );

    await waitFor(() => expect(result.current.data).toEqual(mockResponse));
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBeFalsy();

    expect(global.fetch).toHaveBeenCalledWith("/api/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      credentials: "include",
    });
  });
});
