import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { TableCell, useTheme } from '@mui/material';

interface TransactionsTableCellHeaderProps {
    label: string
    value: string
    sortOrder: string
    sortBy: string
    sortable: boolean
    clickFn: (value: string) => void
    handleChangeSortOrder: () => void
}

export const TransactionsTableCellHeader = ({ sortOrder, sortBy, clickFn, handleChangeSortOrder, sortable, value, label }: TransactionsTableCellHeaderProps) => {

    const theme = useTheme();


    const getArrow = () => {
        const criteria = value == sortBy;

        if (!criteria) return null;

        return sortOrder === "asc" ? (
            <ArrowUpwardIcon sx={{ color: 'white' }} />
        ) : (
            <ArrowDownwardIcon sx={{ color: 'white' }} />
        );
    };



    return sortable ? (
        <TableCell
            style={{
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.text.secondary,
                fontWeight: '700',
                cursor: 'pointer',

            }}
            onClick={() => clickFn(value)}
        >
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {label}
                <button
                    style={{ background: 'none', border: 'none', outline: 'none', marginLeft: '5px' }}
                    onClick={handleChangeSortOrder}>
                    {getArrow()}
                </button>
            </div>
        </TableCell>
    ) :
        (
            <TableCell
                style={{
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.text.secondary,
                    fontWeight: '700',
                    cursor: 'pointer',
                }}
            >
                {label}
            </TableCell>
        )
}


