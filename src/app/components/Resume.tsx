import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import PaidIcon from '@mui/icons-material/Paid';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTransaction } from '../hooks/useTransactions';
import { Expense, TransactionType } from "../types/interfaces";

export const Resume = () => {
    const [totalIncome, setTotalIncome] = useState(0)
    const [totalExpense, setTotalExpense] = useState(0)
    const [balance, setBalance] = useState(0) //saldo

    const { isMobile, filteredExpenses } = useTransaction()

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


    useEffect(() => {
        const { totalIncome, totalExpense, balance } = calculateTotals(filteredExpenses);
        setTotalIncome(totalIncome)
        setTotalExpense(totalExpense)
        setBalance(balance)
    }, [filteredExpenses])

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: isMobile ? 'center' : 'flex-start',
                alignItems: "center",
                paddingY: '30px',
                fontSize: isMobile ? '0.75rem' : '1rem'  // 12px para mobile, 16px para desktop
            }}
        >
            <ArrowCircleUpIcon color="success" sx={{ marginLeft: '10px', marginRight: '5px' }} />
            {!isMobile && "Total Entradas:"} <span style={{ marginRight: !isMobile ? '10px' : 0 }}>Gs. {Number(totalIncome).toLocaleString('es-PY', { minimumFractionDigits: 0 })}</span>
            {!isMobile && "|"}
            <ArrowCircleDownIcon color="error" sx={{ marginLeft: '10px', marginRight: '5px' }} />
            {!isMobile && "Total Saídas:"} <span style={{ marginRight: !isMobile ? '10px' : 0 }}>Gs. {Number(totalExpense).toLocaleString('es-PY', { minimumFractionDigits: 0 })}</span>
            {!isMobile && "|"}
            <PaidIcon color='primary' sx={{ marginLeft: '10px', marginRight: '5px' }} />
            {!isMobile && "Saldo:"} Gs. {Number(balance).toLocaleString('es-PY', { minimumFractionDigits: 0 })}
        </Box>
    )
}


