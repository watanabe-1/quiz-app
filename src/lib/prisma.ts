import { PrismaClient } from "@prisma/client";

declare global {
  // この宣言により、PrismaClientのインスタンスがグローバルに再利用されます（開発環境でのホットリロード対策）
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
