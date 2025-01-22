import { Alert, Box } from "@mui/material";
import { useTransaction } from "../../hooks/useTransactions";
import { TransactionsDesk } from './TransactionsDesk';
import { TransactionsMobile } from './TransactionsMobile';


export const Transactions = () => {


    const { isMobile, filteredExpenses } = useTransaction()



    return (
        <>
            {filteredExpenses?.length === 0 ? (
                <Box style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Alert
                        icon={false}
                        severity="warning"
                        sx={{ width: isMobile ? '90%' : '60%', height: 'auto' }}
                    >
                        Nenhum registro encontrado.
                    </Alert>
                </Box>
            ) : (
                <>

                    {isMobile ? (
                        <TransactionsMobile />
                    ) : (
                        <TransactionsDesk />
                    )}
                </>
            )}


        </>
    );

}




