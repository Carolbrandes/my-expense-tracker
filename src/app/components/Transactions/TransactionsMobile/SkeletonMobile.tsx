import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Paper, Skeleton } from '@mui/material';

const SkeletonMobile = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Array.from({ length: 5 }).map((_, index) => (
                <Paper key={index} style={{ padding: '1rem', position: 'relative', border: '1px solid #ddd' }}>
                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.25rem' }}>
                        <Button sx={{ minWidth: '5px' }} aria-label="edit" color="primary">
                            <EditIcon />
                        </Button>
                        <Button sx={{ minWidth: '5px' }} aria-label="delete" color="error">
                            <DeleteIcon />
                        </Button>
                    </div>
                    <div>
                        <Skeleton variant="text" width={200} height={24} />
                        <Skeleton variant="text" width={150} height={24} />
                        <Skeleton variant="text" width={100} height={24} />
                        <Skeleton variant="text" width={120} height={24} />
                        <Skeleton variant="text" width={100} height={24} />
                    </div>
                </Paper>
            ))}
        </div>
    );
};

export default SkeletonMobile;