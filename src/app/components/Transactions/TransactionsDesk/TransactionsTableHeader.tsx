import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { TableCell, TableHead, TableRow, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useTransaction } from '../../../hooks/useTransactions';

export const TransactionsTableHeader = () => {
    const { sortCriteria, defineSortCriteria, filteredExpenses, updateFilteredExpenses } = useTransaction()

    const getArrow = (column: string) => {
        const criteria = sortCriteria.column === column;
        if (!criteria) return null;

        return sortCriteria.direction === "asc" ? (
            <ArrowUpwardIcon sx={{ color: 'white' }} />
        ) : (
            <ArrowDownwardIcon sx={{ color: 'white' }} />
        );
    };

    useEffect(() => {
        updateFilteredExpenses(filteredExpenses)
    }, [filteredExpenses])



    const theme = useTheme(); // Access the theme

    return (
        <TableHead>
            <TableRow>
                <TableCell
                    style={{
                        backgroundColor: theme.palette.secondary.main, // Secondary color from theme
                        color: theme.palette.text.secondary,           // Font color from theme
                        fontWeight: '700',
                        cursor: 'pointer',
                    }}
                    onClick={() => defineSortCriteria('description')}
                >
                    Descrição {getArrow('description')}
                </TableCell>
                <TableCell
                    style={{
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.text.secondary,
                        fontWeight: '700',
                        cursor: 'pointer',
                    }}
                    onClick={() => defineSortCriteria('category')}
                >
                    Categoria {getArrow('category')}
                </TableCell>
                <TableCell
                    style={{
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.text.secondary,
                        fontWeight: '700',
                        cursor: 'pointer',
                    }}
                    onClick={() => defineSortCriteria('amount')}
                >
                    Valor {getArrow('amount')}
                </TableCell>
                <TableCell
                    style={{
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.text.secondary,
                        fontWeight: '700',
                        cursor: 'pointer',
                    }}
                    onClick={() => defineSortCriteria('date')}
                >
                    Data {getArrow('date')}
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


