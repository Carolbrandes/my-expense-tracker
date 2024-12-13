import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuthContext';
import { useTransaction } from '../hooks/useTransactions';

interface ModalNewCategoryProps {
    openCategoryModal: boolean;
    setOpenCategoryModal: (value: boolean) => void;
}

const OutlineGrayButton = styled(Button)({
    color: '#92A0A7',
    background: 'transparent',
    '&:hover': {
        color: '#90A4AE', // Cor ao passar o mouse
    },
});

export const ModalNewCategory = ({
    openCategoryModal,
    setOpenCategoryModal
}: ModalNewCategoryProps) => {
    const [newCategory, setNewCategory] = useState(''); // Para o input da nova categoria
    const [categoryError, setCategoryError] = useState<string | null>(null); // Para erros de categoria duplicada
    const { userId } = useAuth()
    const { categories, getCategories, addCategories } = useTransaction();

    useEffect(() => {
        getCategories();
    }, []);

    const handleCategorySubmit = async () => {
        if (!newCategory.trim()) return; // Prevent empty input

        const categoryToSave = newCategory.toLowerCase();

        // Validate if the category already exists
        if (categories.some((cat) => cat.name === categoryToSave)) {
            setCategoryError('Essa categoria já existe.');
            return;
        }

        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: categoryToSave, userId }), // Include userId in the payload
            });

            if (res.ok) {
                const resPost = await res.json()

                addCategories(resPost)
                setNewCategory(''); // Clear input field
                setCategoryError(null); // Clear any error messages
                setOpenCategoryModal(false); // Close the modal
            } else {
                const errorData = await res.json();
                setCategoryError(errorData.message || 'Erro ao salvar a categoria.');
            }
        } catch (error) {
            console.error('Erro ao salvar a categoria:', error);
            setCategoryError('Erro inesperado. Tente novamente.');
        }
    };


    return (
        <Dialog open={openCategoryModal} onClose={() => setOpenCategoryModal(false)}>
            <DialogTitle>Adicionar Nova Categoria</DialogTitle>
            <DialogContent>
                <TextField
                    label="Nova Categoria"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                    error={!!categoryError} // Mostra o erro se houver
                    helperText={categoryError || ''}
                />
                {/* Exibe a lista de categorias existentes */}
                <Box mt={2}>
                    <h4>Categorias Existentes</h4>
                    {categories.length > 0 ? (
                        <ul style={{ marginLeft: '18px', marginTop: '10px' }}>
                            {categories.map(({ id, name }) => (
                                <li key={id}>{name}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>Nenhuma categoria cadastrada.</p>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <OutlineGrayButton onClick={() => setOpenCategoryModal(false)}>
                    Cancelar
                </OutlineGrayButton>
                <Button onClick={handleCategorySubmit} color="primary">
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
};
