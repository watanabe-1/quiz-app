import { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: {
    template: "%s | 過去問テスト",
    default: "過去問テスト",
  },
};

const inter = Inter({ subsets: ["latin"] });

const RootLayout = async (props: { children: React.ReactNode }) => {
  const children = await props.children;

  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-100">{children}</div>
      </body>
    </html>
  );
};

export default RootLayout;
