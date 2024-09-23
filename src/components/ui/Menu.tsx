"use client";

import { useState } from "react";
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
  // サブメニューの開閉状態を管理するステート
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

  // 再帰的にメニューをレンダリングする関数
  const renderMenuItems = (items: MenuItem[], depth: number = 0) => {
    return items.map((item) => (
      <div key={item.name}>
        {item.children ? (
          <>
            <button
              onClick={() => toggleSubmenu(item.name)}
              className={`flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-700 focus:outline-none transition-all duration-300 ease-in-out ${
                depth > 0 ? "pl-4" : ""
              }`}
            >
              <span>{item.name}</span>
              {openSubmenus[item.name] ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {/* サブメニュー */}
            <div
              className={`ml-4 overflow-hidden transition-all duration-300 ease-in-out ${
                openSubmenus[item.name] ? "max-h-screen" : "max-h-0"
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
            onClick={toggleMenu} // メニュー項目をクリックしたらメニューを閉じる
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
        {/* メニューの開閉状態に応じてアイコンを表示 */}
        {isOpen ? (
          <FaTimes className="text-2xl" /> // メニューが開いているときの閉じるアイコン
        ) : (
          <FaBars className="text-2xl" /> // メニューが閉じているときのハンバーガーアイコン
        )}
      </button>

      {/* オーバーレイ（メニュー外クリック用） */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
          aria-hidden="true"
          onClick={toggleMenu} // オーバーレイがクリックされたらメニューを閉じる
        ></div>
      )}

      {/* メニューコンテンツ */}
      <div
        id="menu"
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${
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

        {/* メニュー項目またはローディング/エラー状態 */}
        <nav className="mt-8 space-y-2 px-4">
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
