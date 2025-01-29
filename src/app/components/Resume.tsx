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

    const { isMobile, expenses } = useTransaction()


    const calculateTotals = (transactions: Expense[]) => {
        const totalIncome = transactions
            ?.filter(transaction => transaction.type === TransactionType.Income)
            ?.reduce((acc, transaction) => acc + transaction.amount, 0);

        const totalExpense = transactions
            ?.filter(transaction => transaction.type === TransactionType.Expense)
            ?.reduce((acc, transaction) => acc + transaction.amount, 0);

        const balance = totalIncome - totalExpense;

        return { totalIncome, totalExpense, balance };
    };


    useEffect(() => {
        if (expenses?.data) {
            const { totalIncome, totalExpense, balance } = calculateTotals(expenses?.data as Expense[]);
            setTotalIncome(totalIncome)
            setTotalExpense(totalExpense)
            setBalance(balance)
        }
    }, [expenses])

    return (
        <Box
            sx={{
                width: { xs: '100%', md: '49%' },
                display: "flex",
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: { xs: 'center', md: 'flex-start' },
                alignItems: "center",
                gap: { xs: '0.75rem', md: 0 },
                paddingY: '30px',
                fontSize: { xs: '0.75rem', md: '1rem' }
            }}
        >
            <Box sx={{ width: { xs: '100%', md: 'auto' }, display: 'flex', alignItems: 'center' }}>
                <ArrowCircleUpIcon color="success" sx={{ marginLeft: '10px', marginRight: '5px' }} />
                {!isMobile && "Total Entradas:"}
                <span style={{ marginRight: !isMobile ? '10px' : 0 }}>
                    Gs. {Number(totalIncome).toLocaleString('es-PY', { minimumFractionDigits: 0 })}
                </span>
                {!isMobile && "|"}
            </Box>

            <Box sx={{ width: { xs: '100%', md: 'auto' }, display: 'flex', alignItems: 'center' }}>
                <ArrowCircleDownIcon color="error" sx={{ marginLeft: '10px', marginRight: '5px' }} />
                {!isMobile && "Total Saídas:"}
                <span style={{ marginRight: !isMobile ? '10px' : 0 }}>
                    Gs. {Number(totalExpense).toLocaleString('es-PY', { minimumFractionDigits: 0 })}
                </span>
                {!isMobile && "|"}
            </Box>

            <Box sx={{ width: { xs: '100%', md: 'auto' }, display: 'flex', alignItems: 'center' }}>
                <PaidIcon color='primary' sx={{ marginLeft: '10px', marginRight: '5px' }} />
                {!isMobile && "Saldo:"}
                Gs. {Number(balance).toLocaleString('es-PY', { minimumFractionDigits: 0 })}
            </Box>
        </Box>
    )
}


