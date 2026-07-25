import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "@/generated/prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrisma(): PrismaClient {
  const url = process.env.DATABASE_URL || "file:./data.db"
  const adapter = new PrismaBetterSqlite3({ url })
  return new PrismaClient({ adapter })
}

let _prisma: PrismaClient

function getPrisma(): PrismaClient {
  if (!_prisma) {
    _prisma = globalForPrisma.prisma ?? createPrisma()
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = _prisma
    }
  }
  return _prisma
}

// Export a proxy that lazily initializes the Prisma client.
// This avoids crashing during build when DATABASE_URL may not be set.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma()
    const value = Reflect.get(client, prop, client)
    return typeof value === "function" ? value.bind(client) : value
  },
})
