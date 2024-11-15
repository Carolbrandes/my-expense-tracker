import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

interface ModalDeleteTransactionProps {
    open: boolean
    onClose: () => void
    handleDelete: () => void
    deleteTarget: Expense
}

export const ModalDeleteTransaction = ({ open, onClose, handleDelete, deleteTarget }: ModalDeleteTransactionProps) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirmação</DialogTitle>
            <DialogContent>
                Tem certeza que deseja excluir a despesa: {deleteTarget?.description}?
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancelar
                </Button>
                <Button onClick={handleDelete} color="error">
                    Deletar
                </Button>
            </DialogActions>
        </Dialog>
    )
}


