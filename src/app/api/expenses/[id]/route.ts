import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// Atualiza uma transacao existente
export async function PUT(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const idString = pathname.split('/').pop();
    const id = idString ? parseInt(idString, 10) : null;

    if (id === null || isNaN(id)) {
        return NextResponse.json({ message: 'ID inválido.' }, { status: 400 });
    }

    const body = await request.json();
    const { description, category, amount, date, type } = body;

    const updatedDate = new Date(date);
    if (isNaN(updatedDate.getTime())) {
        return NextResponse.json({ message: 'Data inválida. Utilize o formato YYYY-MM-DD.' }, { status: 400 });
    }

    try {
        const updatedExpense = await prisma.expense.update({
            where: { id },
            data: {
                description,
                category,
                amount,
                date: updatedDate,
                type
            } as Prisma.ExpenseUpdateInput
        });

        return NextResponse.json(updatedExpense);
    } catch (error) {
        console.error("Error updating expense:", error);
        return NextResponse.json({ message: 'Erro ao atualizar despesa.' }, { status: 500 });
    }
}

// Deleta uma despesa
export async function DELETE(request: NextRequest) {
    // Captura o ID da URL
    const { pathname } = request.nextUrl;
    const idString = pathname.split('/').pop(); // Pega a última parte da URL

    // Verifica se o id é válido e converte para número
    const id = idString ? parseInt(idString, 10) : null;

    if (id === null || isNaN(id)) {
        return NextResponse.json({ message: 'ID inválido.' }, { status: 400 });
    }

    try {
        await prisma.expense.delete({
            where: { id }, // Usando o id convertido para número
        });
        return NextResponse.json({ message: 'Despesa deletada com sucesso.' });
    } catch (error) {
        console.error("🚀 ~ DELETE ~ error deleteExpense:", error);
        return NextResponse.json({ message: 'Erro ao deletar despesa.' }, { status: 500 });
    }
}