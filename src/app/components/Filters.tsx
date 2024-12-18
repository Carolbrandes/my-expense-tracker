import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useCategoriesQuery } from "../hooks/useCategoriesQuery";
import { useExpensesQuery } from "../hooks/useExpensesQuery";
import { useTransaction } from "../hooks/useTransactions";
import { TransactionType } from "../types/interfaces";

export const Filters = () => {
    const [filterCategory, setFilterCategory] = useState('');
    const [filterDate, setFilterDate] = useState({ startDate: '', endDate: '' });
    const [filterDescription, setFilterDescription] = useState('');
    const [filterType, setFilterType] = useState<TransactionType | ''>('');

    const { isMobile, updateFilteredExpenses } = useTransaction();
    const { categories } = useCategoriesQuery();

    const filters = useMemo(() => ({
        description: filterDescription || undefined,
        category: filterCategory || undefined,
        type: filterType || undefined,
        startDate: filterDate.startDate || undefined,
        endDate: filterDate.endDate || undefined,
    }), [filterDescription, filterCategory, filterType, filterDate]);

    const { expenses } = useExpensesQuery(filters);

    useEffect(() => {
        if (expenses) {
            updateFilteredExpenses(expenses);
        }
    }, [expenses, updateFilteredExpenses]);

    const clearFilters = () => {
        setFilterCategory('');
        setFilterDate({ startDate: '', endDate: '' });
        setFilterType("");
        setFilterDescription('');
    };

    const safeCategories = Array.isArray(categories) ? categories : [];

    return (
        <Box
            sx={{
                width: '80%',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 2,
                paddingY: isMobile ? '15px' : '30px'
            }}
        >
            <TextField
                label="Descrição"
                value={filterDescription}
                onChange={(e) => setFilterDescription(e.target.value)}
                fullWidth
                size="small"
            />
            <FormControl fullWidth size="small">
                <InputLabel>Categoria</InputLabel>
                <Select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <MenuItem value="">Todas</MenuItem>
                    {safeCategories.map(({ id, name }) => (
                        <MenuItem key={id} value={name}>
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                label="Start Date"
                type="date"
                value={filterDate.startDate}
                onChange={(e) => setFilterDate((prev) => ({ ...prev, startDate: e.target.value }))}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                size="small"
            />
            <TextField
                label="End Date"
                type="date"
                value={filterDate.endDate}
                onChange={(e) => setFilterDate((prev) => ({ ...prev, endDate: e.target.value }))}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                size="small"
            />
            <FormControl fullWidth size="small">
                <InputLabel>Tipo</InputLabel>
                <Select
                    value={filterType}
                    onChange={(e: SelectChangeEvent<TransactionType>) => setFilterType(e.target.value as "" | TransactionType)}
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
    );
};
