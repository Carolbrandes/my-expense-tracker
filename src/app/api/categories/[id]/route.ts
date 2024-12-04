import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Get a specific category by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const category = await prisma.category.findUnique({
            where: { id: Number(id) },
        });

        if (!category) {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }

        return NextResponse.json(category, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching the category", error },
            { status: 500 }
        );
    }
}

// Update a specific category by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { name } = await req.json();

        if (!name || typeof name !== "string") {
            return NextResponse.json(
                { message: "Category name is required" },
                { status: 400 }
            );
        }

        const updatedCategory = await prisma.category.update({
            where: { id: Number(id) },
            data: { name },
        });

        return NextResponse.json(updatedCategory, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Error updating the category", error },
            { status: 500 }
        );
    }
}

// Delete a specific category by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        await prisma.category.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ message: "Category deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Error deleting the category", error },
            { status: 500 }
        );
    }
}
