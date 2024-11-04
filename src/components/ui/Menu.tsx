"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import useSWR from "swr";
import { MenuItem } from "@/@types/quizType";
import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";
import { path_api_menu } from "@/lib/path";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Menu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>(
    {},
  );
  const pathname = usePathname();

  const { data: menuItems, error } = useSWR<MenuItem[]>(
    path_api_menu().$url({
      query: {
        path: pathname,
      },
    }).path,
    fetcher,
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
              className={`flex w-full items-center justify-between px-4 py-2 text-left transition-all duration-300 ease-in-out hover:bg-gray-700 focus:outline-none ${
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
            className={`block px-4 py-2 transition-all duration-300 ease-in-out hover:bg-gray-700 ${
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
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
          aria-hidden="true"
          onClick={toggleMenu}
        ></div>
      )}

      {/* メニューコンテンツ */}
      <div
        id="menu"
        className={`fixed right-0 top-0 z-50 flex h-full w-64 transform flex-col bg-gray-800 text-white transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* メニュー内の閉じるボタン */}
        <button
          onClick={toggleMenu}
          className="p-4 text-white focus:outline-none"
        >
          <FaTimes className="text-2xl" aria-label="Close menu" />
        </button>

        {/* メニュー項目 */}
        <nav className="mt-2 flex-1 overflow-y-auto px-4">
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
