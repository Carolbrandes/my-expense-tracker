import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Get categories for the current user
export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      where: { userId },
    });


    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching categories", error },
      { status: 500 }
    );
  }
}

// Create a new category for the current user
export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    const userId = await getUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { message: "Category name is required" },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating category", error },
      { status: 500 }
    );
  }
}


async function getUserIdFromRequest(req: Request): Promise<number | null> {
  const userId = 1;
  return userId;
}
