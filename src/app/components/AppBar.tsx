import MenuIcon from '@mui/icons-material/Menu';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { LogoutButton } from './LogoutButton';
import ThemeToggleButton from './ThemeToggleButton';

interface AppBarProps {
    handleOpenModalTransaction: (value: boolean) => void
    handleOpenModalCategory: (value: boolean) => void
}




function ResponsiveAppBar({ handleOpenModalCategory, handleOpenModalTransaction }: AppBarProps) {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

    const theme = useTheme();

    const actions = [
        {
            text: 'Cadastrar Categoria',
            fn: handleOpenModalCategory
        },
        {
            text: 'Cadastrar Transação',
            fn: handleOpenModalTransaction
        }
    ];

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };


    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <SavingsOutlinedIcon sx={{
                        display: { xs: 'none', md: 'flex' },
                        mr: 1,
                        color: (theme) => theme.palette.text.secondary,
                    }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: theme.palette.text.secondary,
                            textDecoration: 'none',
                        }}
                    >
                        TrackIt
                    </Typography>

                    <Box sx={{
                        flexGrow: 1,
                        display: { xs: 'flex', md: 'none' },

                    }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            sx={{
                                color: (theme) => theme.palette.text.secondary,
                            }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {actions.map(({ text, fn }) => (
                                <MenuItem key={text} onClick={() => fn(true)}>
                                    <Typography sx={{ textAlign: 'center', color: theme.palette.text.secondary, }}>{text}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {actions.map(({ text, fn }) => (
                            <MenuItem key={text} onClick={() => fn(true)}>
                                <Typography sx={{ textAlign: 'center', color: theme.palette.text.secondary }}>{text}</Typography>
                            </MenuItem>
                        ))}
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <ThemeToggleButton />

                        <LogoutButton />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;
