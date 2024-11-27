import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Get categories for the current user
export async function GET(req: Request) {
  try {
    // Assuming the userId is passed in the request (e.g., from session or authentication)
    const userId = await getUserIdFromRequest(req); // You should implement this function

    if (!userId) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      where: {
        userId: userId,  // Filter categories by the logged-in user
      },
    });

    console.log("🚀 ~ GET ~ categories:", categories);
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao buscar categorias", error },
      { status: 500 }
    );
  }
}

// Create a new category for the current user
export async function POST(req: Request) {
  try {
    const { name } = await req.json(); // Extract category name from request body
    const userId = await getUserIdFromRequest(req); // You should implement this function

    if (!userId) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { message: "Nome da categoria é obrigatório." },
        { status: 400 }
      );
    }

    // Create a new category linked to the userId
    const newCategory = await prisma.category.create({
      data: {
        name,
        userId,  // Associate the new category with the logged-in user
      },
    });

    return NextResponse.json(newCategory, { status: 201 }); // Return the newly created category
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao salvar a categoria", error },
      { status: 500 }
    );
  }
}

// Helper function to extract userId from the request (e.g., from session or JWT token)
async function getUserIdFromRequest(req: Request): Promise<number | null> {
  console.log("🚀 ~ getUserIdFromRequest ~ req:", req)
  // Implement logic to extract userId from the request, e.g., from an authenticated session
  // This can be from headers, cookies, or JWT token
  // For example:

  const userId = 1; // Just an example, replace with actual extraction logic
  return userId;  // Return the userId if available, otherwise null
}
