"use client";

import { logout } from "@/features/auth/logout/actions/logout";

const logOutAction = async () => {
  await logout();
};

const LogOutButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <form action={logOutAction} className="w-full">
      <button
        type="submit"
        className="block w-full px-4 py-2 text-left transition duration-300 ease-in-out hover:bg-gray-700 focus:outline-none"
        onClick={(e) => {
          if (!confirm("ログアウトしますか？")) {
            e.preventDefault();
            return;
          }
          if (onClick) onClick();
        }}
      >
        ログアウト
      </button>
    </form>
  );
};

export default LogOutButton;
