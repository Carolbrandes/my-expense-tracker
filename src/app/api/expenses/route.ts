import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

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
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const description = searchParams.get('description');
        const category = searchParams.get('category');
        const type = searchParams.get('type');
        const sortBy = searchParams.get('sortBy') || 'date';
        const sortOrder = searchParams.get('sortOrder') || 'asc';
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // Validate userId
        if (!userId || isNaN(Number(userId))) {
            return NextResponse.json({ message: 'Valid User ID is required.' }, { status: 400 });
        }

        // Validate sorting parameters
        const allowedSortBy = ['date', 'description', 'category'];
        const allowedSortOrder = ['asc', 'desc'];

        if (!allowedSortBy.includes(sortBy)) {
            return NextResponse.json({ message: `Invalid sortBy value. Allowed: ${allowedSortBy.join(', ')}` }, { status: 400 });
        }

        if (!allowedSortOrder.includes(sortOrder)) {
            return NextResponse.json({ message: `Invalid sortOrder value. Allowed: ${allowedSortOrder.join(', ')}` }, { status: 400 });
        }

        // Prepare filters
        const filters: any = { userId: Number(userId) };


        if (description) {
            filters.description = { contains: String(description), mode: 'insensitive' };
        }
        if (category) {
            filters.category = { contains: String(category), mode: 'insensitive' };
        }
        if (type) {
            filters.type = { equals: String(type) };
        }
        if (startDate && endDate) {
            filters.date = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        } else if (startDate) {
            filters.date = { gte: new Date(startDate) };
        } else if (endDate) {
            filters.date = { lte: new Date(endDate) };
        }

        console.log("🚀 ~ GET ~ filters:", filters)

        // Fetch from database
        const expenses = await prisma.expense.findMany({
            where: filters,
            orderBy: {
                [sortBy]: sortOrder,
            },
        });
        console.log("🚀 ~ GET ~ expenses:", expenses)

        return NextResponse.json(expenses, { status: 200 });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return NextResponse.json({ message: 'Failed to fetch expenses' }, { status: 500 });
    }
}
