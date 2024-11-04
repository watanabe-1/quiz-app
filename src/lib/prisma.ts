import { PrismaClient } from "@prisma/client";

declare global {
  /**
   * A global variable to store the PrismaClient instance. This allows reusing
   * the instance across hot reloads in development environments, preventing
   * issues with multiple instances.
   *
   * @var {PrismaClient | undefined} prisma - An instance of PrismaClient or undefined if not set.
   */
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Initializes a PrismaClient instance.
 *
 * @remarks
 * This instance is created once and reused in development environments to avoid
 * multiple PrismaClient instances being created due to hot reloads. In production,
 * a new instance is created for each import.
 *
 * @constant {PrismaClient} prisma - The PrismaClient instance, either a global instance in development or a new one in production.
 */
const prisma = global.prisma || new PrismaClient();

// Store the instance in the global scope for reuse in development
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
