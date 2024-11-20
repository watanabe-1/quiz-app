import { auth } from "@/features/auth/auth";
import { getRole } from "@/features/auth/lib/getRole";

jest.mock("@/features/auth/auth");

const mockedAuth = auth as jest.Mock;

describe("getRole", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 'guest' if the user is not authenticated", async () => {
    // 型定義を考慮し、`null` を返す型を明示的に指定
    mockedAuth.mockResolvedValueOnce(null);

    const role = await getRole();

    expect(role).toBe("guest");
    expect(mockedAuth).toHaveBeenCalledTimes(1);
  });

  it("should return 'guest' if the user role is not defined", async () => {
    mockedAuth.mockResolvedValueOnce({ user: {} });

    const role = await getRole();

    expect(role).toBe("guest");
    expect(mockedAuth).toHaveBeenCalledTimes(1);
  });

  it("should return the user's role if it is defined", async () => {
    mockedAuth.mockResolvedValueOnce({
      user: { role: "admin" },
    });

    const role = await getRole();

    expect(role).toBe("admin");
    expect(mockedAuth).toHaveBeenCalledTimes(1);
  });
});
