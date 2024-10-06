"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MenuItem } from "@/@types/quizType";
import useSWR from "swr";
import { usePathname } from "next/navigation";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Menu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>(
    {}
  );
  const pathname = usePathname();

  const { data: menuItems, error } = useSWR<MenuItem[]>(
    `/api/menu?path=${encodeURIComponent(pathname)}`,
    fetcher
  );

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // メニューが開いているときに背景のスクロールを防止
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // クリーンアップ関数
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // メニュー項目を再帰的にレンダリング
  const renderMenuItems = (items: MenuItem[], depth: number = 0) => {
    return items.map((item) => (
      <div key={`${item.href}${item.name}`}>
        {item.children ? (
          <>
            <button
              onClick={() => toggleSubmenu(`${item.href}${item.name}`)}
              className={`flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-700 focus:outline-none transition-all duration-300 ease-in-out ${
                depth > 0 ? "pl-4" : ""
              }`}
            >
              <span>{item.name}</span>
              {openSubmenus[`${item.href}${item.name}`] ? (
                <FaChevronUp />
              ) : (
                <FaChevronDown />
              )}
            </button>
            {/* サブメニュー */}
            <div
              className={`ml-4 transition-all duration-300 ease-in-out ${
                openSubmenus[`${item.href}${item.name}`]
                  ? "max-h-screen"
                  : "max-h-0 overflow-hidden"
              }`}
            >
              {renderMenuItems(item.children, depth + 1)}
            </div>
          </>
        ) : (
          <Link
            href={item.href || "#"}
            className={`block px-4 py-2 hover:bg-gray-700 transition-all duration-300 ease-in-out ${
              depth > 0 ? "pl-6" : ""
            }`}
            onClick={toggleMenu}
          >
            {item.name}
          </Link>
        )}
      </div>
    ));
  };

  return (
    <div className="relative">
      {/* ハンバーガーメニューボタン */}
      <button
        onClick={toggleMenu}
        className="text-white focus:outline-none"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <FaTimes className="text-2xl" />
        ) : (
          <FaBars className="text-2xl" />
        )}
      </button>

      {/* オーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
          aria-hidden="true"
          onClick={toggleMenu}
        ></div>
      )}

      {/* メニューコンテンツ */}
      <div
        id="menu"
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* メニュー内の閉じるボタン */}
        <button
          onClick={toggleMenu}
          className="text-white p-4 focus:outline-none"
        >
          <FaTimes className="text-2xl" aria-label="Close menu" />
        </button>

        {/* メニュー項目 */}
        <nav className="mt-2 px-4 flex-1 overflow-y-auto">
          {error ? (
            <ErrorState />
          ) : !menuItems ? (
            <LoadingState />
          ) : (
            renderMenuItems(menuItems)
          )}
        </nav>
      </div>
    </div>
  );
};

export default Menu;
