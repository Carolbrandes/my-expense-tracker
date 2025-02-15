'use client';

import { DarkMode, LightMode } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { useThemeMode } from '../hooks/useThemeMode';

const ThemeToggleButton = () => {
    const { toggleTheme, mode } = useThemeMode();

    return (
        <Tooltip title="Tema">
            <IconButton
                onClick={toggleTheme}
                sx={{ color: (theme) => theme.palette.text.secondary }}
            >
                {mode === "light" ? <DarkMode /> : <LightMode />}
            </IconButton>
        </Tooltip>
    );
};

export default ThemeToggleButton;