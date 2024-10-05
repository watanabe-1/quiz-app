import { FaExclamationCircle } from "react-icons/fa";

interface ErrorStateProps {
  msg?: string;
}

// エラー状態のコンポーネント
const ErrorState: React.FC<ErrorStateProps> = ({ msg }) => (
  <div className="flex items-center justify-center p-4 text-red-500">
    <FaExclamationCircle className="mr-2" />
    <span>{msg ? msg : "エラーが発生しました"}</span>
  </div>
);

export default ErrorState;
