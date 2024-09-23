import { FaExclamationCircle } from "react-icons/fa";

// エラー状態のコンポーネント
const ErrorState: React.FC = () => (
  <div className="flex items-center justify-center p-4 text-red-500">
    <FaExclamationCircle className="mr-2" />
    <span>エラーが発生しました。</span>
  </div>
);

export default ErrorState;
