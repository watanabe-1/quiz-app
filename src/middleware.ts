import { chainMiddlewares } from "@/middlewares/chainMiddlewares";
import { widthLogin } from "@/middlewares/widthLogin";

// ミドルウェアを連結
export default chainMiddlewares([widthLogin]);
