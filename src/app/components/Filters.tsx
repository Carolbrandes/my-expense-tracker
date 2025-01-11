import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from "react";
import { useCategoriesQuery } from "../hooks/useCategoriesQuery";
import { useTransaction } from "../hooks/useTransactions";
import { TransactionType } from "../types/interfaces";

export const Filters = () => {
    const [filterCategory, setFilterCategory] = useState('');

    const [filterDate, setFilterDate] = useState({ startDate: '', endDate: '' });

    const [filterDescription, setFilterDescription] = useState('');

    const [filterType, setFilterType] = useState<TransactionType | ''>('');

    const { isMobile, updateFilters } = useTransaction();

    const { categories } = useCategoriesQuery();

    const theme = useTheme();

    useEffect(() => {
        updateFilters({
            category: filterCategory,
            type: filterType || "",
            description: filterDescription,
            startDate: filterDate.startDate,
            endDate: filterDate.endDate
        })

    }, [filterCategory, filterDate, filterType, filterDescription])

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
                gap: 5,
                paddingY: isMobile ? '15px' : '30px'
            }}
        >

            <TextField
                label="Descrição"
                value={filterDescription}
                onChange={(e) => setFilterDescription(e.target.value)}
                fullWidth
                size="small"
                id="standard-basic"
                variant="standard"
                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderColor: "inherit",
                    },
                    "& .MuiInputLabel-root": {
                        color: "inherit",
                    },
                }}
            />


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
                id="standard-basic"
                variant="standard"
                sx={{
                    '& input[type="date"]::-webkit-calendar-picker-indicator': {
                        filter: `invert(${theme.palette.text.primary})`,
                    },
                    '& input[type="date"]::-webkit-clear-button': {
                        display: 'none',
                    },
                }}
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
                id="standard-basic"
                variant="standard"
            />

            <FormControl
                fullWidth
                size="small"
                id="standard-basic"
                variant="standard"
                sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "inherit", // Styles the border
                    },
                    "& .MuiInputLabel-root": {
                        color: "inherit", // Styles the label text
                    },
                    "& .Mui-focused .MuiInputLabel-root": {
                        color: "primary.main", // Changes label color on focus
                    },
                }}
            >
                <InputLabel id="category-label">Categoria</InputLabel>
                <Select
                    labelId="category-label"
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

            <FormControl
                fullWidth
                size="small"
                id="standard-basic"
                variant="standard"
                sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "inherit", // Styles the border
                    },
                    "& .MuiInputLabel-root": {
                        color: "inherit", // Styles the label text
                    },
                    "& .Mui-focused .MuiInputLabel-root": {
                        color: "primary.main", // Changes label color on focus
                    },
                }}
            >
                <InputLabel id="type-label" >Tipo</InputLabel>
                <Select
                    labelId="type-label"
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
                sx={{
                    minWidth: '160px',
                    color: (theme) => theme.palette.text.primary,
                    borderColor: (theme) => theme.palette.text.primary
                }}
            >
                Limpar Filtros
            </Button>
        </Box>
    );
};
