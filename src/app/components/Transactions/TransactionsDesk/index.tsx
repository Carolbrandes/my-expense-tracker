import { useTransaction } from "@/app/hooks/useTransactions";
import { Paper, Table, TableBody, TableContainer } from "@mui/material";
import { TransactionRow } from './TransactionRow';
import { TransactionsTableHeader } from './TransactionsTableHeader';


export const TransactionsDesk = () => {

    const { filteredExpenses } = useTransaction()


    if (!filteredExpenses) {
        return
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TransactionsTableHeader />
                <TableBody>
                    {filteredExpenses?.map((expense) => (
                        <TransactionRow key={expense.id} expense={expense} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

    );

}




