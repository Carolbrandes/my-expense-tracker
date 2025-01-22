import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useCategoriesQuery } from '../../../hooks/useCategoriesQuery';
import { Expense, TransactionType } from '../../../types/interfaces';

interface EditModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (updatedExpense: Expense) => void;
    expense: Expense | null;
}

export const EditModal: React.FC<EditModalProps> = ({ open, onClose, onSave, expense }) => {
    const [formValues, setFormValues] = useState<Expense | null>(expense);
    const { categories } = useCategoriesQuery();

    useEffect(() => {
        if (expense) {
            setFormValues(expense);
        }
    }, [expense]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (formValues) {
            setFormValues({
                ...formValues,
                [name]: name === 'amount' ? parseFloat(value) : value,
            });
        }
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        if (formValues && name) {
            setFormValues({
                ...formValues,
                [name]: value as string,
            });
        }
    };

    const handleSave = () => {
        if (formValues) {
            onSave(formValues);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Editar</DialogTitle>
            <DialogContent>
                {formValues && (
                    <>
                        <TextField
                            label="Descrição"
                            name="description"
                            value={formValues.description}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="category-label">Categoria</InputLabel>
                            <Select
                                labelId="category-label"
                                name="category"
                                value={formValues.category}
                                onChange={handleSelectChange}
                                fullWidth
                                size="small"
                            >
                                {categories && categories.map(({ id, name }) => (
                                    <MenuItem key={id} value={name}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Valor"
                            name="amount"
                            type="number"
                            value={formValues.amount}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Data"
                            name="date"
                            type="date"
                            value={formValues.date.split('T')[0]}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="type-label">Tipo</InputLabel>
                            <Select
                                labelId="type-label"
                                name="type"
                                value={formValues.type}
                                onChange={handleSelectChange}
                                fullWidth
                                size="small"
                            >
                                {Object.values(TransactionType).map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type === TransactionType.Expense ? "Saída" : "Entrada"}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    sx={{
                        color: (theme) => theme.palette.text.primary,
                    }}
                >
                    Cancelar
                </Button>
                <Button onClick={handleSave} color="primary">Salvar</Button>
            </DialogActions>
        </Dialog>
    );
};