
import { TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTransaction } from '../../../hooks/useTransactions';
import { TransactionsTableCellHeader } from './TransactionsTableCellHeader';

export const TransactionsTableHeader = () => {
    const [sortBy, setSortBy] = useState("date")
    const [sortOrder, setSortOrder] = useState("desc")

    const { onApplyFilters, appliedFilters } = useTransaction()


    const tableHeaders = [
        { label: "Descrição", value: "description" },
        { label: "Categoria", value: "category" },
        { label: "Valor", value: "amount" },
        { label: "Data", value: "date" },
        { label: "Tipo", value: "type", sortable: false },
        { label: "Editar", value: "edit", sortable: false },
        { label: "Remover", value: "remove", sortable: false }
    ];

    const handleChangeSortOrder = () => setSortOrder(sortOrder === "asc" ? "desc" : "asc")


    useEffect(() => {
        onApplyFilters(
            {
                ...appliedFilters,
                sortBy,
                sortOrder
            })
    }, [sortBy, sortOrder])


    return (
        <TableHead>
            <TableRow>
                {tableHeaders.map(({ label, value, sortable = true }) => (
                    <TransactionsTableCellHeader
                        key={value}
                        label={label}
                        value={value}
                        sortOrder={sortOrder}
                        sortBy={sortBy}
                        clickFn={() => setSortBy(value)}
                        handleChangeSortOrder={handleChangeSortOrder}
                        sortable={sortable}
                    />
                ))}

            </TableRow>
        </TableHead>
    );
}


