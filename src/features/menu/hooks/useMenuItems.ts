import { usePathname } from "next/navigation";
import { useData } from "@/hooks/useData";
import { client } from "@/lib/client";

export const useMenuItems = () => {
  const pathname = usePathname();
  const query = { query: { path: pathname } };
  const rpc = client.api.menu;

  return useData(() => rpc.$get(query), rpc.$url(query).path);
};
