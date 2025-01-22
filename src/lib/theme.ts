import { createTheme } from '@mui/material';


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
            secondary: '#fff',
        },
        custom: {
            red: '#ff0000',
            green: '#049a04'
        }
    },
    components: {
        MuiInput: {
            styleOverrides: {
                root: {
                    color: '#000',
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#000',
                },
            },
        },
    },
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
            default: '#3a3838',
            paper: '#3a3838',
        },
        text: {
            primary: '#ffffff',
        },
        custom: {
            red: '#f58d86',
            green: '#a2c8a2'
        }
    },
});