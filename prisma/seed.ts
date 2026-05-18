import "dotenv/config";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool = new Pool({
    connectionString: databaseUrl,
  });

  const adminEmail =
    process.env.SEED_ADMIN_EMAIL || "admin@fff.local";

  const adminPassword =
    process.env.SEED_ADMIN_PASSWORD || "admin12345";

  try {
    console.log("🌱 Starting database seed...");

    const tableCheck = await pool.query(
      `select to_regclass('public."User"') as t`
    );

    const userTable = tableCheck.rows?.[0]?.t;

    if (!userTable) {
      console.warn(
        '⚠️ "User" table does not exist. Run migrations first.'
      );
      return;
    }

    const existing = await pool.query(
      `select id from "User" where email = $1 limit 1`,
      [adminEmail]
    );

    if (existing.rowCount) {
      console.log("✅ Admin already exists");
      return;
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const userId = uuidv4();

    await pool.query(
      `
      insert into "User"
      (id, email, password, role, "createdAt", "updatedAt")
      values
      ($1, $2, $3, $4, now(), now())
      `,
      [userId, adminEmail, passwordHash, "admin"]
    );

    console.log("✅ Admin user created");

    const profileCheck = await pool.query(
      `select to_regclass('public."MemberProfile"') as t`
    );

    const profileTable = profileCheck.rows?.[0]?.t;

    if (profileTable) {
      await pool.query(
        `
        insert into "MemberProfile"
        (id, "userId", name, "joiningDate", "createdAt", "updatedAt")
        values
        ($1, $2, $3, now(), now(), now())
        `,
        [uuidv4(), userId, "Administrator"]
      );

      console.log("✅ Member profile created");
    }

    console.log("🎉 Seed completed successfully");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("❌ Seed failed");
  console.error(err);
  process.exit(1);
});