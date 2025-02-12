import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Expense, ExpenseDelete, ExpenseResponse, FilterProps } from '../types/interfaces';
import { useAuth } from './useAuthContext';



const fetchExpenses = async (
    userId: string,
    page = 1,
    pageSize = 5,
    filters?: FilterProps
): Promise<ExpenseResponse> => {


    const validFilters = filters
        ? Object.entries(filters).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                acc[key] = String(value);
            }
            return acc;
        }, {} as Record<string, string>)
        : {};


    const queryParams = new URLSearchParams({
        userId: String(userId),
        page: String(page),
        pageSize: String(pageSize),
        ...validFilters,
    });


    const response = await fetch(`/api/expenses?${queryParams.toString()}`);


    if (!response.ok) {
        throw new Error('Failed to fetch expenses');
    }

    const data = await response.json();


    return {
        data: data.data,
        meta: data.meta,
    };
};

const addExpense = async (newExpense: Expense, userId: string): Promise<Expense> => {
    const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newExpense, userId }),
    });

    if (!response.ok) {
        throw new Error('Failed to create expense');
    }
    return response.json();
};

const editExpense = async (editExpense: Expense) => {
    const res = await fetch(`/api/expenses/${editExpense.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(editExpense),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
    }

    return res.json();
};

const deleteExpense = async (deleteExpense: ExpenseDelete) => {
    const { id } = deleteExpense;

    const res = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
    }

    return id;
};

export const useExpensesQuery = (
    page = 1,
    pageSize = 5,
    filters?: FilterProps,
    enabled: boolean = false
) => {
    const { userId } = useAuth();
    const queryClient = useQueryClient();

    const {
        data: expenses,
        isLoading: isExpensesLoading,
        error: expensesError,
        refetch,
    } = useQuery({
        queryKey: ['expenses', userId, page, pageSize, filters],
        queryFn: () => {
            if (!userId) return Promise.resolve({ data: [], meta: null });
            return fetchExpenses(userId, page, pageSize, filters);
        },
        enabled,
    });

    const {
        mutate: createExpense,
        status,
        error: createError,
    } = useMutation({
        mutationFn: (newExpense: Expense) => {
            if (!userId) {
                return Promise.resolve(null);
            }
            return addExpense(newExpense, userId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', userId] });
        },
    });

    const {
        mutate: updateExpense,
        status: updateStatus,
        error: updateError,
    } = useMutation({
        mutationFn: editExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', userId] });
        },
    });

    const {
        mutate: removeExpense,
        status: deleteStatus,
        error: deleteError,
    } = useMutation({
        mutationFn: deleteExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', userId] });
        },
    });

    const isCreating = status === 'pending';

    if (!userId) {
        return {
            expenses: {
                data: [],
                meta: null
            },
            isExpensesLoading: false,
            expensesError: null,
            createExpense: () => { },
            isCreating: false,
            createError: null,
            updateExpense: () => { },
            updateStatus: false,
            updateError: null,
            removeExpense: () => { },
            deleteStatus: false,
            deleteError: null,
            refetch: () => Promise.resolve(),
        };
    }

    return {
        expenses,
        isExpensesLoading,
        expensesError,
        createExpense,
        isCreating,
        createError,
        updateExpense,
        updateStatus,
        updateError,
        removeExpense,
        deleteStatus,
        deleteError,
        refetch,
    };
};
