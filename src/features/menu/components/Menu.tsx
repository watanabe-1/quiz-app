"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";
import LogOutButton from "@/features/auth/logout/components/LogOutButton";
import { useMenuItems } from "@/features/menu/hooks/useMenuItems";
import { MenuItem } from "@/types/quizType";

const Menu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>(
    {},
  );

  // セッション情報を取得
  const { data: session, status } = useSession();

  const { data: menuItems, error } = useMenuItems();

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
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // メニュー項目を再帰的にレンダリング
  const renderMenuItems = (items: MenuItem[], depth: number = 0) => {
    return items.map((item) => (
      <div key={`${item.href}${item.name}`} className="relative">
        {item.children ? (
          <>
            <button
              onClick={() => toggleSubmenu(`${item.href}${item.name}`)}
              className={`flex w-full items-center justify-between px-4 py-2 text-left transition-all duration-300 ease-in-out hover:bg-gray-700 focus:outline-none ${
                depth > 0 ? `pl-${depth * 4}` : ""
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
              className={`${
                openSubmenus[`${item.href}${item.name}`] ? "block" : "hidden"
              } ml-4 border-l border-gray-600 pl-4`}
            >
              {renderMenuItems(item.children, depth + 1)}
            </div>
          </>
        ) : (
          <Link
            href={item.href || "#"}
            className={`block px-4 py-2 transition-all duration-300 ease-in-out hover:bg-gray-700 ${
              depth > 0 ? `pl-${depth * 4}` : ""
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
        />
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

        {/* ログインしているときのみログアウトボタンを表示 */}
        {session && status === "authenticated" && (
          <div className="px-4">
            <LogOutButton />
          </div>
        )}

        {/* メニュー項目 */}
        <nav className="flex-1 overflow-y-auto px-4">
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
