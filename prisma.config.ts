import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  datasource: {
    // إخبار بريزما بقراءة رابط قاعدة البيانات من ملف الـ .env بشكل آمن
    url: process.env.DIRECT_URL,
  },
});
