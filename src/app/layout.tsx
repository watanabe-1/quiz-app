import { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { initializeZodErrorMap } from "@/lib/zodErrorMap";

export const metadata: Metadata = {
  title: {
    template: "%s | 過去問テスト",
    default: "過去問テスト",
  },
};

// サーバ側で使用するzodの初期化
initializeZodErrorMap();

const inter = Inter({ subsets: ["latin"] });

const RootLayout = (props: { children: React.ReactNode }) => {
  const children = props.children;
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-100">{children}</div>
      </body>
    </html>
  );
};

export default RootLayout;
