import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useState } from "react";
import { useAuth } from "../hooks/useAuthContext";
import { useTransaction } from "../hooks/useTransactions";
import { Expense, TransactionType } from "../types/interfaces";
import { CurrencyInput } from "./CurrencyInput";

interface ModalNewTransactionsProps {
    openModal: boolean
    setOpenModal: (value: boolean) => void

}

const OutlineGrayButton = styled(Button)({
    color: '#92A0A7',
    background: 'transparent',
    '&:hover': {
        color: '#90A4AE',
    },
});

export const ModalNewTransaction = ({ openModal, setOpenModal }: ModalNewTransactionsProps) => {
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState<TransactionType>(TransactionType.Expense);

    const { categories, addExpense } = useTransaction()
    const { userId } = useAuth()
    console.log("🚀 ~ ModalNewTransaction ~ userId:", userId)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (userId) {
            const newExpense: Expense = {
                id: Date.now().toString(),
                description,
                category,
                // Remove thousand separators and convert to number
                amount: parseFloat(amount.replace(/\./g, '')),
                date,
                type,
                userId
            };
            console.log("🚀 ~ handleSubmit ~ newExpense:", newExpense);

            const res = await fetch('/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newExpense),
            });

            if (res.ok) {
                const savedExpense = await res.json();
                console.log("🚀 ~ handleSubmit ~ savedExpense:", savedExpense)

                addExpense(savedExpense)

                // Clear input fields and close the modal
                setDescription('');
                setCategory('');
                setAmount('');
                setDate('');
                setType(TransactionType.Expense);
                setOpenModal(false);
            }
        }

    };

    const handleType = (event: SelectChangeEvent<TransactionType>) => {
        setType(event.target.value as TransactionType);
    };


    return (
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
            <DialogTitle>Cadastrar Entradas ou Despesas</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
                    <TextField
                        label="Data"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <TextField
                        label="Descrição"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Categoria</InputLabel>
                        <Select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            {categories && categories.map(({ id, name }) => (
                                <MenuItem key={id} value={name}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Tipo</InputLabel>
                        <Select
                            value={type}
                            onChange={handleType}
                            required
                        >
                            <MenuItem value={TransactionType.Expense}>Saída</MenuItem>
                            <MenuItem value={TransactionType.Income}>Entrada</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <CurrencyInput
                            onChange={(event: { target: { value: string, name: string } }) => {
                                setAmount(event.target.value); // Update with the numeric value
                            }}
                            name='amount'
                            value={amount}
                        />

                    </FormControl>



                </form>
            </DialogContent>
            <DialogActions>
                <OutlineGrayButton onClick={() => setOpenModal(false)} >
                    Cancelar
                </OutlineGrayButton>
                <Button onClick={handleSubmit} color="primary">
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    )
}