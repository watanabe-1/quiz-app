import { createLocalStorageProxy } from "@/lib/proxies/createLocalStorageProxy";

// モックの localStorage をセットアップ
beforeAll(() => {
  Object.defineProperty(global, "localStorage", {
    value: {
      store: {} as Record<string, string>,
      getItem(key: string) {
        return this.store[key] || null;
      },
      setItem(key: string, value: string) {
        this.store[key] = value;
      },
      removeItem(key: string) {
        delete this.store[key];
      },
      clear() {
        this.store = {};
      },
    },
    writable: true,
  });
});

describe("localStorageProxy", () => {
  const localStorageProxy = createLocalStorageProxy();

  beforeEach(() => {
    localStorage.clear(); // 各テスト実行前に localStorage をクリア
  });

  it("should retrieve an existing item from localStorage", () => {
    // プロキシを通して answerHistory を設定
    localStorageProxy.answerHistory = JSON.stringify({ key: "value" });

    // 設定した answerHistory を取得
    const answerHistory = localStorageProxy.answerHistory;
    expect(answerHistory).toBe(JSON.stringify({ key: "value" }));
  });

  it("should return undefined for a non-existent item", () => {
    // 存在しない item を取得しようとした場合
    const nonExistentItem = localStorageProxy.answerHistory;
    expect(nonExistentItem).toBeUndefined();
  });

  it("should set and remove an item in localStorage when value is undefined", () => {
    // プロキシを通して answerHistory を設定
    localStorageProxy.answerHistory = JSON.stringify({ key: "value" });
    expect(localStorageProxy.answerHistory).toBe(
      JSON.stringify({ key: "value" }),
    );

    // undefined を設定して削除
    localStorageProxy.answerHistory = undefined;
    expect(localStorageProxy.answerHistory).toBeUndefined();
  });
});
