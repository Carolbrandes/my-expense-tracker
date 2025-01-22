'use client';

import {
    Box
} from '@mui/material';
import { useState } from 'react';
import ResponsiveAppBar from '../components/AppBar';
import { Filters } from '../components/Filters';
import { ModalNewCategory } from '../components/ModalNewCategory';
import { ModalNewTransaction } from '../components/ModalNewTransaction';
import { Resume } from '../components/Resume';
import { Toast } from '../components/Toast';
import { Transactions } from '../components/Transactions';
import { ModalDeleteTransaction } from '../components/Transactions/ModalDeleteTransaction';
import { Skeleton } from '../components/Transactions/Skeleton';
import { useExpensesQuery } from '../hooks/useExpensesQuery';


const ExpensePage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const [toastMessage, setToastMessage] = useState("")
    const { isExpensesLoading } = useExpensesQuery()

    const handleCloseToastMessage = () => setToastMessage("")


    return (
        <>
            <ResponsiveAppBar
                handleOpenModalCategory={setOpenCategoryModal}
                handleOpenModalTransaction={setOpenModal}
            />

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