import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    // Verify this is a development request or has a secret key
    const authHeader = req.headers.get("authorization");
    const expectedSecret = process.env.SEED_SECRET || "dev-secret";

    if (authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("🌱 Seeding database...");

    // Create admin user
    const adminId = uuidv4();
    const adminPassword = await hashPassword("admin123");

    await executeQuery(
      'INSERT INTO "User" (id, email, password, role) VALUES ($1, $2, $3, $4)',
      [adminId, "admin@club.com", adminPassword, "admin"]
    );

    const adminProfileId = uuidv4();
    await executeQuery(
      'INSERT INTO "MemberProfile" (id, "userId", name) VALUES ($1, $2, $3)',
      [adminProfileId, adminId, "অ্যাডমিন ব্যবহারকারী"]
    );

    console.log("✅ Admin user created");

    // Create member user
    const memberId = uuidv4();
    const memberPassword = await hashPassword("member123");

    await executeQuery(
      'INSERT INTO "User" (id, email, password, role) VALUES ($1, $2, $3, $4)',
      [memberId, "member@club.com", memberPassword, "member"]
    );

    const memberProfileId = uuidv4();
    await executeQuery(
      'INSERT INTO "MemberProfile" (id, "userId", name, phone, "bloodGroup", "jerseySize") VALUES ($1, $2, $3, $4, $5, $6)',
      [memberProfileId, memberId, "সদস্য ব্যবহারকারী", "01700000000", "O+", "M"]
    );

    console.log("✅ Member user created");

    // Create sample event
    const eventId = uuidv4();
    await executeQuery(
      'INSERT INTO "Event" (id, name, description, "eventDate", location, type, budget) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [
        eventId,
        "ঈদ পুনর্মিলনী",
        "সকল সদস্যদের জন্য ঈদ উদযাপন",
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        "ক্লাব গ্রাউন্ড",
        "eid-reunion",
        5000,
      ]
    );

    console.log("✅ Sample event created");

    // Create sample match
    const matchId = uuidv4();
    await executeQuery(
      'INSERT INTO "Match" (id, name, opponent, "matchDate", location, "matchType") VALUES ($1, $2, $3, $4, $5, $6)',
      [
        matchId,
        "বন্ধুত্বপূর্ণ খেলা",
        "প্রতিপক্ষ দল",
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        "স্টেডিয়াম",
        "friendly",
      ]
    );

    console.log("✅ Sample match created");

    // Create sample tournament
    const tournamentId = uuidv4();
    await executeQuery(
      'INSERT INTO "Tournament" (id, name, "startDate", "endDate", location, "entryFee", "totalPrize", description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        tournamentId,
        "গ্রীষ্মকালীন টুর্নামেন্ট",
        new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        "প্রধান মাঠ",
        500,
        10000,
        "বছরের সবচেয়ে বড় টুর্নামেন্ট",
      ]
    );

    console.log("✅ Sample tournament created");

    // Create sample payments
    await executeQuery(
      'INSERT INTO "Payment" (id, "userId", amount, purpose, description, status) VALUES ($1, $2, $3, $4, $5, $6)',
      [uuidv4(), memberId, 1000, "monthly", "জুন মাসের অবদান", "paid"]
    );

    console.log("✅ Sample payment created");

    // Create sample expense
    await executeQuery(
      'INSERT INTO "Expense" (id, "userId", amount, category, description, "eventId") VALUES ($1, $2, $3, $4, $5, $6)',
      [uuidv4(), adminId, 2000, "food", "ঈদ উদযাপনের জন্য খাবার", eventId]
    );

    console.log("✅ Sample expense created");

    return NextResponse.json(
      {
        success: true,
        message: "Database seeded successfully!",
        credentials: {
          admin: { email: "admin@club.com", password: "admin123" },
          member: { email: "member@club.com", password: "member123" },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Seeding error:", error);
    return NextResponse.json(
      { error: "Seeding failed", details: String(error) },
      { status: 500 }
    );
  }
}
