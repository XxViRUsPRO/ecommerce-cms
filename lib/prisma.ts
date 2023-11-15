// Import needed packages
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;
if (!global.prisma) {
  // Setup
  const connectionString = `${process.env.TURSO_DATABASE_URL}`;
  const authToken = `${process.env.TURSO_AUTH_TOKEN}`;

  // Init prisma client
  const libsql = createClient({
    url: connectionString,
    authToken,
  });
  const adapter = new PrismaLibSQL(libsql);
  prisma = new PrismaClient({ adapter } as any);
} else {
  prisma = global.prisma;
}

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;
