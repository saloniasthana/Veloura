import path from "node:path";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const dbPath = (process.env.DATABASE_URL ?? "file:./prisma/dev.db").replace(
    /^file:/,
    ""
  );
  const adapter = new PrismaBetterSqlite3({
    url: `file:${path.resolve(/*turbopackIgnore: true*/ process.cwd(), dbPath)}`,
  });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
