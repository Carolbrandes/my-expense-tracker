'use client';

import {
    Box
} from '@mui/material';
import { useState } from 'react';
import ResponsiveAppBar from '../components/AppBar';
import { Filters } from '../components/Filters';
import { ModalDeleteTransaction } from '../components/ModalDeleteTransaction';
import { ModalNewCategory } from '../components/ModalNewCategory';
import { ModalNewTransaction } from '../components/ModalNewTransaction';
import { Resume } from '../components/Resume';
import { Transactions } from '../components/Transactions';
import { Skeleton } from '../components/Transactions/Skeleton';
import { useExpensesQuery } from '../hooks/useExpensesQuery';


const ExpensePage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const { isExpensesLoading } = useExpensesQuery()


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
                sx={{ padding: '20px', spacing: 2 }}
            >

                {/* Modal para adicionar nova categoria */}
                <ModalNewCategory openCategoryModal={openCategoryModal} setOpenCategoryModal={setOpenCategoryModal} />


                {/* Modal para adicionar novo registro */}
                <ModalNewTransaction openModal={openModal} setOpenModal={setOpenModal} />

                <Box>
                    <h2 >Relatório de Transações</h2>
                </Box>

                {/* filtros */}
                <Filters />

                {/* Total */}
                <Resume />

                {
                    isExpensesLoading ? (
                        <Skeleton />

                    ) : (
                        <Transactions />
                    )
                }

                {/* Modal de confirmação de deleção */}
                <ModalDeleteTransaction />
            </Box>
        </>
    );
};

export default ExpensePage;