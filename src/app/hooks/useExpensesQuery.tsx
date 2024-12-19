import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Expense, ExpenseDelete, ExpenseResponse } from '../types/interfaces';
import { useAuth } from './useAuthContext'; // Import the AuthContext hook

interface Filters {
    description?: string;
    category?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    pageSize?: number;
}

const fetchExpenses = async (
    userId: string,
    filters?: Filters
): Promise<ExpenseResponse> => {
    const validFilters = filters
        ? Object.entries(filters).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                acc[key] = value.toString(); // Convert all values to strings
            }
            return acc;
        }, {} as Record<string, string>)
        : {}; // Default to an empty object if filters are not provided


    const queryParams = new URLSearchParams({
        userId,
        ...validFilters, // Only include valid filters
    });

    const response = await fetch(`/api/expenses?${queryParams.toString()}`);

    if (!response.ok) {
        throw new Error('Failed to fetch expenses');
    }

    const data = await response.json();
    console.log("🚀 ~ useExpensesQuery data:", data)
    return data
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
        throw new Error(errorData.message);  // Throw error if request fails
    }

    return res.json();  // Return the updated expense data
};

const deleteExpense = async (deleteExpense: ExpenseDelete) => {
    const { id } = deleteExpense;

    const res = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);  // Throw error if request fails
    }

    return id;  // Return the id of the deleted expense
};

export const useExpensesQuery = (filters?: {
    description?: string;
    category?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    pageSize?: number;
}) => {
    const { userId } = useAuth(); // Access userId from context

    const queryClient = useQueryClient(); // Access the React Query Client

    // Use query and mutation hooks unconditionally
    const {
        data: expenses,
        isLoading: isExpensesLoading,
        error: expensesError,
    } = useQuery({
        queryKey: ['expenses', userId, filters], // Inclui os filtros na chave
        queryFn: () => {
            if (!userId) return Promise.resolve({ data: [], meta: null }); // Retorna uma promessa vazia se o userId não estiver disponível
            return fetchExpenses(userId, filters);  // Passa os dois argumentos corretamente
        },
        enabled: !!userId, // Apenas executa a consulta se userId estiver disponível
    });


    const {
        mutate: createExpense,
        status,
        error: createError,
    } = useMutation({
        mutationFn: (newExpense: Expense) => {
            if (!userId) {
                return Promise.resolve(null); // Safely return when userId is not available
            }
            return addExpense(newExpense, userId); // Perform the mutation if userId is available
        },
        onSuccess: () => {
            // Invalidate the expenses query to refresh the list
            queryClient.invalidateQueries({ queryKey: ['expenses', userId] });
        },
    });

    // Mutation for editing an expense
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

    // Mutation for deleting an expense
    const {
        mutate: removeExpense,
        status: deleteStatus,
        error: deleteError,
    } = useMutation({
        mutationFn: deleteExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', userId] }); // Invalidate query to refresh data
        },
    });

    const isCreating = status === 'pending';

    // You can safely return default values or handle loading/error states
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
            deleteError: null
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
        deleteError
    };

};
