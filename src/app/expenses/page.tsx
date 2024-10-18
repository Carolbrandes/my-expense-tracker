'use client';

import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PaidIcon from '@mui/icons-material/Paid';

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
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { useEffect, useState } from 'react';

enum TransactionType {
    Income = 'income',
    Expense = 'expense',
}

interface Expense {
    id: string;
    description: string;
    category: string;
    amount: number;
    date: string;
    type: TransactionType;
};

const GrayButton = styled(Button)({
    backgroundColor: '#92A0A7', // Cor cinza
    color: 'white', // Cor do texto
    '&:hover': {
        backgroundColor: '#90A4AE', // Cor ao passar o mouse
    },
});



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
    const [totalIncome, setTotalIncome] = useState(0)
    const [totalExpense, setTotalExpense] = useState(0)
    const [balance, setBalance] = useState(0) //saldo
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]); // Para os filtros
    const [filterCategory, setFilterCategory] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterType, setFilterType] = useState<TransactionType | ''>('');
    const [filterDescription, setFilterDescription] = useState('');
    const [loading, setLoading] = useState(true); // Inicialmente está carregando
    const [sortCriteria, setSortCriteria] = useState<{ column: string; direction: "asc" | "desc" }[]>([
        { column: 'description', direction: 'asc' }, // Defina a coluna padrão aqui
    ]);


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

    const calculateTotals = (transactions: Expense[]) => {
        const totalIncome = transactions
            .filter(transaction => transaction.type === TransactionType.Income)
            .reduce((acc, transaction) => acc + transaction.amount, 0);

        const totalExpense = transactions
            .filter(transaction => transaction.type === TransactionType.Expense)
            .reduce((acc, transaction) => acc + transaction.amount, 0);

        const balance = totalIncome - totalExpense;

        return { totalIncome, totalExpense, balance };
    };

    // Função para limpar todos os filtros
    const clearFilters = () => {
        setFilterCategory('');
        setFilterDate('');
        setFilterType("");
        setFilterDescription('');
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

    const sortedExpenses = filteredExpenses.sort((a, b) => {
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
    });

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
            } finally {
                setLoading(false)
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Filtragem
        const filtered = expenses.filter((expense) => {
            const matchesCategory = filterCategory ? expense.category === filterCategory : true;
            const matchesType = filterType ? expense.type === filterType : true;
            const matchesDescription = filterDescription ? expense.description.toLowerCase().includes(filterDescription.toLowerCase()) : true;
            const matchesDate = filterDate ? new Date(expense.date).toISOString().split('T')[0] === filterDate : true;

            return matchesCategory && matchesType && matchesDescription && matchesDate;
        });

        setFilteredExpenses(filtered);
    }, [filterCategory, filterType, filterDescription, filterDate, expenses]);

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

        const { totalIncome, totalExpense, balance } = calculateTotals(filteredExpenses);
        setTotalIncome(totalIncome)
        setTotalExpense(totalExpense)
        setBalance(balance)

    }, [editingId, expenses, filteredExpenses]);

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
                <GrayButton variant="contained" onClick={() => setOpenCategoryModal(true)} sx={{ marginRight: '20px' }}>
                    Adicionar Categoria
                </GrayButton>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setDescription('');
                        setCategory('');
                        setAmount('');
                        setDate('');
                        setType(TransactionType.Income);
                        setOpenModal(true)
                    }}
                    sx={{ marginRight: '20px' }}>
                    Nova Transação
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
                <h2 >Relatório de Transações</h2>
            </Box>

            <Box sx={{ width: '80%', display: 'flex', gap: 2, paddingY: '30px' }}>
                {/* Filtro por Descrição */}
                <TextField
                    label="Descrição"
                    value={filterDescription}
                    onChange={(e) => setFilterDescription(e.target.value)}
                    fullWidth
                    size="small"
                />

                {/* Filtro por Categoria */}
                <FormControl fullWidth size="small">
                    <InputLabel>Categoria</InputLabel>
                    <Select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <MenuItem value="">Todas</MenuItem>
                        {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                                {cat}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Filtro por Data */}
                <TextField
                    label="Data"
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    size="small"
                />

                {/* Filtro por Tipo */}
                <FormControl fullWidth size="small">
                    <InputLabel>Tipo</InputLabel>
                    <Select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as TransactionType)}
                    >
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value={TransactionType.Income}>Entrada</MenuItem>
                        <MenuItem value={TransactionType.Expense}>Saída</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={clearFilters}
                    sx={{ minWidth: '160px' }}
                >
                    Limpar Filtros
                </Button>
            </Box>

            {
                loading ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Skeleton variant="text" width="80%" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" width="60%" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" width="40%" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" width="70%" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" width="50%" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" width="30%" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" width="30%" />
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* Esqueleto de linhas de tabela */}
                                {[...Array(5)].map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Skeleton variant="text" width="80%" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="text" width="60%" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="text" width="40%" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="text" width="70%" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="text" width="50%" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="text" width="30%" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton variant="text" width="30%" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (filteredExpenses.length === 0 ? (<Box style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Alert
                        icon={false}
                        severity="warning"
                        sx={{ width: '60%', height: 'auto' }}
                    >
                        Nenhum registro encontrado.
                    </Alert>
                </Box>) : (<TableContainer component={Paper}>
                    <Box sx={{ display: "flex", alignItems: "center", paddingY: '30px' }}>
                        <ArrowCircleUpIcon color="success" sx={{ marginLeft: '10px', marginRight: '5px' }} /> Total Entradas: Gs. {Number(totalIncome).toLocaleString('es-PY', { minimumFractionDigits: 0 })}  |
                        <ArrowCircleDownIcon color="error" sx={{ marginLeft: '10px', marginRight: '5px' }} />   Total Saídas: Gs. {Number(totalExpense).toLocaleString('es-PY', { minimumFractionDigits: 0 })} |
                        <PaidIcon color='primary' sx={{ marginLeft: '10px', marginRight: '5px' }} />  Saldo: Gs. {Number(balance).toLocaleString('es-PY', { minimumFractionDigits: 0 })}
                    </Box>
                    <Table>
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
                            {sortedExpenses.map((expense) => (
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
                    </Table>
                </TableContainer>))
            }




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