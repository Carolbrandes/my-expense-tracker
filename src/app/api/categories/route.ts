import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const categories = await prisma.category.findMany();
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao buscar categorias', error }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { name } = await req.json(); // Obtém o corpo da requisição

        if (!name || typeof name !== 'string') {
            return NextResponse.json({ message: 'Nome da categoria é obrigatório.' }, { status: 400 });
        }

        // Cria uma nova categoria no banco de dados
        const newCategory = await prisma.category.create({
            data: {
                name,
            },
        });

        return NextResponse.json(newCategory, { status: 201 }); // Retorna a nova categoria criada
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao salvar a categoria', error }, { status: 500 });
    }
}