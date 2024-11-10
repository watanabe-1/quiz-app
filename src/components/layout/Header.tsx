import { SessionProvider } from "next-auth/react";
import React from "react";
import Menu from "@/components/layout/Menu";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="sticky top-0 z-40 bg-gray-900 p-4 text-white shadow-md">
      <div className="flex w-full items-center justify-between">
        <h1 className="truncate text-sm font-bold tracking-tight sm:text-base md:text-lg">
          {title}
        </h1>
        <div>
          <SessionProvider>
            <Menu />
          </SessionProvider>
        </div>
      </div>
    </header>
  );
};

export default Header;
