import { useExpensesQuery } from "@/app/hooks/useExpensesQuery";
import { useTransaction } from "@/app/hooks/useTransactions";
import { Paper, Table, TableBody, TableContainer } from "@mui/material";
import { PaginationComponent } from "../PaginationComponent";
import { TransactionRow } from './TransactionRow';
import { TransactionsTableHeader } from './TransactionsTableHeader';


export const TransactionsDesk = () => {

    const { filteredExpenses, page } = useTransaction()
    console.log("🚀 ~ TransactionsDesk ~ page:", page)
    const { expenses } = useExpensesQuery();



    if (!filteredExpenses && !expenses?.meta && isNaN(page) && !page) {
        return
    }

    const totalPages = expenses?.meta?.totalPages || 1;
    console.log("🚀 ~ TransactionsDesk ~ totalPages:", totalPages)



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
                page={page}
                totalPages={totalPages}

            />

        </TableContainer>

    );

}




