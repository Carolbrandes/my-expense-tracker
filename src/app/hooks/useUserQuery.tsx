import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserProps } from '../types/interfaces';
import { useAuth } from './useAuthContext';

const fetchUser = async (userId: string): Promise<{ id: number; email: string; currency: string; }> => {
    const response = await fetch(`/api/user?userId=${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }
    return response.json();
};

const updateUser = async (user: UserProps): Promise<{ id: number; email: string; currency: string; }> => {
    const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        throw new Error('Failed to update user currency');
    }
    const data = await response.json();
    return data;
};


export const useUserQuery = () => {
    const { userId } = useAuth();
    const queryClient = useQueryClient();

    const {
        data: user = { id: 0, email: '', currency: 'Dólar Americano' },
        isLoading: isUserLoading,
        error: userError,
    } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => userId ? fetchUser(userId) : Promise.reject(new Error("User ID is required")),
        enabled: !!userId,
    });

    const {
        mutate: updateUserMutation,
        status,
        error: updateUserError,
    } = useMutation({
        mutationFn: (userUpdate: UserProps) => {
            if (!userId) {
                return Promise.resolve(null);
            }
            return updateUser(userUpdate);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', userId] });
        },
    });

    const isUserUpdating = status === 'pending';

    return {
        user,
        isUserLoading,
        userError,
        updateUser: updateUserMutation,
        isUserUpdating,
        updateUserError,
    };
};


