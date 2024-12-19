import { useTransaction } from '@/app/hooks/useTransactions';
import { Pagination } from '@mui/material';
import { Box } from '@mui/system';

interface PaginationProps {
    currentPage: number;
    totalPages: number;

}

export const PaginationComponent = ({ currentPage, totalPages, }: PaginationProps) => {
    const { updateCurrentPage } = useTransaction()

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        updateCurrentPage(page);
    };

    return (
        <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
            />
        </Box>
    );
};
