import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Get a specific expense by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
        return NextResponse.json({ message: 'Invalid ID.' }, { status: 400 });
    }

    try {
        const expense = await prisma.expense.findUnique({
            where: { id },
        });

        if (!expense) {
            return NextResponse.json({ message: 'Expense not found.' }, { status: 404 });
        }

        return NextResponse.json(expense, { status: 200 });
    } catch (error) {
        console.error("Error fetching expense:", error);
        return NextResponse.json({ message: 'Error fetching expense.' }, { status: 500 });
    }
}

// Update a specific expense by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
        return NextResponse.json({ message: 'Invalid ID.' }, { status: 400 });
    }

    const body = await request.json();
    const { description, category, amount, date, type } = body;

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return NextResponse.json({ message: 'Invalid date. Use the format YYYY-MM-DD.' }, { status: 400 });
    }

    try {
        const updatedExpense = await prisma.expense.update({
            where: { id },
            data: {
                description,
                category,
                amount,
                date: parsedDate,
                type,
            },
        });

        return NextResponse.json(updatedExpense, { status: 200 });
    } catch (error) {
        console.error("Error updating expense:", error);
        return NextResponse.json({ message: 'Error updating expense.' }, { status: 500 });
    }
}

// Delete a specific expense by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
        return NextResponse.json({ message: 'Invalid ID.' }, { status: 400 });
    }

    try {
        await prisma.expense.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Expense deleted successfully.' }, { status: 200 });
    } catch (error) {
        console.error("Error deleting expense:", error);
        return NextResponse.json({ message: 'Error deleting expense.' }, { status: 500 });
    }
}
