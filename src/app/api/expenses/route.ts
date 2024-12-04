import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Add a new expense
export async function POST(request: Request) {
    const body = await request.json();
    const { description, category, amount, date, type, userId } = body;

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required.' }, { status: 400 });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return NextResponse.json({ message: 'Invalid date. Use the format YYYY-MM-DD.' }, { status: 400 });
    }

    try {
        const expense = await prisma.expense.create({
            data: {
                description,
                category,
                amount,
                date: parsedDate,
                type,
                userId,
            },
        });

        return NextResponse.json(expense, { status: 201 });
    } catch (error) {
        console.error("Error creating expense:", error);
        return NextResponse.json({ message: 'Error creating expense.' }, { status: 500 });
    }
}

// Get all expenses for a user
export async function GET(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required.' }, { status: 400 });
    }

    try {
        const expenses = await prisma.expense.findMany({
            where: { userId: parseInt(userId, 10) },
        });

        return NextResponse.json(expenses, { status: 200 });
    } catch (error) {
        console.error("Error fetching expenses:", error);
        return NextResponse.json({ message: 'Error fetching expenses.' }, { status: 500 });
    }
}
