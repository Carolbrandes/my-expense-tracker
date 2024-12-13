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
import { Category, Expense, ExpenseDelete, SortCriteria } from '../types/interfaces';



interface TransactionProviderProps {
    readonly children: ReactNode
    userId: string | number | null
}

interface DeleteTargetProps {
    id: number
    description: string
}


interface TransactionContextProps {
    categories: Category[]
    getCategories: () => Promise<Category[] | undefined>
    addCategories: (newCategory: Category) => void

    expenses: Expense[] | undefined
    getExpenses: () => Promise<Expense[] | undefined>;
    addExpense: (newExpense: Expense) => void
    editExpense: (editExpense: Expense) => void
    deleteExpense: (idDeleteExpense: ExpenseDelete) => void


    filteredExpenses: Expense[] | []
    updateFilteredExpenses: (newValue: Expense[]) => void

    loading: boolean
    updateLoading: (isLoading: boolean) => void

    isMobile: boolean

    formatDateFromISO: (isoString) => string

    editingId: number | null
    selectExpenseToEdit: (expenseSelectedId: number | null) => void

    deleteDialogOpen: boolean
    handleCancelModal: (isOpen: boolean) => void
    deleteTarget: DeleteTargetProps | null
    defineDeleteTarget: (data: DeleteTargetProps) => void

    sortCriteria: SortCriteria
    defineSortCriteria: (column: string) => void

}

const TransactionContext = createContext<TransactionContextProps>(
    {} as TransactionContextProps
)


export function TransactionProvider({
    userId,
    children
}: TransactionProviderProps) {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]); // leva em consideracao as transacoes filtradas e ordernacao
    const [categories, setCategories] = useState<Category[]>([])

    const [loading, setLoading] = useState(true); // Inicialmente está carregando
    const [editingId, setEditingId] = useState<number | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState<DeleteTargetProps | null>(null)

    const [sortCriteria, setSortCriteria] = useState<SortCriteria>(
        { column: 'description', direction: 'asc' }, // Defina a coluna padrão aqui
    );


    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const updateLoading = (isLoading: boolean) => setLoading(isLoading)

    const getExpenses = async (): Promise<Expense[] | undefined> => {
        if (!userId) return

        setLoading(true);
        try {
            const resExpenses = await fetch(`/api/expenses?userId=${userId}`);  // Include userId in the query string
            if (resExpenses.ok) {
                const expensesData: Expense[] = await resExpenses.json();

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

    const addExpense = (newExpense: Expense) => setExpenses(prevExp => [...prevExp, newExpense])

    const editExpense = async (editExpense: Expense) => {


        try {
            const res = await fetch(`/api/expenses/${editExpense.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editExpense),
            });

            if (res.ok && expenses) {
                const { id } = editExpense
                const index = expenses.findIndex(ex => ex.id === id)
                const expensesClone = [...expenses]
                expensesClone[index] = editExpense

                setExpenses(expensesClone)
            } else {
                const errorData = await res.json();
                console.error('Erro ao editar a despesa:', errorData.message);
            }
        } catch (error) {
            console.error('Erro ao editar a despesa:', error);
        }


    }


    const deleteExpense = async (deleteExpense: ExpenseDelete) => {
        const { id } = deleteExpense

        if (id) {
            try {
                const res = await fetch(`/api/expenses/${id}`, {
                    method: 'DELETE',
                });

                if (res.ok) {
                    setExpenses(prevExp => prevExp.filter(exp => exp.id !== id))
                    setDeleteTarget(null)
                    setDeleteDialogOpen(false)

                } else {
                    const errorData = await res.json();
                    console.error('Erro ao deletar a despesa:', errorData.message);
                }
            } catch (error) {
                console.error('Erro ao deletar a despesa:', error);
            }
        }
    }


    const defineDeleteTarget = (dataDeleteTarget: DeleteTargetProps) => setDeleteTarget(dataDeleteTarget)

    const updateFilteredExpenses = (newExpense: Expense[]) => {
        const expenseFilterAndSort = newExpense.sort((a, b) => {

            const { column, direction } = sortCriteria;
            let comparison = 0;

            if (column === 'description') {
                comparison = a.description.localeCompare(b.description);
            } else if (column === 'category') {
                comparison = a.category.localeCompare(b.category);
            } else if (column === 'amount') {
                comparison = a.amount - b.amount;
            } else if (column === 'date') {
                comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            }

            // Se a comparação não for zero, retorna o valor da ordenação
            if (comparison !== 0) {
                return direction === "asc" ? comparison : -comparison;
            }


            // Se todas as colunas foram iguais, mantém a ordem original
            return 0;
        })

        setFilteredExpenses(expenseFilterAndSort)
    }

    const getCategories = async () => {
        setLoading(true)
        try {
            const resCategories = await fetch("/api/categories")
            const categories = await resCategories.json()

            setCategories(categories)
            return categories

        } catch (error) {
            console.error("🚀 ~ getCategories ~ error:", error)

        } finally {
            setLoading(false)
        }
    }

    const addCategories = (newCategory: Category) => setCategories(prevCategories => [...prevCategories, newCategory])


    const selectExpenseToEdit = (expenseSelectedId: number) => setEditingId(expenseSelectedId)


    const formatDateFromISO = (isoString) => {
        const regex = /^(\d{4})-(\d{2})-(\d{2})/; // Regex to capture year, month, day
        const match = isoString.match(regex);

        if (match) {
            const [_, year, month, day] = match; // Destructure the match to get day, month, year
            return `${day}/${month}/${year}`; // Return in dd/MM/yyyy format
        }

        return isoString; // Fallback if the string doesn't match
    };

    const handleCancelModal = (isOpen: boolean) => setDeleteDialogOpen(isOpen)

    const defineSortCriteria = (column: string) => {
        setSortCriteria(prev => {
            // Se já estiver ordenando por essa coluna, apenas muda a direção
            if (prev.column == column) {
                return prev.column === column ? { ...prev, direction: prev.direction === "asc" ? "desc" : "asc" } : prev
            }

            return { column, direction: "asc" }
        })

    }


    useEffect(() => {
        getExpenses()
    }, [])


    const contextValue: TransactionContextProps = {
        categories,
        getCategories,
        expenses,
        getExpenses,
        addExpense,
        addCategories,
        editExpense,
        deleteExpense,
        filteredExpenses,
        updateFilteredExpenses,
        loading,
        updateLoading,
        isMobile,
        formatDateFromISO,
        editingId,
        selectExpenseToEdit,
        deleteDialogOpen,
        handleCancelModal,
        deleteTarget,
        defineDeleteTarget,
        sortCriteria,
        defineSortCriteria
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
