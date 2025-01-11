import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#83a0bd',
        },
        secondary: {
            main: '#8a8d8e',
        },
        background: {
            default: '#ffffff',
            paper: '#f5f5f5',
        },
        text: {
            primary: '#000000',
            secondary: '#fff'
        },
    }
});



export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#83a0bd',
        },
        secondary: {
            main: '#545454',
        },
        background: {
            default: '#726f6f',
            paper: '#1d1d1d',
        },
        text: {
            primary: '#ffffff',

        },
    },
});