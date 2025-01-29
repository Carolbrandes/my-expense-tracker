import { useTransaction } from "@/app/hooks/useTransactions";
import { Paper, Table, TableBody, TableContainer } from "@mui/material";
import { PaginationComponent } from "../PaginationComponent";
import { TransactionRow } from './TransactionRow';
import { TransactionsTableHeader } from './TransactionsTableHeader';


export const TransactionsDesk = () => {

    const { expenses, page } = useTransaction()


    if (!expenses?.data && isNaN(page) && !page) {
        return
    }


    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TransactionsTableHeader />
                    <TableBody>
                        {expenses?.data.map((expense) => (
                            <TransactionRow key={expense.id} expense={expense} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <PaginationComponent
                page={page}
            />
        </>

    );

}




