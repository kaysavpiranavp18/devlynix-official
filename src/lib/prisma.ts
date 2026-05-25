import { loadEnvConfig } from '@next/env';
import { PrismaClient } from '@prisma/client';

loadEnvConfig(process.cwd());

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function assertPrismaEnv() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is missing. Add your Supabase Postgres connection string to .env.local before running Prisma-backed pages.'
    );
  }

  if (!process.env.DIRECT_URL) {
    throw new Error(
      'DIRECT_URL is missing. Add the direct Supabase Postgres connection string to .env.local so Prisma can connect reliably.'
    );
  }
}

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    assertPrismaEnv();

    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  })();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
