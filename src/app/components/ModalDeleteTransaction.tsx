import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useTransaction } from '../hooks/useTransactions'



export const ModalDeleteTransaction = () => {
    const { deleteExpense, deleteTarget, handleCancelModal, deleteDialogOpen } = useTransaction()

    const handleDelete = () => deleteTarget && deleteExpense(deleteTarget)


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


