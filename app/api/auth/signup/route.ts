import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUsers = await executeQuery(
      'SELECT * FROM "User" WHERE email = $1',
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    const userId = uuidv4();

    // Create user
    await executeQuery(
      'INSERT INTO "User" (id, email, password, role) VALUES ($1, $2, $3, $4)',
      [userId, email, hashedPassword, "member"]
    );

    // Create member profile
    const profileId = uuidv4();
    await executeQuery(
      'INSERT INTO "MemberProfile" (id, "userId", name) VALUES ($1, $2, $3)',
      [profileId, userId, name || email.split("@")[0]]
    );

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: {
          id: userId,
          email,
          role: "member",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[SIGNUP ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
