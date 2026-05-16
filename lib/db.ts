import { prisma } from "./prisma";

export { prisma };
export { prisma as db };

// Back-compat: some route handlers import `getDatabase()` expecting a db handle.
export function getDatabase() {
  return {
    query: async <T = any>(text: string, params: unknown[] = []) => {
      const rows = await executeQuery<T>(text, params);
      return { rows };
    },
  };
}

// Simple raw SQL helper used across route handlers.
// Supports Postgres-style placeholders ($1, $2, ...) via prisma.$queryRawUnsafe(query, ...params).
export async function executeQuery<T = any>(
  query: string,
  params: unknown[] = []
): Promise<T[]> {
  return prisma.$queryRawUnsafe<T[]>(query, ...params);
}
