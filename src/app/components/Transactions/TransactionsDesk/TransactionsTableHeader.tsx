import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { TableCell, TableHead, TableRow, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTransaction } from '../../../hooks/useTransactions';

export const TransactionsTableHeader = () => {
    const [sortBy, setSortBy] = useState("date")
    const [sortOrder, setSortOrder] = useState("desc")

    const { onApplyFilters, appliedFilters } = useTransaction()

    const getArrow = (column: string) => {
        const criteria = sortBy === column;
        if (!criteria) return null;

        return sortOrder === "asc" ? (
            <ArrowUpwardIcon sx={{ color: 'white' }} />
        ) : (
            <ArrowDownwardIcon sx={{ color: 'white' }} />
        );
    };

    const handleChangeSortOrder = () => setSortOrder(sortOrder === "asc" ? "desc" : "asc")



    useEffect(() => {
        onApplyFilters(
            {
                ...appliedFilters,
                sortBy,
                sortOrder
            })
    }, [sortBy, sortOrder])



    const theme = useTheme();

    return (
        <TableHead>
            <TableRow>
                <TableCell
                    style={{
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.text.secondary,
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '5px'
                    }}
                    onClick={() => setSortBy('description')}
                >
                    Descrição <button style={{ background: 'none', border: 'none', outline: 'none' }} onClick={handleChangeSortOrder}>{getArrow('description')}</button>
                </TableCell>
                <TableCell
                    style={{
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.text.secondary,
                        fontWeight: '700',
                        cursor: 'pointer',
                    }}
                    onClick={() => setSortBy('category')}
                >
                    Categoria <button style={{ background: 'none', border: 'none', outline: 'none' }} onClick={handleChangeSortOrder}>{getArrow('category')}</button>

                </TableCell>
                <TableCell
                    style={{
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.text.secondary,
                        fontWeight: '700',
                        cursor: 'pointer',
                    }}
                    onClick={() => setSortBy('amount')}
                >
                    Valor <button style={{ background: 'none', border: 'none', outline: 'none' }} onClick={handleChangeSortOrder}>{getArrow('amount')}</button>

                </TableCell>
                <TableCell
                    style={{
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.text.secondary,
                        fontWeight: '700',
                        cursor: 'pointer',
                    }}
                    onClick={() => setSortBy('date')}
                >
                    Data <button style={{ background: 'none', border: 'none', outline: 'none' }} onClick={handleChangeSortOrder}>{getArrow('date')}</button>

                </TableCell>
                <TableCell
                    style={{
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.text.secondary,
                        fontWeight: '700',
                    }}
                >
                    Tipo
                </TableCell>
                <TableCell
                    style={{
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.text.secondary,
                        fontWeight: '700',
                    }}
                >
                    Editar
                </TableCell>
                <TableCell
                    style={{
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.text.secondary,
                        fontWeight: '700',
                    }}
                >
                    Remover
                </TableCell>
            </TableRow>
        </TableHead>
    );
}


