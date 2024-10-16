'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from '@mui/material';
import { useEffect, useState } from 'react';

enum TransactionType {
    Income = 'income',
    Expense = 'expense',
}

type Expense = {
    id: string;
    description: string;
    category: string;
    amount: number;
    date: string;
    type: TransactionType;
};

const ExpensePage = () => {
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState<TransactionType>(TransactionType.Income);
    const [categories, setCategories] = useState<string[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [openModal, setOpenModal] = useState(false); // Modal para adicionar despesa
    const [openCategoryModal, setOpenCategoryModal] = useState(false); // Modal para adicionar categoria
    const [newCategory, setNewCategory] = useState(''); // Para o input da nova categoria
    const [categoryError, setCategoryError] = useState<string | null>(null); // Para erros de categoria duplicada
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/expenses');
                const data: Expense[] = await res.json();
                console.log("🚀 ~ fetchData ~ data:", data)

                setExpenses(data);

                const uniqueCategories = Array.from(new Set(data.map((item) => item.category)));
                setCategories(uniqueCategories);
            } catch (error) {
                console.error('Erro ao buscar as despesas:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (editingId) {
            const expenseToEdit = expenses.find(exp => exp.id === editingId);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newExpense: Expense = {
            id: Date.now().toString(),
            description,
            category,
            // Remove separadores de milhar e converte para número
            amount: parseFloat(amount.replace(/\./g, '')), // remove os pontos
            date,
            type,
        };

        const res = await fetch('/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newExpense),
        });

        if (res.ok) {
            const savedExpense = await res.json();
            setExpenses([...expenses, savedExpense]);
            setDescription('');
            setCategory('');
            setAmount('');
            setDate('');
            setType(TransactionType.Income);
            setOpenModal(false);
        }
    };

    // Função para salvar a nova categoria com validação de duplicação
    const handleCategorySubmit = async () => {
        if (!newCategory.trim()) return;

        const categoryToSave = newCategory.toLowerCase();

        // Valida se a categoria já existe
        if (categories.includes(categoryToSave)) {
            setCategoryError('Essa categoria já existe.');
            return;
        }

        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: categoryToSave }),
            });

            if (res.ok) {
                setCategories([...categories, categoryToSave]);
                setNewCategory(''); // Limpa o campo
                setCategoryError(null); // Remove a mensagem de erro
                setOpenCategoryModal(false); // Fecha a modal
            }
        } catch (error) {
            console.error('Erro ao salvar a categoria:', error);
        }
    };


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
                const updatedList = expenses.map((exp) => (exp.id === id ? updatedExpense : exp));
                setExpenses(updatedList);
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
                setExpenses(expenses.filter((exp) => exp.id !== deleteTarget.id));
                setDeleteTarget(null);
                setDeleteDialogOpen(false);
            }
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ padding: '20px', spacing: 2 }}
        >
            {/* Botões para abrir as modais */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 2 }}>
                <Button variant="contained" color="secondary" onClick={() => setOpenCategoryModal(true)} sx={{ marginRight: '20px' }}>
                    Adicionar Categoria
                </Button>
                <Button variant="contained" color="primary" onClick={() => setOpenModal(true)} sx={{ marginRight: '20px' }}>
                    Adicionar Registro
                </Button>
            </Box>

            {/* Modal para adicionar nova categoria */}
            <Dialog open={openCategoryModal} onClose={() => setOpenCategoryModal(false)}>
                <DialogTitle>Adicionar Nova Categoria</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nova Categoria"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                        error={!!categoryError} // Mostra o erro se houver
                        helperText={categoryError || ''}
                    />
                    {/* Exibe a lista de categorias existentes */}
                    <Box mt={2}>
                        <h4>Categorias Existentes</h4>
                        {categories.length > 0 ? (
                            <ul>
                                {categories.map((cat, index) => (
                                    <li key={index}>{cat}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>Nenhuma categoria cadastrada.</p>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCategoryModal(false)} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={handleCategorySubmit} color="primary">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal para adicionar novo registro */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>Cadastrar Entradas ou Despesas</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
                        <TextField
                            label="Descrição"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Categoria</InputLabel>
                            <Select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat} value={cat}>
                                        {cat}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Valor"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Data"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Tipo</InputLabel>
                            <Select
                                value={type}
                                onChange={(e) => setType(e.target.value as TransactionType)}
                                required
                            >
                                <MenuItem value={TransactionType.Income}>Entrada</MenuItem>
                                <MenuItem value={TransactionType.Expense}>Saída</MenuItem>
                            </Select>
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>

            <Box sx={{ mb: 4 }}>
                <h2 >Registro de entradas e saídas</h2>
            </Box>
            {expenses.length === 0 ? (
                <Box style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Alert
                        icon={false}
                        severity="warning"
                        sx={{ width: '60%', height: 'auto' }}
                    >
                        Nenhum registro encontrado.
                    </Alert>
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ backgroundColor: '#2196f3', color: 'white', fontWeight: '700' }}>
                                    Descrição
                                </TableCell>
                                <TableCell style={{ backgroundColor: '#2196f3', color: 'white', fontWeight: '700' }}>
                                    Categoria
                                </TableCell>
                                <TableCell style={{ backgroundColor: '#2196f3', color: 'white', fontWeight: '700' }}>
                                    Valor
                                </TableCell>
                                <TableCell style={{ backgroundColor: '#2196f3', color: 'white', fontWeight: '700' }}>Data
                                </TableCell>
                                <TableCell style={{ backgroundColor: '#2196f3', color: 'white', fontWeight: '700' }}>
                                    Tipo
                                </TableCell>
                                <TableCell style={{ backgroundColor: '#2196f3', color: 'white', fontWeight: '700' }}>Editar
                                </TableCell>
                                <TableCell style={{ backgroundColor: '#2196f3', color: 'white', fontWeight: '700' }}>
                                    Remover
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {expenses.map((expense) => (
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
                                                    {categories.map((cat) => (
                                                        <MenuItem key={cat} value={cat}>
                                                            {cat}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        ) : (
                                            expense.category
                                        )}
                                    </TableCell>
                                    <TableCell style={{
                                        color: expense.type === TransactionType.Expense ? 'red' : 'green',
                                    }}>
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
                                                Gs. {Number(expense.amount).toLocaleString('es-PY', { minimumFractionDigits: 0 })}
                                            </>
                                        )
                                        }
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
                                            new Date(expense.date).toLocaleDateString('pt-BR')
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {expense.type === TransactionType.Expense ? "Saídas" : "Entradas"}
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
                    </Table>
                </TableContainer>
            )}

            {/* Modal de confirmação de deleção */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirmação</DialogTitle>
                <DialogContent>
                    Tem certeza que deseja excluir a despesa: {deleteTarget?.description}?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Deletar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ExpensePage;