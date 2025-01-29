import { useTransaction } from '@/app/hooks/useTransactions';
import { TransactionType } from '@/app/types/interfaces';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, FormControl, MenuItem, Select, TableCell, TableRow, TextField, useTheme } from '@mui/material';
import { Expense } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useCategoriesQuery } from '../../../hooks/useCategoriesQuery';

interface TransactionProps {
    expense: Expense

}

export const TransactionRow = ({ expense }: TransactionProps) => {
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState<TransactionType | "">(TransactionType.Expense);

    const { expenses, editingId, defineEditExpenseId, formatDateFromISO, defineDeleteTarget, toggleCancelModal, updateExpenseEdit } = useTransaction()
    const { categories } = useCategoriesQuery();
    const theme = useTheme();

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
            type: mapTypeToTransactionType(type as string),
        };

        updateExpenseEdit(expenseUpdate)
    };


    const handleDel = () => {
        defineDeleteTarget({ id: +expense.id, description: expense.description })
        toggleCancelModal(true);
    }

    useEffect(() => {

        if (editingId && expenses?.data?.length) {
            const expenseToEdit = expenses.data.find(exp => exp.id === editingId);
            if (expenseToEdit) {
                setDescription(expenseToEdit.description || '');
                setCategory(expenseToEdit.category || '');
                setAmount(expenseToEdit.amount?.toString() || '');
                setDate(new Date(expenseToEdit.date).toISOString().split('T')[0]);
                setType(expenseToEdit.type as TransactionType);
            }
        }
    }, [editingId, expenses]);

    return (
        <TableRow key={expense.id}>
            <TableCell>
                {editingId === expense.id ? (
                    <TextField
                        value={description || ""}
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
                            {categories && categories.map(({ id, name }) => (
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
                style={{ color: expense.type === TransactionType.Expense ? theme?.palette?.custom?.red : theme?.palette?.custom?.green }}>


                {editingId === expense.id ? (
                    <TextField
                        type="number"
                        value={amount || ''}
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
                    formatDateFromISO(expense.date)
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
                    <Button aria-label="edit" onClick={() => defineEditExpenseId(expense.id)} color="primary">
                        <EditIcon />
                    </Button>
                )}
            </TableCell>
            <TableCell>
                {
                    editingId === expense.id ?
                        <Button
                            onClick={() => defineEditExpenseId(null)}
                            sx={{
                                color: theme?.palette?.custom?.red,
                                cursor: "pointer"
                            }}>
                            Cancelar
                        </Button>
                        :
                        <Button
                            aria-label="delete"
                            sx={{
                                color: theme?.palette?.custom?.red,
                                cursor: "pointer"
                            }}
                            onClick={() => handleDel()}
                        >
                            <DeleteIcon />
                        </Button>
                }

            </TableCell>
        </TableRow>
    )
}


