import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { useCategoriesQuery } from '../hooks/useCategoriesQuery';

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
    setOpenCategoryModal,
}: ModalNewCategoryProps) => {
    const [newCategory, setNewCategory] = useState(''); // For new category input
    const [categoryError, setCategoryError] = useState<string | null>(null); // For duplicate category error

    const {
        categories,
        isCategoriesLoading,
        categoriesError,
        createCategory,
        isCreating,
        createError,
    } = useCategoriesQuery();

    console.log("🚀 ~ categories:", categories)

    const handleCategorySubmit = async () => {
        if (!newCategory.trim()) return; // Prevent empty input

        const categoryToSave = newCategory.toLowerCase();

        // Validate if the category already exists
        if (categories?.some((cat) => cat.name === categoryToSave)) {
            setCategoryError('Essa categoria já existe.');
            return;
        }

        // Proceed with creating the new category via mutation
        try {
            createCategory(newCategory); // Trigger the mutation
            setNewCategory(''); // Clear the input field
            setCategoryError(null); // Clear any error messages
            setOpenCategoryModal(false); // Close the modal
        } catch (error) {
            console.error('Erro ao salvar a categoria:', error);
            setCategoryError('Erro inesperado. Tente novamente.');
        }
    };

    if (isCategoriesLoading) return <div>Loading categories...</div>;
    if (categoriesError instanceof Error) return <div>Error: {categoriesError.message}</div>;

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
                    error={!!categoryError} // Show error if exists
                    helperText={categoryError || ''}
                />
                {/* Display existing categories */}
                <Box mt={2}>
                    <h4>Todas as Categorias:</h4>
                    {categories && categories?.length > 0 ? (
                        <ul style={{ marginLeft: '18px', marginTop: '10px' }}>
                            {categories.map(({ id, name }) => (
                                <li key={id}>{name}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>Nenhuma categoria cadastrada.</p>
                    )}
                </Box>

                {createError && <Alert severity="error" style={{ marginBottom: '16px' }}>
                    Desculpe, tivemos um problema tente novamente mais tarde.
                </Alert>}
            </DialogContent>
            <DialogActions>
                <OutlineGrayButton onClick={() => setOpenCategoryModal(false)}>
                    Cancelar
                </OutlineGrayButton>
                <Button onClick={handleCategorySubmit} color="primary" disabled={isCreating}>
                    {isCreating ? 'Salvando...' : 'Salvar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
