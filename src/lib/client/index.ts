import { getBaseURL } from "@/lib/client/baseUrl";
import { createRpcClient, PathStructure } from "@/lib/client/rpc";

export const client = createRpcClient<PathStructure>(getBaseURL());
