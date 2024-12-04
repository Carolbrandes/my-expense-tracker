'use client';

import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';
import { Category, Expense } from '../types/interfaces';



interface TransactionProviderProps {
    readonly children: ReactNode
    userId: string | number | null
}


interface TransactionContextProps {
    categories: Category[]
    getCategories: () => Promise<Category[] | undefined>

    expenses: Expense[] | undefined
    getExpenses: () => Promise<Expense[] | undefined>;


    filteredExpenses: Expense[] | []
    updateFilteredExpenses: (newValue: Expense[]) => void

    loading: boolean
    updateLoading: (isLoading: boolean) => void

    isMobile: boolean

}

const TransactionContext = createContext<TransactionContextProps>(
    {} as TransactionContextProps
)


export function TransactionProvider({
    userId,
    children
}: TransactionProviderProps) {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<Category[]>([])

    const [loading, setLoading] = useState(true); // Inicialmente está carregando


    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const updateLoading = (isLoading: boolean) => setLoading(isLoading)

    const getExpenses = async (): Promise<Expense[] | undefined> => {
        setLoading(true);
        try {
            const resExpenses = await fetch(`/api/expenses?userId=${userId}`);  // Include userId in the query string
            if (resExpenses.ok) {
                const expensesData: Expense[] = await resExpenses.json();
                console.log("🚀 ~ fetchExpenses:", expensesData);
                setExpenses(expensesData); // Update state with fetched expenses
                return expensesData;
            } else {
                const errorData = await resExpenses.json();
                console.error('Erro ao buscar as despesas:', errorData.message);
                return undefined;
            }
        } catch (error) {
            console.error('Erro ao buscar as despesas:', error);
            return undefined;
        } finally {
            setLoading(false);
        }
    };


    const updateFilteredExpenses = (newValue: Expense[] | []) => setFilteredExpenses(newValue)


    const getCategories = async () => {
        setLoading(true)
        try {
            const resCategories = await fetch("/api/categories")
            const categories = await resCategories.json()
            console.log("🚀 ~ fetchData ~ categories:", categories)
            setCategories(categories)
            return categories

        } catch (error) {
            console.log("🚀 ~ getCategories ~ error:", error)

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getExpenses()
    }, [])


    const contextValue: TransactionContextProps = {
        categories,
        getCategories,
        expenses,
        getExpenses,
        filteredExpenses,
        updateFilteredExpenses,
        loading,
        updateLoading,
        isMobile
    }

    return (
        <TransactionContext.Provider value={contextValue}>
            {children}
        </TransactionContext.Provider>
    )
}

export function useTransaction() {
    const context = useContext(TransactionContext)

    return context
}
