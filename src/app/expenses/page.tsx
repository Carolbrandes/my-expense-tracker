'use client';

import {
    Box,
    Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { Filters } from '../components/Filters';
import { ModalNewCategory } from '../components/ModalNewCategory';
import { ModalNewTransaction } from '../components/ModalNewTransaction';
import { Resume } from '../components/Resume';
import { TransactionsTable } from '../components/TransactionsTable';
import { SkeletonTable } from '../components/TransactionsTable/SkeletonTable';
import { useTransaction } from '../hooks/useTransactions';


const GrayButton = styled(Button)({
    backgroundColor: '#92A0A7', // Cor cinza
    color: 'white', // Cor do texto
    '&:hover': {
        backgroundColor: '#90A4AE', // Cor ao passar o mouse
    },
});


const ExpensePage = () => {
    const [openModal, setOpenModal] = useState(false); // Modal para adicionar despesa
    const [openCategoryModal, setOpenCategoryModal] = useState(false); // Modal para adicionar categoria

    const { loading, isMobile } = useTransaction()

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
                justifyContent: isMobile ? 'center' : 'flex-end',
                width: '100%',
                mb: isMobile ? 4 : 2
            }} >
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
                loading ? (
                    <SkeletonTable />

                ) : (
                    <TransactionsTable />
                )
            }
        </Box>
    );
};

export default ExpensePage;