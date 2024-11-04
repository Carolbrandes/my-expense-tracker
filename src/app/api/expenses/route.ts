import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

// Define the shape of the request body
interface ExpenseRequestBody {
    description: string;
    category: string;
    amount: number;
    date: string; // Expecting a date string in YYYY-MM-DD format
    type: string;

}

// Adiciona nova transação
export async function POST(request: Request) {
    const body: ExpenseRequestBody = await request.json();
    const date = new Date(body.date);

    // Validate the date
    if (isNaN(date.getTime())) {
        return NextResponse.json({ message: 'Data inválida. Utilize o formato YYYY-MM-DD.' }, { status: 400 });
    }

    // Create the expense
    const expense = await prisma.expense.create({
        data: {
            description: body.description,
            category: body.category,
            amount: body.amount,
            date: date,
            type: body.type,

        } as Prisma.ExpenseCreateInput
    });

    return NextResponse.json(expense);
}

// Obtém todas as despesas
export async function GET() {
    const expenses = await prisma.expense.findMany();
    return NextResponse.json(expenses);
}