import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, FormControl, InputLabel, MenuItem, Paper, Select, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTransaction } from '../../../hooks/useTransactions';
import { TransactionType } from '../../../types/interfaces';
import { PaginationComponent } from "../PaginationComponent";
import { EditModal } from './EditModal';

export const TransactionsMobile = () => {
    const {
        expenses,
        formatDateFromISO,
        editingId,
        defineEditExpenseId,
        updateExpenseEdit,
        page,
        defineDeleteTarget,
        toggleCancelModal,
        isMobile,
        appliedFilters,
        onApplyFilters
    } = useTransaction();


    const theme = useTheme();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderBy, setOrderBy] = useState("newest")

    useEffect(() => {
        if (editingId !== null) {
            const expenseToEdit = expenses?.data?.find(expense => expense.id === editingId);
            setIsModalOpen(!!expenseToEdit);
        }
    }, [editingId, expenses]);


    useEffect(() => {
        switch (orderBy) {
            case 'highestValue':
                onApplyFilters({ ...appliedFilters, sortBy: 'amount', sortOrder: 'desc' })
                break;

            case 'lowestValue':
                onApplyFilters({ ...appliedFilters, sortBy: 'amount', sortOrder: 'asc' })
                break;

            case 'oldest':
                onApplyFilters({ ...appliedFilters, sortBy: 'date', sortOrder: 'asc' })
                break;

            case 'newest':
                onApplyFilters({ ...appliedFilters, sortBy: 'date', sortOrder: 'desc' })
                break;


            default:
                break;
        }
    }, [orderBy])

    const handleDel = (expenseToDelete) => {
        if (expenseToDelete) {
            defineDeleteTarget({ id: +expenseToDelete.id, description: expenseToDelete.description })
            toggleCancelModal(true);
        }
    }

    return (
        <div style={{ width: '95%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            <FormControl
                fullWidth={isMobile}
                size="small"
                variant="standard"
                sx={{
                    flex: isMobile ? '1 1 100%' : '1 1 auto',
                    minWidth: isMobile ? '100%' : '200px',
                }}
            >
                <InputLabel id="orderBy">Ordenar por</InputLabel>
                <Select
                    labelId="orderBy"
                    value={orderBy}
                    defaultValue='newest'
                    onChange={(e) => setOrderBy(e.target.value)}
                >
                    <MenuItem value="highestValue">Maior valor</MenuItem>
                    <MenuItem value="lowestValue">Menor valor</MenuItem>
                    <MenuItem value="oldest">Mais antigo</MenuItem>
                    <MenuItem value="newest">Mais recente</MenuItem>

                </Select>
            </FormControl>

            {expenses?.data?.map((expense) => (
                <Paper key={expense.id} style={{ width: '100%', padding: '1rem', position: 'relative', border: '1px solid #ddd' }}>
                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.25rem' }}>
                        <Button sx={{ minWidth: '5px' }} aria-label="edit" onClick={() => defineEditExpenseId(+expense.id)} color="primary">
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
                            <span style={{ color: expense.type === TransactionType.Expense ? theme?.palette?.custom?.red : theme?.palette?.custom?.green }}>
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
                    onClose={() => setIsModalOpen(false)}
                    onSave={(updatedExpense) => updateExpenseEdit(updatedExpense)}
                    expense={expenses?.data.find(expense => expense.id === editingId) || null}
                />
            )}


            <PaginationComponent page={page} />
        </div>
    );
};