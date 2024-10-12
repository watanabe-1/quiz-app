import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | 管理者用 | 過去問テスト",
    default: "管理者用",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
