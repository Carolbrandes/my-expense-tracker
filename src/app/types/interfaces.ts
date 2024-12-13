export enum TransactionType {
    Income = 'income',
    Expense = 'expense',
}

export interface Expense {
    id: number | string;
    description: string;
    category: string;
    amount: number;
    date: string;
    type: TransactionType;
    userId: number | string
};

export type ExpenseDelete = Pick<Expense, 'id' | 'description'>

export interface Category {
    id: number,
    name: string
}

export interface SortCriteria {
    column: string;
    direction: "asc" | "desc"
}