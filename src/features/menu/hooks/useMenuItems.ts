import { usePathname } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import { path_api_menu } from "@/lib/path";
import { MenuItem } from "@/types/quizType";

export const useMenuItems = () => {
  const pathname = usePathname();

  return useFetch<MenuItem[]>(
    path_api_menu().$url({ query: { path: pathname } }).path,
  );
};
