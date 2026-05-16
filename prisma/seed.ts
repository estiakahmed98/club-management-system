import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";

async function main() {
  const databaseUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("POSTGRES_PRISMA_URL or DATABASE_URL is not set");
  }

  const pool = new Pool({ connectionString: databaseUrl });

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@fff.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "admin12345";

  try {
    const tableCheck = await pool.query(`select to_regclass('public."User"') as t`);
    const userTable = tableCheck.rows?.[0]?.t as string | null | undefined;
    if (!userTable) {
      console.warn('Seed skipped: table "User" does not exist. Run `prisma migrate dev` (or create tables) first.');
      return;
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const existing = await pool.query(`select id from "User" where email = $1 limit 1`, [adminEmail]);
    if (existing.rowCount && existing.rows[0]?.id) return;

    const userId = uuidv4();
    await pool.query(
      `insert into "User" (id, email, password, role, "createdAt", "updatedAt")
       values ($1, $2, $3, $4, now(), now())`,
      [userId, adminEmail, passwordHash, "admin"],
    );

    const profileCheck = await pool.query(`select to_regclass('public."MemberProfile"') as t`);
    const profileTable = profileCheck.rows?.[0]?.t as string | null | undefined;
    if (profileTable) {
      await pool.query(
        `insert into "MemberProfile" (id, "userId", name, "joiningDate", "createdAt", "updatedAt")
         values ($1, $2, $3, now(), now(), now())`,
        [uuidv4(), userId, "Administrator"],
      );
    }
  } finally {
    await pool.end();
  }
}

main()
  .catch(async (err) => {
    console.error(err);
    process.exit(1);
  });
