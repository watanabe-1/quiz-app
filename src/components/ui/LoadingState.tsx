import { FaSpinner } from "react-icons/fa";

// ローディング状態のコンポーネント
const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center p-4 text-orange-400">
    <FaSpinner className="mr-2 animate-spin" />
    <span>読み込み中...</span>
  </div>
);

export default LoadingState;
