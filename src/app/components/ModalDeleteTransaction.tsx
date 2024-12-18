import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useExpensesQuery } from '../hooks/useExpensesQuery'
import { useTransaction } from '../hooks/useTransactions'



export const ModalDeleteTransaction = () => {
    const { deleteTarget, handleCancelModal, deleteDialogOpen } = useTransaction()
    const { removeExpense } = useExpensesQuery()

    const handleDelete = () => deleteTarget && removeExpense(deleteTarget)


    return (
        <Dialog open={deleteDialogOpen} onClose={() => handleCancelModal(false)}>
            <DialogTitle>Confirmação</DialogTitle>
            <DialogContent>
                Tem certeza que deseja excluir a despesa: {deleteTarget?.description}?
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleCancelModal(false)} color="secondary">
                    Cancelar
                </Button>
                <Button onClick={handleDelete} color="error">
                    Deletar
                </Button>
            </DialogActions>
        </Dialog>
    )
}


