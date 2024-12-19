import { useExpensesQuery } from "@/app/hooks/useExpensesQuery";
import { useTransaction } from "@/app/hooks/useTransactions";
import { Paper, Table, TableBody, TableContainer } from "@mui/material";
import { PaginationComponent } from "../PaginationComponent";
import { TransactionRow } from './TransactionRow';
import { TransactionsTableHeader } from './TransactionsTableHeader';


export const TransactionsDesk = () => {

    const { filteredExpenses, currentPage } = useTransaction()
    const { expenses } = useExpensesQuery();



    if (!filteredExpenses && !expenses?.meta && isNaN(currentPage) && !currentPage) {
        return
    }

    const totalPages = expenses?.meta?.totalPages || 1;



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

            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}

            />

        </TableContainer>

    );

}




