import React from "react";
import Menu from "@/components/ui/Menu";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = async ({ title }) => {
  return (
    <header className="bg-gray-900 text-white p-4 shadow-md sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-tight truncate">
          {title}
        </h1>
        <div className="ml-3">
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;
