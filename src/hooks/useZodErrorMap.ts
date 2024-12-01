import { useEffect } from "react";
import { initializeZodErrorMap } from "@/lib/zodErrorMap";

export const useZodErrorMap = () => {
  useEffect(() => {
    // Zod エラーマップの初期化を実行
    initializeZodErrorMap();
  }, []);
};
