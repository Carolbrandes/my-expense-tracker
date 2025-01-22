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
        <Box display="flex" justifyContent="center" mt={4} mb={4}>
            <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="secondary"

            />
        </Box>
    );
};


