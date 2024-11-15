import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Alert, Box, Button, FormControl, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useTransaction } from "../../hooks/useTransactions";
import { Expense, TransactionType } from "../../types/interfaces";
import { ModalDeleteTransaction } from '../ModalDeleteTransaction';


export const TransactionsTable = () => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState<TransactionType | "">(TransactionType.Expense);
    const [sortedExpenses, setSortedExpenses] = useState<Expense[]>([])
    const [sortCriteria, setSortCriteria] = useState<{ column: string; direction: "asc" | "desc" }[]>([
        { column: 'description', direction: 'asc' }, // Defina a coluna padrão aqui
    ]);

    const { isMobile, expenses, getExpenses, categories, filteredExpenses } = useTransaction()


    const handleEditSubmit = async (id: string) => {
        const updatedExpense = { id, description, category, amount: parseFloat(amount), date, type };

        try {
            const res = await fetch(`/api/expenses/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedExpense),
            });

            if (res.ok) {
                getExpenses()
                setEditingId(null);
            }

        } catch (error) {
            console.log("🚀 ~ handleEditSubmit ~ error:", error)

        }
    };

    const handleDelete = async () => {
        if (deleteTarget) {
            const res = await fetch(`/api/expenses/${deleteTarget.id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                getExpenses()
                setDeleteTarget(null);
                setDeleteDialogOpen(false);
            }
        }
    };

    const handleSort = (column: string) => {
        setSortCriteria((prev) => {
            const existing = prev.find((c) => c.column === column);

            // Se já estiver ordenando por essa coluna, apenas muda a direção
            if (existing) {
                return prev.map((c) =>
                    c.column === column ? { ...c, direction: existing.direction === "asc" ? "desc" : "asc" } : c
                );
            }

            // Se for uma nova coluna, adiciona ao array de critérios
            return [...prev, { column, direction: "asc" }];
        });
    };

    const formatDateFromISO = (isoString) => {
        const regex = /^(\d{4})-(\d{2})-(\d{2})/; // Regex to capture year, month, day
        const match = isoString.match(regex);

        if (match) {
            const [_, year, month, day] = match; // Destructure the match to get day, month, year
            return `${day}/${month}/${year}`; // Return in dd/MM/yyyy format
        }

        return isoString; // Fallback if the string doesn't match
    };

    const getArrow = (column: string) => {
        const criteria = sortCriteria.find((c) => c.column === column);
        if (!criteria) return null;

        return criteria.direction === "asc" ? (
            <ArrowUpwardIcon sx={{ color: 'white' }} />
        ) : (
            <ArrowDownwardIcon sx={{ color: 'white' }} />
        );
    };


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

    }, [editingId, expenses, filteredExpenses]);


    useEffect(() => {
        setSortedExpenses(() => filteredExpenses.sort((a, b) => {
            for (const criteria of sortCriteria) {
                const { column, direction } = criteria;
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
            }

            // Se todas as colunas foram iguais, mantém a ordem original
            return 0;
        }))
    }, [filteredExpenses, sortCriteria])



    return (
        <>
            {
                sortedExpenses?.length === 0 ?
                    (
                        <Box style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <Alert
                                icon={false}
                                severity="warning"
                                sx={{ width: isMobile ? '90%' : '60%', height: 'auto' }}
                            >
                                Nenhum registro encontrado.
                            </Alert>
                        </Box>
                    ) :
                    (

                        <TableContainer component={Paper}>
                            {/* resumo total */}

                            {
                                isMobile ?
                                    (// Mobile view with card style
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {sortedExpenses?.map((expense) => (
                                                <Paper key={expense.id} style={{ padding: '1rem', position: 'relative', border: '1px solid #ddd' }}>
                                                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.25rem' }}>
                                                        <Button sx={{ minWidth: '5px' }} aria-label="edit" onClick={() => setEditingId(expense.id)} color="primary">
                                                            <EditIcon />
                                                        </Button>
                                                        <Button sx={{ minWidth: '5px' }} aria-label="delete" color="error" onClick={() => { setDeleteTarget(expense); setDeleteDialogOpen(true); }}>
                                                            <DeleteIcon />
                                                        </Button>
                                                    </div>
                                                    <div>
                                                        <div style={{
                                                            clear: 'both',
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            width: '200px'
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
                                    ) :
                                    (<Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell
                                                    style={{ backgroundColor: '#2196f3', color: 'white', fontWeight: '700', cursor: 'pointer' }}
                                                    onClick={() => handleSort('description')}
                                                >
                                                    Descrição {getArrow('description')}
                                                </TableCell>
                                                <TableCell
                                                    style={{ backgroundColor: '#2196f3', color: 'white', fontWeight: '700', cursor: 'pointer' }}
                                                    onClick={() => handleSort('category')}
                                                >
                                                    Categoria {getArrow('category')}
                                                </TableCell>
                                                <TableCell
                                                    style={{ backgroundColor: '#2196f3', color: 'white', fontWeight: '700', cursor: 'pointer' }}
                                                    onClick={() => handleSort('amount')}
                                                >
                                                    Valor {getArrow('amount')}
                                                </TableCell>
                                                <TableCell
                                                    style={{ backgroundColor: '#2196f3', color: 'white', fontWeight: '700', cursor: 'pointer' }}
                                                    onClick={() => handleSort('date')}
                                                >
                                                    Data {getArrow('date')}
                                                </TableCell>
                                                <TableCell style={{ backgroundColor: '#2196f3', color: 'white', fontWeight: '700' }}>
                                                    Tipo
                                                </TableCell>
                                                <TableCell style={{ backgroundColor: '#2196f3', color: 'white', fontWeight: '700' }}>
                                                    Editar
                                                </TableCell>
                                                <TableCell style={{ backgroundColor: '#2196f3', color: 'white', fontWeight: '700' }}>
                                                    Remover
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {sortedExpenses?.map((expense) => (
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
                                                            <Button onClick={() => handleEditSubmit(expense.id)} color="primary">
                                                                Salvar
                                                            </Button>
                                                        ) : (
                                                            <Button aria-label="edit" onClick={() => setEditingId(expense.id)} color="primary">
                                                                <EditIcon />
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button aria-label="delete" color="error" onClick={() => { setDeleteTarget(expense); setDeleteDialogOpen(true); }}>
                                                            <DeleteIcon />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>)
                            }


                        </TableContainer>)
            }

            {/* Modal de confirmação de deleção */}
            <ModalDeleteTransaction
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                handleDelete={handleDelete}
                deleteTarget={deleteTarget as Expense}
            />

        </>
    )
}




