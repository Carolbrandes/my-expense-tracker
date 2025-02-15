import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Convert userId to number (if your ID is stored as an Int)
        const userIdNumber = Number(userId);
        if (isNaN(userIdNumber)) {
            return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
        }

        // Fetch user data from Prisma
        const user = await prisma.user.findUnique({
            where: { id: userIdNumber },
            select: {
                id: true,
                email: true,
                currency: true,
                createdAt: true,
                categories: true,
                expenses: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const respUserJson = NextResponse.json(user);
        console.log("🚀 ~ GET ~ respUserJson:", respUserJson)

        return respUserJson
    } catch (error) {
        console.error("🚀 ~ GET /api/user error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { ...updateData } = body;

        console.log("🚀 ~ POST ~ updateData:", updateData);

        const user = await prisma.user.findUnique({
            where: { id: updateData.id }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: updateData.id },
            data: updateData,
        });

        console.log("🚀 ~ POST ~ updatedUser:", updatedUser);

        return NextResponse.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("🚀 ~ POST ~ error:", error);
        return NextResponse.json({ error: "Error updating user data" }, { status: 500 });
    }
}




