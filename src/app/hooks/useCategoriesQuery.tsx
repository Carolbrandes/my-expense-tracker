import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Category } from '../types/interfaces';
import { useAuth } from './useAuthContext';



const fetchCategories = async (userId: string): Promise<Category[]> => {
    const response = await fetch(`/api/categories?userId=${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    const data = await response.json();

    return data;
};

const addCategory = async (newCategory: string, userId: string): Promise<Category> => {
    const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategory, userId }),
    });

    if (!response.ok) {
        throw new Error('Failed to create category');
    }
    return response.json();
};

export const useCategoriesQuery = () => {
    const { userId } = useAuth();

    const queryClient = useQueryClient();


    const {
        data: categories,
        isLoading: isCategoriesLoading,
        error: categoriesError,
    } = useQuery({
        queryKey: ['categories', userId],
        queryFn: () => (userId ? fetchCategories(userId) : Promise.resolve([])),
        enabled: !!userId,
    });

    const {
        mutate: createCategory,
        status,
        error: createError,
    } = useMutation({
        mutationFn: (newCategory: string) => {
            if (!userId) {
                return Promise.resolve(null);
            }
            return addCategory(newCategory, userId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories', userId] });
        },
    });

    const isCreating = status === 'pending';


    if (!userId) {
        return {
            categories: [],
            isCategoriesLoading: false,
            categoriesError: null,
            createCategory: () => { },
            isCreating: false,
            createError: null,
        };
    }

    return {
        categories,
        isCategoriesLoading,
        categoriesError,
        createCategory,
        isCreating,
        createError,
    };
};
