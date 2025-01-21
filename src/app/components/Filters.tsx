import { Clear, Close, FilterList } from '@mui/icons-material';
import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    SelectChangeEvent,
    TextField
} from "@mui/material";
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
    const [open, setOpen] = useState(false); // State to handle modal open/close

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
        });
    }, [filterCategory, filterDate, filterType, filterDescription]);

    const clearFilters = () => {
        setFilterCategory('');
        setFilterDate({ startDate: '', endDate: '' });
        setFilterType("");
        setFilterDescription('');
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const safeCategories = Array.isArray(categories) ? categories : [];

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
                value={filterDescription}
                onChange={(e) => setFilterDescription(e.target.value)}
                fullWidth={isMobile}
                size="small"
                variant="standard"
                sx={{
                    flex: isMobile ? '1 1 100%' : '1 1 auto',
                }}
            />
            <TextField
                label="Data de Inicio"
                type="date"
                value={filterDate.startDate}
                onChange={(e) => setFilterDate((prev) => ({ ...prev, startDate: e.target.value }))}
                fullWidth={isMobile}
                InputLabelProps={{ shrink: true }}
                size="small"
                variant="standard"
                sx={{
                    flex: isMobile ? '1 1 100%' : '1 1 auto',
                }}
            />
            <TextField
                label="Data de Fim"
                type="date"
                value={filterDate.endDate}
                onChange={(e) => setFilterDate((prev) => ({ ...prev, endDate: e.target.value }))}
                fullWidth={isMobile}
                InputLabelProps={{ shrink: true }}
                size="small"
                variant="standard"
                sx={{
                    flex: isMobile ? '1 1 100%' : '1 1 auto',
                }}
            />

            <FormControl
                fullWidth={isMobile}
                size="small"
                variant="standard"
                sx={{
                    flex: isMobile ? '1 1 100%' : '1 1 auto',
                    minWidth: isMobile ? '100%' : '200px',
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
                fullWidth={isMobile}
                size="small"
                variant="standard"
                sx={{
                    flex: isMobile ? '1 1 100%' : '1 1 auto',
                    minWidth: isMobile ? '100%' : '150px',
                    maxWidth: '200px',
                }}
            >
                <InputLabel id="type-label">Tipo</InputLabel>
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

            {/* Botão de Limpar Filtros */}
            {!isMobile && (
                <Button
                    variant="outlined"
                    onClick={clearFilters}
                    sx={{
                        minWidth: '160px',
                        color: (theme) => theme.palette.text.primary,
                        borderColor: (theme) => theme.palette.text.primary,
                        flex: '0 0 auto',
                    }}
                >
                    Limpar Filtros
                </Button>
            )}
        </Box>
    );

    return (
        <>
            {isMobile ? (
                <>
                    {(filterCategory || filterDate.startDate || filterDate.endDate || filterType || filterDescription) && (
                        <IconButton
                            color="secondary"
                            onClick={clearFilters}
                            sx={{
                                position: 'fixed',
                                zIndex: 1,
                                bottom: 16,
                                right: 16,
                                backgroundColor: theme.palette.secondary.main,
                                color: theme.palette.common.white,
                                '&:hover': {
                                    backgroundColor: theme.palette.secondary.dark
                                },
                                borderRadius: '50%',
                            }}
                        >
                            <Clear />
                        </IconButton>
                    )}

                    {/* Filter Button (Fixed on mobile) */}
                    <IconButton
                        color="primary"
                        onClick={handleOpen}
                        sx={{
                            position: 'fixed',
                            zIndex: 1,
                            bottom: 62,
                            right: 16,
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.common.white,
                            '&:hover': {
                                backgroundColor: theme.palette.primary.dark
                            },
                            borderRadius: '50%',
                        }}
                    >
                        <FilterList />
                    </IconButton>

                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="filter-modal"
                        aria-describedby="filter-modal-description"
                    >
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
                            {/* Close Button at Top-Right */}
                            <IconButton
                                onClick={handleClose}
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    color: theme.palette.text.primary
                                }}
                            >
                                <Close />
                            </IconButton>

                            {filterContent}

                            {/* Aplicar Button */}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleClose}
                                fullWidth
                                sx={{ mt: 3 }}
                            >
                                Aplicar
                            </Button>
                        </Box>
                    </Modal>
                </>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <Box
                        sx={{
                            width: '80%',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 2,
                            paddingY: '30px',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {filterContent}
                    </Box>
                </Box>
            )}
        </>
    );
};