import { useTransaction } from '@/app/hooks/useTransactions';
import { TransactionType } from '@/app/types/interfaces';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, FormControl, MenuItem, Select, TableCell, TableRow, TextField } from '@mui/material';
import { Expense } from '@prisma/client';
import { useEffect, useState } from 'react';

interface TransactionProps {
    expense: Expense

}

export const TransactionRow = ({ expense }: TransactionProps) => {
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState<TransactionType | "">(TransactionType.Expense);

    const { expenses, editingId, selectExpenseToEdit, formatDateFromISO, categories, defineDeleteTarget, editExpense, handleCancelModal } = useTransaction()

    const handleEdit = () => {
        const mapTypeToTransactionType = (type: string): TransactionType => {
            return type === "expense" ? TransactionType.Expense : TransactionType.Income;
        };


        const expenseUpdate = {
            ...expense,
            description,
            category,
            amount: parseFloat(amount),
            date,
            type: mapTypeToTransactionType(type as string), // Map type correctly
        };



        editExpense(expenseUpdate); // Ensure this updates the correct record

        selectExpenseToEdit(null); // Exit edit mode
    };



    const handleDel = () => {
        //* abrir a modal e definir no estado qual transacao que vai ser deletada, no modal delete vai ser chamada a fn para deletar
        defineDeleteTarget({ id: +expense.id, description: expense.description })
        handleCancelModal(true);
    }

    useEffect(() => {
        if (editingId) {
            const expenseToEdit = expenses?.find(exp => exp.id === editingId);
            if (expenseToEdit) {
                setDescription(expenseToEdit.description);
                setCategory(expenseToEdit.category);
                setAmount(expenseToEdit.amount.toString());

                // Ajustar o formato da data para YYYY-MM-DD
                const formattedDate = new Date(expenseToEdit.date).toISOString().split('T')[0];

                setDate(formattedDate);

                setType(expenseToEdit.type);
            }
        }

    }, [editingId, expenses]);

    return (
        <TableRow key={expense.id}>
            <TableCell>
                {editingId === expense.id ? (
                    <TextField
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        size="small"
                    />
                ) : (
                    expense.description
                )}
            </TableCell>
            <TableCell>
                {editingId === expense.id ? (
                    <FormControl fullWidth>
                        <Select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            fullWidth
                            size="small"
                        >
                            {categories.map(({ id, name }) => (
                                <MenuItem key={id} value={name}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ) : (
                    expense.category
                )}
            </TableCell>
            <TableCell
                style={{
                    color: expense.type === TransactionType.Expense ? 'red' : 'green',
                }}
            >
                {editingId === expense.id ? (
                    <TextField
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        fullWidth
                        size="small"
                    />
                ) : (
                    <>
                        {expense.type === TransactionType.Expense ? '-' : '+'}
                        Gs. ${Number(expense.amount).toLocaleString('es-PY', { minimumFractionDigits: 0 })}
                    </>
                )}
            </TableCell>
            <TableCell>
                {editingId === expense.id ? (
                    <TextField
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        fullWidth
                        size="small"
                    />
                ) : (
                    formatDateFromISO(expense.date) // Use the helper function to format the date
                )}
            </TableCell>
            <TableCell>
                {editingId === expense.id ? (
                    <FormControl fullWidth>
                        <Select
                            value={type}
                            onChange={(e) => setType(e.target.value as TransactionType)}
                            fullWidth
                            size="small"
                        >
                            {Object.values(TransactionType).map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type === TransactionType.Expense ? "Saída" : "Entrada"}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ) : (
                    <>
                        {expense.type === TransactionType.Expense ? "Saída" : "Entrada"}
                    </>
                )}

            </TableCell>

            <TableCell>
                {editingId === expense.id ? (
                    <Button
                        onClick={handleEdit}
                        color="primary"
                    >
                        Salvar
                    </Button>
                ) : (
                    <Button aria-label="edit" onClick={() => selectExpenseToEdit(expense.id)} color="primary">
                        <EditIcon />
                    </Button>
                )}
            </TableCell>
            <TableCell>
                <Button aria-label="delete" color="error" onClick={() => handleDel(expense)}>
                    <DeleteIcon />
                </Button>
            </TableCell>
        </TableRow>
    )
}


