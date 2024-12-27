// import { useExpensesQuery } from '@/app/hooks/useExpensesQuery';
import { useTransaction } from '@/app/hooks/useTransactions';
import { Pagination } from '@mui/material';
import { Box } from '@mui/system';

interface PaginationProps {
    page: number;
}

export const PaginationComponent = ({ page }: PaginationProps) => {

    const {
        updatePage,
        totalPages
    } = useTransaction()


    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
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


