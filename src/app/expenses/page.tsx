'use client';

import {
    Box,
    Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { Filters } from '../components/Filters';
import { LogoutButton } from '../components/LogoutButton';
import { ModalDeleteTransaction } from '../components/ModalDeleteTransaction';
import { ModalNewCategory } from '../components/ModalNewCategory';
import { ModalNewTransaction } from '../components/ModalNewTransaction';
import { Resume } from '../components/Resume';
import { Transactions } from '../components/Transactions';
import { Skeleton } from '../components/Transactions/Skeleton';
import { useExpensesQuery } from '../hooks/useExpensesQuery';
import { useTransaction } from '../hooks/useTransactions';


const GrayButton = styled(Button)({
    backgroundColor: '#92A0A7',
    color: 'white',
    '&:hover': {
        backgroundColor: '#90A4AE',
    },
});


const ExpensePage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [openCategoryModal, setOpenCategoryModal] = useState(false);


    const { isMobile } = useTransaction()
    const { isExpensesLoading } = useExpensesQuery()



    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ padding: '20px', spacing: 2 }}
        >
            {/* Botões para abrir as modais */}
            <Box sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: isMobile ? 'center' : 'justify-between',
                width: '100%',
                mb: isMobile ? 4 : 2
            }} >
                <LogoutButton />

                <Box sx={{
                    justifyContent: isMobile ? 'center' : 'flex-end',
                    width: '100%',
                }}>
                    <GrayButton
                        variant="contained"
                        onClick={() => setOpenCategoryModal(true)}
                        sx={{
                            marginRight: '20px',
                            marginBottom: isMobile ? '10px' : 0,
                            fontSize: isMobile ? '0.8rem' : '1rem'
                        }}>
                        Adicionar Categoria
                    </GrayButton>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setOpenModal(true)
                        }}
                        sx={{
                            marginRight: '20px',
                            fontSize: isMobile ? '0.8rem' : '1rem'
                        }}>
                        Nova Transação

                    </Button>
                </Box>
            </Box>

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
    );
};

export default ExpensePage;