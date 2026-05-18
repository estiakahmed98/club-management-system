import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    
    const skip = (page - 1) * limit;
    
    const where: Prisma.ExpenseWhereInput = {
      ...(search && {
        description: { contains: search, mode: "insensitive" },
      }),
      ...(category && { category }),
    };
    
    const [total, expenses] = await prisma.$transaction([
      prisma.expense.count({ where }),
      prisma.expense.findMany({
        where,
        skip,
        take: limit,
        orderBy: { expenseDate: "desc" },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      }),
    ]);
    
    const formattedExpenses = expenses.map(expense => ({
      id: expense.id,
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      expenseDate: expense.expenseDate,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
      user: expense.user.profile ? {
        name: expense.user.profile.name,
        email: expense.user.email,
      } : null,
    }));
    
    return NextResponse.json({
      expenses: formattedExpenses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET EXPENSES ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { amount, category, description } = await req.json();
    
    // Get user from session (you need to implement proper auth)
    // For now, using a default admin user or get from token
    const userId = req.headers.get("x-user-id") || "default-admin-id";

    if (!amount || amount <= 0 || !category || !description) {
      return NextResponse.json(
        { error: "Amount, category, and description are required" },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        userId,
        amount,
        category,
        description,
      },
    });

    return NextResponse.json({ success: true, expense }, { status: 201 });
  } catch (error) {
    console.error("[CREATE EXPENSE ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
