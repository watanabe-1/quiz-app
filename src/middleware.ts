import { chainMiddlewares } from "@/middlewares/chainMiddlewares";
import { withLogin } from "@/middlewares/withLogin";

// ミドルウェアを連結
export default chainMiddlewares([withLogin]);
