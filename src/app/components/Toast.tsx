import { Alert, Snackbar } from '@mui/material'

interface ToastProps {
    open: boolean
    handleCloseToastMessage: () => void
    toastMessage: string

}

export const Toast = ({ open, handleCloseToastMessage, toastMessage }: ToastProps) => {
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseToastMessage}>
            <Alert
                onClose={handleCloseToastMessage}
                severity="success"
                variant="filled"
                sx={{ width: '100%' }}
            >
                {toastMessage}
            </Alert>
        </Snackbar>
    )
}


