import Link from "next/link";
import React from "react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-gray-900 text-white p-4 shadow-md sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between flex-wrap">
        {/* 画面幅に応じて文字サイズを変更 */}
        <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-tight truncate">
          {title}
        </h1>
        <nav className="ml-auto flex items-center space-x-4">
          <Link
            href="/"
            className="text-white hover:text-gray-300 transition duration-300 ease-in-out"
          >
            ホーム
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
