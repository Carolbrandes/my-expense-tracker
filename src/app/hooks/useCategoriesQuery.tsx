import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Category } from '../types/interfaces';
import { useAuth } from './useAuthContext'; // Import the AuthContext hook



const fetchCategories = async (userId: string): Promise<Category[]> => {
    const response = await fetch(`/api/categories?userId=${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    const data = await response.json();  // Read the response body once
    console.log("🚀 ~ fetchCategories ~ data:", data);  // Log the parsed data
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
    const { userId } = useAuth(); // Access userId from context
    console.log("🚀 ~ useCategoriesQuery ~ userId:", userId)
    const queryClient = useQueryClient(); // Access the React Query Client

    // Use query and mutation hooks unconditionally
    const {
        data: categories,
        isLoading: isCategoriesLoading,
        error: categoriesError,
    } = useQuery({
        queryKey: ['categories', userId],
        queryFn: () => (userId ? fetchCategories(userId) : Promise.resolve([])), // Only fetch if userId is available
        enabled: !!userId, // The query only runs when userId is available
    });

    const {
        mutate: createCategory,
        status,
        error: createError,
    } = useMutation({
        mutationFn: (newCategory: string) => {
            if (!userId) {
                return Promise.resolve(null); // Safely return when userId is not available
            }
            return addCategory(newCategory, userId); // Perform the mutation if userId is available
        },
        onSuccess: () => {
            // Invalidate the categories query to refresh the list
            queryClient.invalidateQueries({ queryKey: ['categories', userId] });
        },
    });

    const isCreating = status === 'pending';

    // You can safely return default values or handle loading/error states
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
