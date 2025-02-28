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
    type: TransactionType | string;
    userId: number | string
};

export interface ExpenseResponse {
    data: Expense[] | []
    meta: {
        totalCount: number
        totalPages: number
        currentPage: number
        pageSize: number
    } | null
}

export type ExpenseDelete = Pick<Expense, 'id' | 'description'>

export interface Category {
    id: number,
    name: string
}


export interface FilterProps {
    description: string,
    category: string,
    type: TransactionType | string,
    startDate: string,
    endDate: string,
    sortBy: string;
    sortOrder: string;
}

export interface UserProps {
    id: number
    email: string
    currency: {
        acronym: string
        name: string
    }
    categories: Category[]
    expenses: Expense[]
}

