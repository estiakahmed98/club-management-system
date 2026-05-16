import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const search = searchParams.get("search") || "";
    const purpose = searchParams.get("purpose") || "";
    const status = searchParams.get("status") || "";
    
    const skip = (page - 1) * limit;
    
    const where: Prisma.PaymentWhereInput = {
      ...(search && {
        OR: [
          { user: { profile: { name: { contains: search, mode: "insensitive" } } } },
          { user: { email: { contains: search, mode: "insensitive" } } },
        ],
      }),
      ...(purpose && { purpose }),
      ...(status && { status }),
    };
    
    const [total, payments] = await prisma.$transaction([
      prisma.payment.count({ where }),
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { paymentDate: "desc" },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      }),
    ]);
    
    const formattedPayments = payments.map(payment => ({
      id: payment.id,
      name: payment.user.profile?.name || payment.user.email,
      email: payment.user.email,
      amount: payment.amount,
      purpose: payment.purpose,
      description: payment.description,
      status: payment.status,
      paymentDate: payment.paymentDate,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    }));
    
    return NextResponse.json({
      payments: formattedPayments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET PAYMENTS ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, amount, purpose, description, status } = await req.json();

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "User ID and valid amount are required" },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        purpose: purpose || "other",
        description: description || null,
        status: status || "paid",
      },
    });

    return NextResponse.json({ success: true, payment }, { status: 201 });
  } catch (error) {
    console.error("[CREATE PAYMENT ERROR]", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Selected member was not found. Please reselect a member." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
