import { usePathname } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import { client } from "@/lib/client";
import { MenuItem } from "@/types/quizType";

export const useMenuItems = () => {
  const pathname = usePathname();

  return useFetch<MenuItem[]>(
    client.api.menu.$url({ query: { path: pathname } }).path,
  );
};
