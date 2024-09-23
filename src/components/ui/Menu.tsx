"use client";

import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa"; // React Iconsのインポート

const Menu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          aria-hidden="true"
          onClick={toggleMenu} // オーバーレイがクリックされたらメニューを閉じる
        ></div>
      )}

      {/* メニューコンテンツ */}
      <div
        id="menu"
        className={`fixed top-0 right-0 h-full w-48 md:w-64 bg-gray-800 text-white transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        {/* メニュー内の閉じるボタン */}
        <button onClick={toggleMenu} className="text-white p-4">
          <FaTimes className="text-2xl" /> {/* 閉じるアイコン */}
        </button>

        {/* メニュー項目 */}
        <nav className="mt-8 space-y-4">
          <Link
            href="/"
            className="block px-4 py-2 text-white hover:bg-gray-700"
          >
            ホーム
          </Link>
          <Link
            href="/about"
            className="block px-4 py-2 text-white hover:bg-gray-700"
          >
            アバウト
          </Link>
          <Link
            href="/contact"
            className="block px-4 py-2 text-white hover:bg-gray-700"
          >
            お問い合わせ
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Menu;
