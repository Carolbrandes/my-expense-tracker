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
import { ExpenseResponse, FilterProps } from '../types/interfaces';
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
    expenses: ExpenseResponse | undefined

    loading: boolean
    updateLoading: (isLoading: boolean) => void

    isMobile: boolean

    formatDateFromISO: (isoString) => string

    editingId: number | null
    defineEditExpenseId: (expenseSelectedId: number | null) => void
    updateExpenseEdit: (updatedExpense) => void

    deleteDialogOpen: boolean
    toggleCancelModal: (isOpen: boolean) => void
    deleteTarget: DeleteTargetProps | null
    defineDeleteTarget: (data: DeleteTargetProps) => void

    page: number
    updatePage: (page: number) => void
    pageSize: number
    totalPages: number

    appliedFilters: FilterProps
    onApplyFilters: (filters: FilterProps) => void

}

const TransactionContext = createContext<TransactionContextProps>(
    {} as TransactionContextProps
)


export function TransactionProvider({ children }: TransactionProviderProps) {
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<DeleteTargetProps | null>(null);
    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0)
    const [appliedFilters, setAppliedFilters] = useState({
        description: "",
        category: "",
        type: "",
        startDate: "",
        endDate: "",
        sortBy: "date",
        sortOrder: "desc"
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { expenses, updateExpense } = useExpensesQuery(page, pageSize, appliedFilters, true);


    const onApplyFilters = (filters: FilterProps) => {
        setAppliedFilters(filters);
    };

    const updatePage = (page: number) => setPage(page)

    const updateLoading = (isLoading: boolean) => setLoading(isLoading);

    const defineDeleteTarget = (dataDeleteTarget: DeleteTargetProps) =>
        setDeleteTarget(dataDeleteTarget);

    const defineEditExpenseId = (expenseSelectedId: number | null) =>
        setEditingId(expenseSelectedId);

    const updateExpenseEdit = (updatedExpense) => {
        updateExpense(updatedExpense);
        defineEditExpenseId(null);
    }

    const formatDateFromISO = (isoString: string) => {
        const regex = /^(\d{4})-(\d{2})-(\d{2})/;
        const match = isoString.match(regex);

        if (match) {
            const [_, year, month, day] = match;
            return `${day}/${month}/${year}`;
        }

        return isoString;
    };

    const toggleCancelModal = (isOpen: boolean) => setDeleteDialogOpen(isOpen);


    useEffect(() => {
        if (expenses?.meta?.totalPages) {
            setTotalPages(expenses.meta.totalPages);
        }
    }, [expenses, page]);



    const contextValue: TransactionContextProps = {
        expenses,
        appliedFilters,
        onApplyFilters,
        loading,
        updateLoading,
        isMobile,
        formatDateFromISO,
        editingId,
        defineEditExpenseId,
        updateExpenseEdit,
        deleteDialogOpen,
        toggleCancelModal,
        deleteTarget,
        defineDeleteTarget,
        page,
        updatePage,
        pageSize,
        totalPages,
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
