import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    console.log("🚀 ~ POST ~ amount:", body.amount)

    // Verifica se a data está no formato esperado
    const date = new Date(body.date);
    if (isNaN(date.getTime())) {
        return NextResponse.json({ message: 'Data inválida. Utilize o formato YYYY-MM-DD.' }, { status: 400 });
    }

    const expense = await prisma.expense.create({
        data: {
            description: body.description,
            category: body.category,
            amount: body.amount,
            date: date, // Passa o objeto Date aqui
            type: body.type,
        },
    });

    return NextResponse.json(expense);
}

export async function GET() {
    const expenses = await prisma.expense.findMany();
    return NextResponse.json(expenses);
}