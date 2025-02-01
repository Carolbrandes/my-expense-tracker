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

interface IFilters {
    userId: number;
    description?: { contains: string };
    category?: { contains: string };
    type?: { equals: string };
    amount?: { equals: number };
    date?: {
        gte?: Date;
        lte?: Date;
    };
}

// Get all expenses for a user
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const description = searchParams.get('description');
        const category = searchParams.get('category');
        const type = searchParams.get('type');
        const amount = searchParams.get('amount');
        const sortBy = searchParams.get('sortBy') || 'date';
        const sortOrder = searchParams.get('sortOrder') || 'desc';
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

        if (!userId || isNaN(Number(userId))) {
            return NextResponse.json({ message: 'Valid User ID is required.' }, { status: 400 });
        }

        const allowedSortBy = ['date', 'description', 'category', 'amount'];
        const allowedSortOrder = ['asc', 'desc'];

        if (!allowedSortBy.includes(sortBy)) {
            return NextResponse.json({ message: `Invalid sortBy value. Allowed: ${allowedSortBy.join(', ')}` }, { status: 400 });
        }

        if (!allowedSortOrder.includes(sortOrder)) {
            return NextResponse.json({ message: `Invalid sortOrder value. Allowed: ${allowedSortOrder.join(', ')}` }, { status: 400 });
        }

        if (page < 1 || pageSize < 1) {
            return NextResponse.json({ message: 'Page and pageSize must be greater than 0.' }, { status: 400 });
        }

        // Apply filters
        const filters: IFilters = { userId: Number(userId) };

        if (description) {
            filters.description = { contains: description }; // Case-sensitive search
        }

        if (category) {
            filters.category = { contains: category };
        }

        if (type) {
            filters.type = { equals: type };
        }

        if (amount) {
            filters.amount = { equals: +amount };
        }

        if (startDate && endDate) {
            filters.date = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        } else if (startDate) {
            filters.date = {
                gte: new Date(startDate),
            };
        } else if (endDate) {
            filters.date = {
                lte: new Date(endDate),
            };
        }

        const [expenses, totalCount] = await Promise.all([
            prisma.expense.findMany({
                where: filters,
                orderBy: {
                    [sortBy]: sortOrder,
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.expense.count({
                where: filters,
            }),
        ]);

        const totalPages = Math.ceil(totalCount / pageSize);

        return NextResponse.json({
            data: expenses,
            meta: {
                totalCount,
                totalPages,
                currentPage: page,
                pageSize,
            },
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return NextResponse.json({ message: 'Failed to fetch expenses' }, { status: 500 });
    }
}
