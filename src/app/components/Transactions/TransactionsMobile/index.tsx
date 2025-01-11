import { useExpensesQuery } from '@/app/hooks/useExpensesQuery';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Paper } from '@mui/material';
import { useTransaction } from '../../../hooks/useTransactions';
import { Expense, TransactionType } from '../../../types/interfaces';

export const TransactionsMobile = () => {
    const { formatDateFromISO, filteredExpenses } = useTransaction()
    const { updateExpense, removeExpense } = useExpensesQuery()

    const handleEdit = (expense: Expense) => {
        const newObj = {
            ...expense,
            date: String(expense.date),
            type: expense.type == "income" ? TransactionType.Income : TransactionType.Expense
        }

        updateExpense(newObj)
    }

    const handleDel = (expense: Expense) => {
        const newObj = {
            ...expense,
            date: String(expense.date),
            type: expense.type == "income" ? TransactionType.Income : TransactionType.Expense
        }

        removeExpense(newObj)
    }



    return (
        <div style={{ width: '95%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredExpenses?.map((expense) => (
                <Paper key={expense.id} style={{ width: '95%', padding: '1rem', position: 'relative', border: '1px solid #ddd' }}>
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
                        <div style={{ color: expense.type === TransactionType.Expense ? 'red' : 'green' }}>
                            <strong>Valor:</strong> {expense.type === TransactionType.Expense ? '-' : '+'} Gs. {Number(expense.amount).toLocaleString('es-PY', { minimumFractionDigits: 0 })}
                        </div>
                        <div><strong>Data:</strong> {formatDateFromISO(expense.date)}</div>
                        <div><strong>Tipo:</strong> {expense.type === TransactionType.Expense ? "Saída" : "Entrada"}</div>
                    </div>
                </Paper>
            ))}
        </div>
    )
}


