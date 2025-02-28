import { Clear, Close, Delete, FilterList } from '@mui/icons-material';
import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    TextField
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useState } from "react";
import { useCategoriesQuery } from "../hooks/useCategoriesQuery";
import { useTransaction } from "../hooks/useTransactions";
import { FilterProps, TransactionType } from "../types/interfaces";

export const Filters = () => {
    const [localFilters, setLocalFilters] = useState<FilterProps>({
        description: "",
        category: "",
        type: "",
        startDate: "",
        endDate: "",
        sortBy: "",
        sortOrder: "desc"
    } as FilterProps)
    const [open, setOpen] = useState(false);

    const { isMobile, onApplyFilters } = useTransaction();
    const { categories } = useCategoriesQuery();


    const theme = useTheme();

    const clearFilters = () => {
        const resetFilters = {
            description: "",
            category: "",
            type: "",
            startDate: "",
            endDate: "",
            sortBy: "",
            sortOrder: "desc"
        };
        setLocalFilters(resetFilters);
        onApplyFilters(resetFilters);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleApplyFilters = () => {
        onApplyFilters(localFilters);
    };

    const safeCategories = Array.isArray(categories) ? categories : [];

    const isAnyFilterSet = Object.entries(localFilters).some(
        ([key, value]) => key !== "sortOrder" && value !== ""
    );

    const filterContent = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                flexWrap: 'wrap',
                gap: 3,
                justifyContent: 'center',
                alignItems: 'flex-end',
                paddingY: '30px',
            }}
        >
            {/* Inputs */}
            <TextField
                label="Descrição"
                value={localFilters.description}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, description: e.target.value }))}
                fullWidth={isMobile}
                size="small"
                variant="standard"
            />
            <TextField
                label="Data de Inicio"
                type="date"
                value={localFilters.startDate}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, startDate: e.target.value }))}
                fullWidth={isMobile}
                InputLabelProps={{ shrink: true }}
                size="small"
                variant="standard"
            />
            <TextField
                label="Data de Fim"
                type="date"
                value={localFilters.endDate}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, endDate: e.target.value }))}
                fullWidth={isMobile}
                InputLabelProps={{ shrink: true }}
                size="small"
                variant="standard"
            />

            <FormControl sx={{ minWidth: 180 }} size="small" variant="standard">
                <InputLabel id="category-label">Categoria</InputLabel>
                <Select
                    labelId="category-label"
                    value={localFilters.category}
                    onChange={(e) => setLocalFilters(prev => ({ ...prev, category: e.target.value }))}
                >
                    <MenuItem value="">Todas</MenuItem>
                    {safeCategories.map(({ id, name }) => (
                        <MenuItem key={id} value={name}>{name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }} size="small" variant="standard">
                <InputLabel id="type-label">Tipo</InputLabel>
                <Select
                    labelId="type-label"
                    value={localFilters.type}
                    onChange={(e) => setLocalFilters(prev => ({ ...prev, type: e.target.value as TransactionType }))}
                >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value={TransactionType.Income}>Entrada</MenuItem>
                    <MenuItem value={TransactionType.Expense}>Saída</MenuItem>
                </Select>
            </FormControl>


            {/* Buttons */}
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", width: "100%" }}>
                <Button
                    onClick={handleApplyFilters}
                    variant="contained"
                    sx={{
                        color: (theme) => theme.palette.text.secondary
                    }}
                >
                    Filtrar
                </Button>

                <Button
                    variant="outlined"
                    onClick={clearFilters}
                    startIcon={<Delete />}
                >
                    Limpar
                </Button>
            </Box>
        </Box>
    );

    return (
        <>
            {isMobile ? (
                <>
                    {isAnyFilterSet && (
                        <IconButton
                            color="secondary"
                            onClick={clearFilters}
                            sx={{
                                position: 'fixed',
                                bottom: 16,
                                right: 16,
                                backgroundColor: theme.palette.secondary.main,
                                color: theme.palette.common.white,
                                '&:hover': { backgroundColor: theme.palette.secondary.dark },
                                borderRadius: '50%',
                            }}
                        >
                            <Clear />
                        </IconButton>
                    )}

                    <IconButton
                        color="primary"
                        onClick={handleOpen}
                        sx={{
                            position: 'fixed',
                            bottom: 62,
                            right: 16,
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.common.white,
                            '&:hover': { backgroundColor: theme.palette.primary.dark },
                            borderRadius: '50%',
                        }}
                    >
                        <FilterList />
                    </IconButton>

                    <Modal open={open} onClose={handleClose}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '90%',
                                maxWidth: '400px',
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 4,
                                borderRadius: 2,
                            }}
                        >
                            <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
                                <Close />
                            </IconButton>

                            {filterContent}

                            <Button
                                onClick={() => {
                                    handleApplyFilters();
                                    handleClose();
                                }}
                                fullWidth
                                variant="contained"
                                color="primary"
                            >
                                Filtrar
                            </Button>
                        </Box>
                    </Modal>
                </>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Box sx={{ width: '80%', display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {filterContent}
                    </Box>
                </Box>
            )}
        </>
    );
};