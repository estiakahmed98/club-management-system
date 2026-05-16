import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma, TeamCategory } from "@/lib/prisma/client";
import bcrypt from "bcryptjs";

interface CreateMemberRequestBody {
  name: string;
  phone?: string | null;
  bloodGroup?: string | null;
  jerseySize?: string | null;
  email: string;
  password: string;
  teamCategory?: TeamCategory;
}

interface MemberResponse {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string | null;
  bloodGroup?: string | null;
  jerseySize?: string | null;
  teamCategory: TeamCategory;
  joiningDate: Date;
}

interface PaginationResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function isValidTeamCategory(value: string | null): value is TeamCategory {
  return value === "JUNIOR" || value === "SENIOR" || value === "GUEST";
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const search = searchParams.get("search")?.trim() || "";
    const bloodGroup = searchParams.get("bloodGroup")?.trim();
    const jerseySize = searchParams.get("jerseySize")?.trim();
    const teamCategoryParam = searchParams.get("teamCategory");

    const teamCategory = isValidTeamCategory(teamCategoryParam)
      ? teamCategoryParam
      : undefined;

    const skip = (page - 1) * limit;

    const where: Prisma.MemberProfileWhereInput = {
      user: {
        role: "member",
      },
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              {
                user: {
                  email: { contains: search, mode: "insensitive" },
                },
              },
            ],
          }
        : {}),
      ...(bloodGroup ? { bloodGroup } : {}),
      ...(jerseySize ? { jerseySize } : {}),
      ...(teamCategory ? { teamCategory } : {}),
    };

    const [total, members] = await prisma.$transaction([
      prisma.memberProfile.count({ where }),
      prisma.memberProfile.findMany({
        where,
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          name: "asc",
        },
      }),
    ]);

    const formattedMembers: MemberResponse[] = members.map((member) => ({
      id: member.id,
      userId: member.userId,
      name: member.name,
      email: member.email || member.user.email,
      phone: member.phone,
      bloodGroup: member.bloodGroup,
      jerseySize: member.jerseySize,
      teamCategory: member.teamCategory,
      joiningDate: member.joiningDate,
    }));

    const pagination: PaginationResponse = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return NextResponse.json({
      members: formattedMembers,
      pagination,
    });
  } catch (error) {
    console.error("[GET MEMBERS ERROR]", error);

    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateMemberRequestBody;

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const phone = body.phone?.trim() || null;
    const bloodGroup = body.bloodGroup?.trim() || null;
    const jerseySize = body.jerseySize?.trim() || null;
    const teamCategory = body.teamCategory || "JUNIOR";

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    if (!isValidTeamCategory(teamCategory)) {
      return NextResponse.json(
        { error: "Invalid team category" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "member",
        },
      });

      const profile = await tx.memberProfile.create({
        data: {
          userId: user.id,
          name,
          email,
          phone,
          bloodGroup,
          jerseySize,
          teamCategory,
        },
      });

      return { user, profile };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Member created",
        data: result,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[CREATE MEMBER ERROR]", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create member" },
      { status: 500 },
    );
  }
}
