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
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={() => {
        if (closeOnBackgroundClick) handleClose();
      }}
    >
      <div
        className="bg-white rounded shadow-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* モーダルの内容 */}
        {showCloseButton && (
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-800 text-2xl px-4 py-2"
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
