import React from "react";
import { FaTimes } from "react-icons/fa";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => {
        if (closeOnBackgroundClick) handleClose();
      }}
    >
      <div
        className="max-h-screen w-full max-w-2xl overflow-y-auto rounded-sm bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* モーダルの内容 */}
        {showCloseButton && (
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="py-2 text-2xl text-gray-500 hover:text-gray-800"
            >
              <FaTimes />
            </button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
