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
import { Expense, SortCriteria } from '../types/interfaces';
import { useExpensesQuery } from './useExpensesQuery';



interface TransactionProviderProps {
    readonly children: ReactNode
    userId: string | number | null
}

interface DeleteTargetProps {
    id: number
    description: string
}


interface TransactionContextProps {
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


export function TransactionProvider({ children }: TransactionProviderProps) {
    const { expenses } = useExpensesQuery(); // Get updated expenses from your query
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<DeleteTargetProps | null>(null);
    const [sortCriteria, setSortCriteria] = useState<SortCriteria>({
        column: 'description',
        direction: 'asc',
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const updateLoading = (isLoading: boolean) => setLoading(isLoading);

    const defineDeleteTarget = (dataDeleteTarget: DeleteTargetProps) =>
        setDeleteTarget(dataDeleteTarget);

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

            return direction === 'asc' ? comparison : -comparison;
        });

        setFilteredExpenses(expenseFilterAndSort);
    };

    const selectExpenseToEdit = (expenseSelectedId: number | null) =>
        setEditingId(expenseSelectedId);

    const formatDateFromISO = (isoString: string) => {
        const regex = /^(\d{4})-(\d{2})-(\d{2})/;
        const match = isoString.match(regex);

        if (match) {
            const [_, year, month, day] = match;
            return `${day}/${month}/${year}`;
        }

        return isoString;
    };

    const handleCancelModal = (isOpen: boolean) => setDeleteDialogOpen(isOpen);

    const defineSortCriteria = (column: string) => {
        setSortCriteria((prev) => {
            if (prev.column === column) {
                return { ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }

            return { column, direction: 'asc' };
        });
    };

    // Automatically update filteredExpenses whenever `expenses` changes
    useEffect(() => {
        console.log("🚀 ~ useTransactions filtered expenses:", expenses)
        if (expenses) {
            updateFilteredExpenses(expenses);
        }
    }, [expenses, sortCriteria]); // Recalculate if sort criteria changes

    const contextValue: TransactionContextProps = {
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
        defineSortCriteria,
    };

    return (
        <TransactionContext.Provider value={contextValue}>
            {children}
        </TransactionContext.Provider>
    );
}

export function useTransaction() {
    const context = useContext(TransactionContext)

    return context
}
