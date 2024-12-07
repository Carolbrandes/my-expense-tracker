export enum TransactionType {
    Income = 'income',
    Expense = 'expense',
}

export interface Expense {
    id: number;
    description: string;
    category: string;
    amount: number;
    date: string;
    type: TransactionType;
    userId: number | string
};

export interface Category {
    id: number,
    name: string
}