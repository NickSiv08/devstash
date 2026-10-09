import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations use Neon's direct (unpooled) connection. The app uses the pooled DATABASE_URL.
    url: process.env["DIRECT_URL"],
  },
});
