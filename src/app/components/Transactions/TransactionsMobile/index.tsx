import { useExpensesQuery } from '@/app/hooks/useExpensesQuery';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Paper, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTransaction } from '../../../hooks/useTransactions';
import { Expense, TransactionType } from '../../../types/interfaces';
import { PaginationComponent } from "../PaginationComponent"; // Import the PaginationComponent
import { EditModal } from './EditModal';

export const TransactionsMobile = () => {
    const {
        formatDateFromISO,
        filteredExpenses,
        editingId,
        selectExpenseToEdit,
        page // Make sure you have `page` and related state from useTransaction
    } = useTransaction();
    const { updateExpense, removeExpense } = useExpensesQuery();
    const theme = useTheme();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formValues, setFormValues] = useState<Expense | null>(null);
    console.log("🚀 ~ TransactionsMobile ~ formValues:", formValues)

    useEffect(() => {
        if (editingId !== null) {
            const expenseToEdit = filteredExpenses.find(expense => expense.id === editingId);
            console.log('Editing Expense:', expenseToEdit); // Debug log
            setFormValues(expenseToEdit || null);
            setIsModalOpen(!!expenseToEdit);
        }
    }, [editingId, filteredExpenses]);

    const handleEdit = (expense: Expense) => {
        console.log('Editing ID:', expense.id); // Debug log
        selectExpenseToEdit(+expense.id);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        selectExpenseToEdit(null);
    };

    const handleDel = (expense: Expense) => {
        removeExpense(expense);
    };

    return (
        <div style={{ width: '95%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredExpenses?.map((expense) => (
                <Paper key={expense.id} style={{ width: '100%', padding: '1rem', position: 'relative', border: '1px solid #ddd' }}>
                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.25rem' }}>
                        <Button sx={{ minWidth: '5px' }} aria-label="edit" onClick={() => handleEdit(expense)} color="primary">
                            <EditIcon />
                        </Button>
                        <Button sx={{ minWidth: '5px' }} aria-label="delete" color="error" onClick={() => handleDel(expense)}>
                            <DeleteIcon />
                        </Button>
                    </div>
                    <div>
                        <div style={{
                            clear: 'both',
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: '95%'
                        }}><strong>Descrição:</strong> {expense.description}</div>
                        <div><strong>Categoria:</strong> {expense.category}</div>
                        <div>
                            <strong>Valor:</strong>
                            <span style={{ color: expense.type === TransactionType.Expense ? theme?.palette?.custom?.red : 'green' }}>
                                {expense.type === TransactionType.Expense ? '-' : '+'}
                                Gs. {Number(expense.amount).toLocaleString('es-PY', { minimumFractionDigits: 0 })}
                            </span>
                        </div>
                        <div><strong>Data:</strong> {formatDateFromISO(expense.date)}</div>
                        <div><strong>Tipo:</strong> {expense.type === TransactionType.Expense ? "Saída" : "Entrada"}</div>
                    </div>
                </Paper>
            ))}

            {editingId !== null && (
                <EditModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={(updatedExpense) => {
                        updateExpense(updatedExpense);
                        selectExpenseToEdit(null);  // Close the modal
                    }}
                    expense={filteredExpenses.find(expense => expense.id === editingId) || null}
                />
            )}

            {/* Add Pagination Component */}
            <PaginationComponent page={page} />
        </div>
    );
};