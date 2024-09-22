"use client";

import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  closeOnBackgroundClick?: boolean; // 背景クリックで閉じるかどうかのprops
  showCloseButton?: boolean; // ×ボタンを表示するかどうかのprops
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  closeOnBackgroundClick = true, // デフォルトで背景クリック時に閉じるように設定
  showCloseButton = true, // デフォルトで×ボタンを表示するように設定
  children,
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose(); // モーダルを閉じる処理を親コンポーネントに通知
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={() => {
        if (closeOnBackgroundClick) handleClose(); // closeOnBackgroundClickがtrueの場合のみ閉じる
      }}
    >
      <div
        className="bg-white rounded shadow-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto" // 縦スクロールと高さ制限を追加
        onClick={(e) => e.stopPropagation()} // コンテンツをクリックしてもモーダルを閉じない
      >
        {/* ×ボタンを表示するかどうか */}
        {showCloseButton && (
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-800 text-2xl px-4 py-2" // ここでサイズを調整
            >
              &times;
            </button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
