import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Adiciona nova despesa
export async function POST(request: Request) {
    const body = await request.json();
    const date = new Date(body.date);

    if (isNaN(date.getTime())) {
        return NextResponse.json({ message: 'Data inválida. Utilize o formato YYYY-MM-DD.' }, { status: 400 });
    }

    const expense = await prisma.expense.create({
        data: {
            description: body.description,
            category: body.category,
            amount: body.amount,
            date: date,
            type: body.type,
        },
    });

    return NextResponse.json(expense);
}

// Obtém todas as despesas
export async function GET() {
    const expenses = await prisma.expense.findMany();
    return NextResponse.json(expenses);
}



