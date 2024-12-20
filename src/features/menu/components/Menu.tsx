"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { tv } from "tailwind-variants";
import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";
import LogOutButton from "@/features/auth/logout/components/LogOutButton";
import { useMenuItems } from "@/features/menu/hooks/useMenuItems";
import { MenuItem } from "@/types/quizType";

// サブメニューのスタイルを定義
const submenuStyles = tv({
  base: "ml-4 border-l border-gray-600 pl-4",
  variants: {
    open: {
      true: "block",
      false: "hidden",
    },
  },
});

// メニューのコンテナスタイル
const menuContainerStyles = tv({
  base: "fixed right-0 top-0 z-50 flex h-full w-64 transform flex-col bg-gray-800 text-white transition-transform duration-300 ease-in-out",
  variants: {
    open: {
      true: "translate-x-0",
      false: "translate-x-full",
    },
  },
});

const Menu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>(
    {},
  );

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
    return items.map((item) => {
      const { name, children, href } = item;
      const submenusKey = `${href}${name}`;

      return (
        <div key={submenusKey} className="relative">
          {children ? (
            <>
              <button
                onClick={() => toggleSubmenu(submenusKey)}
                className="flex w-full items-center justify-between px-4 py-2 pl-4 text-left transition-all duration-300 ease-in-out hover:bg-gray-700 focus:outline-none"
              >
                <span>{name}</span>
                {openSubmenus[submenusKey] ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </button>
              {/* サブメニュー */}
              <div
                className={submenuStyles({ open: openSubmenus[submenusKey] })}
              >
                {renderMenuItems(children, depth + 1)}
              </div>
            </>
          ) : (
            <Link
              href={href || "#"}
              className="flex w-full items-center justify-between px-4 py-2 pl-4 text-left transition-all duration-300 ease-in-out hover:bg-gray-700 focus:outline-none"
              onClick={toggleMenu}
            >
              {name}
            </Link>
          )}
        </div>
      );
    });
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
      <div id="menu" className={menuContainerStyles({ open: isOpen })}>
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
