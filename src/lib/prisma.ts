import { Environments } from "@/constants/enums";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 1. إنشاء اتصال Pool باستخدام رابط قاعدة البيانات من ملف الـ .env
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. إعداد الـ Adapter الخاص بـ PostgreSQL لنسخة بريزما 7
const adapter = new PrismaPg(pool);

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: adapter, // تمرير الـ adapter هنا إلزامي في الإصدار 7
    log:
      process.env.NODE_ENV === Environments.DEV
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== Environments.PROD) globalForPrisma.prisma = db;
