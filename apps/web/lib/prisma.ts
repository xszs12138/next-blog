import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@/generated/prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrisma(): PrismaClient {
  const connectionString =
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL ??
    process.env.DATABASE_URL ??
    "postgresql://localhost:5432/next-blog"

  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
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
