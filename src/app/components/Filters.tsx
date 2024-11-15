import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useTransaction } from "../hooks/useTransactions";
import { TransactionType } from "../types/interfaces";

export const Filters = () => {
    const [filterCategory, setFilterCategory] = useState('');
    const [filterDate, setFilterDate] = useState({ startDate: '', endDate: '' });
    const [filterDescription, setFilterDescription] = useState('');
    const [filterType, setFilterType] = useState<TransactionType | ''>('');

    const { categories, isMobile, expenses, updateFilteredExpenses } = useTransaction()

    const clearFilters = () => {
        setFilterCategory('');
        setFilterDate({ startDate: '', endDate: '' });
        setFilterType("");
        setFilterDescription('');
    };

    useEffect(() => {
        const filtered = expenses?.filter((expense) => {
            const matchesCategory = filterCategory ? expense.category === filterCategory : true;
            const matchesType = filterType ? expense.type === filterType : true;
            const matchesDescription = filterDescription ? expense.description.toLowerCase().includes(filterDescription.toLowerCase()) : true;

            // Matches date only if both start and end dates are filled
            const matchesDate = filterDate.startDate && filterDate.endDate
                ? new Date(expense.date) >= new Date(filterDate.startDate) && new Date(expense.date) <= new Date(filterDate.endDate)
                : true;

            return matchesCategory && matchesType && matchesDescription && matchesDate;
        }) ?? [];

        updateFilteredExpenses(filtered);
    }, [filterCategory, filterType, filterDescription, filterDate, expenses]);

    return (
        <Box
            sx={{
                width: '80%',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row', // Filtros em coluna no mobile
                gap: 2,
                paddingY: isMobile ? '15px' : '30px'
            }}
        >
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
                    {categories && categories.map(({ id, name }) => (
                        <MenuItem key={id} value={name}>
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Start Date */}
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

            {/* End Date */}
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

            {/* Filtro por Tipo */}
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
    )
}