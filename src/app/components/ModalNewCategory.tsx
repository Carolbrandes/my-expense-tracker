import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useTransaction } from '../hooks/useTransactions';

interface ModalNewCategoryProps {
    openCategoryModal: boolean
    setOpenCategoryModal: (value: boolean) => void
}


const OutlineGrayButton = styled(Button)({
    color: '#92A0A7',
    background: 'transparent',
    '&:hover': {
        color: '#90A4AE', // Cor ao passar o mouse
    },
});

export const ModalNewCategory = ({ openCategoryModal, setOpenCategoryModal }: ModalNewCategoryProps) => {
    const [newCategory, setNewCategory] = useState(''); // Para o input da nova categoria
    const [categoryError, setCategoryError] = useState<string | null>(null); // Para erros de categoria duplicada

    const { categories, getCategories } = useTransaction()

    useEffect(() => {
        getCategories()
    }, [])

    // Função para salvar a nova categoria com validação de duplicação
    const handleCategorySubmit = async () => {
        if (!newCategory.trim()) return;

        const categoryToSave = newCategory.toLowerCase();

        // Valida se a categoria já existe
        if (categories.some(cat => cat.name.includes(categoryToSave))) {
            setCategoryError('Essa categoria já existe.');
            return;
        }

        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: categoryToSave }),
            });

            if (res.ok) {
                getCategories()
                setNewCategory(''); // Limpa o campo
                setCategoryError(null); // Remove a mensagem de erro
                setOpenCategoryModal(false); // Fecha a modal
            }
        } catch (error) {
            console.error('Erro ao salvar a categoria:', error);
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
                        <ul style={{ marginLeft: "18px", marginTop: "10px" }}>
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
                <OutlineGrayButton onClick={() => setOpenCategoryModal(false)} >
                    Cancelar
                </OutlineGrayButton>
                <Button onClick={handleCategorySubmit} color="primary">
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    )
}


