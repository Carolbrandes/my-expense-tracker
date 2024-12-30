'use client';

import { DarkMode, LightMode } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useThemeMode } from '../hooks/useThemeMode';

const ThemeToggleButton = () => {
    const { toggleTheme, mode } = useThemeMode();

    return (
        <IconButton onClick={toggleTheme} color="inherit">
            {mode === 'light' ? <DarkMode /> : <LightMode />}
        </IconButton>
    );
};

export default ThemeToggleButton;