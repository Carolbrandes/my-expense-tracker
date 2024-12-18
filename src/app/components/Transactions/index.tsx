
// import { Alert, Box, Button, FormControl, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useTransaction } from "../../hooks/useTransactions";
// import { TransactionsTableHeader } from './TransactionsDesk/TransactionsTableHeader';
// import { TransactionRow } from './TransactionsDesk/TransactionRow';
import { Alert, Box } from "@mui/material";
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




