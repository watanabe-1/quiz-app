/**
 * @jest-environment jsdom
 */

import { renderHook } from "@testing-library/react";
import { useZodErrorMap } from "@/hooks/useZodErrorMap";
import { initializeZodErrorMap } from "@/lib/zodErrorMap";

// initializeZodErrorMap のモックを作成
jest.mock("@/lib/zodErrorMap", () => ({
  initializeZodErrorMap: jest.fn(),
}));

describe("useZodErrorMap", () => {
  beforeEach(() => {
    // モック関数の呼び出し履歴をリセット
    jest.clearAllMocks();
  });

  it("calls initializeZodErrorMap once on mount", () => {
    // モック関数を取得
    const mockInitializeZodErrorMap = initializeZodErrorMap as jest.Mock;

    // フックをレンダリング
    renderHook(() => useZodErrorMap());

    // initializeZodErrorMap が一度だけ呼び出されたことを確認
    expect(mockInitializeZodErrorMap).toHaveBeenCalledTimes(1);
  });

  it("does not call initializeZodErrorMap multiple times on re-render", () => {
    const mockInitializeZodErrorMap = initializeZodErrorMap as jest.Mock;

    // フックをレンダリング
    const { rerender } = renderHook(() => useZodErrorMap());

    // 再レンダリング
    rerender();

    // 再レンダリングでも呼び出し回数が増えないことを確認
    expect(mockInitializeZodErrorMap).toHaveBeenCalledTimes(1);
  });
});
