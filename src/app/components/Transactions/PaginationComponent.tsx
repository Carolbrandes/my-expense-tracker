// import { useExpensesQuery } from '@/app/hooks/useExpensesQuery';
import { useExpensesQuery } from '@/app/hooks/useExpensesQuery';
import { useTransaction } from '@/app/hooks/useTransactions';
import { Pagination } from '@mui/material';
import { Box } from '@mui/system';

interface PaginationProps {
    page: number;
    totalPages: number;

}

export const PaginationComponent = ({ page, totalPages, }: PaginationProps) => {
    console.log("🚀 ~ PaginationComponent ~ PaginationComponent")
    console.log("🚀 ~ PaginationComponent ~ totalPages:", totalPages)
    console.log("🚀 ~ PaginationComponent ~ page:", page)
    const {
        updatePage,

    } = useTransaction()


    const { expenses } = useExpensesQuery(page);
    console.log("🚀 ~ PaginationComponent ~ expenses:", expenses)


    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        console.log("🚀 ~ handlePageChange ~ page:", page)
        updatePage(page);


    };

    return (
        <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                onClick={() => console.log("cliquei botao paginacao")}
            />
        </Box>
    );
};


