import '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        custom?: {
            red: string;
            green: string;
        };
    }

    interface PaletteOptions {
        custom?: {
            red: string;
            green: string;
        };
    }
}