'use client';

import { fetchCurrencies } from '@/lib/fetchCurrencies';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import {
    Box,
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent,
    Skeleton,
    useTheme
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Filters } from '../components/Filters';
import { Header } from '../components/Header';
import { ModalNewCategory } from '../components/ModalNewCategory';
import { ModalNewTransaction } from '../components/ModalNewTransaction';
import { Resume } from '../components/Resume';
import { Toast } from '../components/Toast';
import { Transactions } from '../components/Transactions';
import { ModalDeleteTransaction } from '../components/Transactions/ModalDeleteTransaction';
import { useExpensesQuery } from '../hooks/useExpensesQuery';
import { useUserQuery } from '../hooks/useUserQuery';


const ExpensePage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const [toastMessage, setToastMessage] = useState("")
    const { isExpensesLoading } = useExpensesQuery()
    const { user, updateUser } = useUserQuery();
    const theme = useTheme();

    const { data: currencies = [], isLoading: isLoadingCurrencies } = useQuery({
        queryKey: ['currencies'],
        queryFn: fetchCurrencies,
        staleTime: Infinity,
    });


    const handleCurrencyChange = (event: SelectChangeEvent<string>) => {
        const acronym = event.target.value; // Get the selected acronym
        const selectedCurrency = currencies.find(currency => currency.acronym === acronym); // Find full currency object

        if (selectedCurrency) {
            updateUser({ ...user, currency: selectedCurrency });
        }
    };

    const handleCloseToastMessage = () => setToastMessage("")


    return (
        <>
            <Header
                handleOpenModalCategory={setOpenCategoryModal}
                handleOpenModalTransaction={setOpenModal}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '2rem', paddingTop: '1rem' }}>
                <FormControl size="small" variant="standard">
                    {isLoadingCurrencies ? (
                        <Skeleton variant="text" width="100%" height={40} />
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <AttachMoneyIcon fontSize="inherit" sx={{ color: theme.palette.primary.main }} />

                            <Select
                                id="currency-label"
                                value={user?.currency?.acronym || 'USD'}
                                onChange={handleCurrencyChange}
                                sx={{ fontSize: '0.8rem', color: theme.palette.primary.main, borderBottom: `0.5px solid ${theme.palette.primary.main}` }}
                            >
                                {currencies?.map((currency) => (
                                    <MenuItem key={currency.name} value={currency.acronym} >
                                        {currency.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                    )}
                </FormControl>
            </Box>

            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{ padding: '20px', spacing: 2, marginTop: '40px' }}
            >

                <ModalNewCategory openCategoryModal={openCategoryModal} setOpenCategoryModal={setOpenCategoryModal} />

                <ModalNewTransaction openModal={openModal} setOpenModal={setOpenModal} />


                <Box>
                    <h2 >Relatório de Transações</h2>
                </Box>

                <Filters />

                <Resume />

                {
                    isExpensesLoading ? (
                        <Skeleton />

                    ) : (
                        <Transactions />
                    )
                }


                <ModalDeleteTransaction />

                <Toast
                    open={!!toastMessage}
                    toastMessage={toastMessage}
                    handleCloseToastMessage={handleCloseToastMessage}
                />

            </Box>
        </>
    );
};

export default ExpensePage;