import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma, TeamCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

interface CreateMemberRequestBody {
  name: string;
  phone?: string | null;
  bloodGroup?: string | null;
  jerseySize?: string | null;
  jerseyNumber?: string | null;
  address?: string | null;
  bio?: string | null;
  email: string;
  password: string;
  teamCategory?: TeamCategory;
  playsFootball?: boolean;
  footballPosition?: string | null;
  playsCricket?: boolean;
  cricketRole?: string | null;
  rating?: number | string | null;
  imageUrl?: string | null;
}

interface MemberResponse {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string | null;
  bloodGroup?: string | null;
  jerseySize?: string | null;
  jerseyNumber?: string | null;
  address?: string | null;
  bio?: string | null;
  teamCategory: TeamCategory;
  joiningDate: Date;
  playsFootball: boolean;
  footballPosition?: string | null;
  playsCricket: boolean;
  cricketRole?: string | null;
  rating: number;
  imageUrl?: string | null;
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
    const jerseyNumber = searchParams.get("jerseyNumber")?.trim();
    const teamCategoryParam = searchParams.get("teamCategory");
    const playsFootball = searchParams.get("playsFootball") === "true";
    const playsCricket = searchParams.get("playsCricket") === "true";

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
              { phone: { contains: search, mode: "insensitive" } },
              { jerseyNumber: { contains: search, mode: "insensitive" } },
              { address: { contains: search, mode: "insensitive" } },
              { bio: { contains: search, mode: "insensitive" } },
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
      ...(jerseyNumber ? { jerseyNumber } : {}),
      ...(teamCategory ? { teamCategory } : {}),
      ...(searchParams.has("playsFootball") ? { playsFootball } : {}),
      ...(searchParams.has("playsCricket") ? { playsCricket } : {}),
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
      jerseyNumber: member.jerseyNumber,
      address: member.address,
      bio: member.bio,
      teamCategory: member.teamCategory,
      joiningDate: member.joiningDate,
      playsFootball: member.playsFootball,
      footballPosition: member.footballPosition,
      playsCricket: member.playsCricket,
      cricketRole: member.cricketRole,
      rating: member.rating,
      imageUrl: member.imageUrl,
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
    const jerseyNumber = body.jerseyNumber?.trim() || null;
    const address = body.address?.trim() || null;
    const bio = body.bio?.trim() || null;
    const teamCategory = body.teamCategory || "JUNIOR";
    const playsFootball = body.playsFootball ?? true;
    const footballPosition = body.footballPosition?.trim() || null;
    const playsCricket = body.playsCricket ?? false;
    const cricketRole = body.cricketRole?.trim() || null;
    const ratingRaw = body.rating;
    const rating =
      ratingRaw === undefined || ratingRaw === null || ratingRaw === ""
        ? 0
        : Number(ratingRaw);
    const imageUrl = body.imageUrl?.trim() || null;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    if (!Number.isFinite(rating)) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
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
          jerseyNumber,
          address,
          bio,
          teamCategory,
          playsFootball,
          footballPosition,
          playsCricket,
          cricketRole,
          rating,
          imageUrl,
        },
      });

      return { user, profile };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Member created successfully",
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
