export enum TransactionType {
    Income = 'income',
    Expense = 'expense',
}

export interface Expense {
    id: string;
    description: string;
    category: string;
    amount: number;
    date: string;
    type: TransactionType;
};

export interface Category {
    id: number,
    name: string
}