import { Button, Dialog, DialogActions, DialogContent, DialogTitle, useTheme } from '@mui/material'
import { useExpensesQuery } from '../../hooks/useExpensesQuery'
import { useTransaction } from '../../hooks/useTransactions'



export const ModalDeleteTransaction = () => {
    const { deleteTarget, toggleCancelModal, deleteDialogOpen } = useTransaction()
    const { removeExpense } = useExpensesQuery()
    const theme = useTheme();

    const handleDelete = () => {
        if (deleteTarget) {
            removeExpense(deleteTarget)
            toggleCancelModal(false)
        }

    }


    return (
        <Dialog open={deleteDialogOpen} onClose={() => toggleCancelModal(false)}>
            <DialogTitle>Confirmação</DialogTitle>
            <DialogContent>
                Tem certeza que deseja excluir a despesa: {deleteTarget?.description}?
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => toggleCancelModal(false)}
                    sx={{ color: theme?.palette?.text.primary }}
                >
                    Cancelar
                </Button>
                <Button onClick={handleDelete} color="error">
                    Deletar
                </Button>
            </DialogActions>
        </Dialog>
    )
}


