import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MenuIcon from '@mui/icons-material/Menu';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import { FormControl, Select, SelectChangeEvent, Skeleton } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { fetchCurrencies } from '../../lib/fetchCurrencies';
import { useTransaction } from '../hooks/useTransactions';
import { useUserQuery } from '../hooks/useUserQuery';
import { LogoutButton } from './LogoutButton';
import ThemeToggleButton from './ThemeToggleButton';


interface HeaderProps {
    handleOpenModalTransaction: (value: boolean) => void
    handleOpenModalCategory: (value: boolean) => void
}


export function Header({ handleOpenModalCategory, handleOpenModalTransaction }: HeaderProps) {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

    const { data: currencies = [], isLoading: isLoadingCurrencies, error: errorCurrencies } = useQuery({
        queryKey: ['currencies'],
        queryFn: fetchCurrencies,
        staleTime: Infinity,
    });
    console.log("🚀 ~ Header ~ errorCurrencies:", errorCurrencies)

    const theme = useTheme();

    const { isMobile } = useTransaction()

    const { user, updateUser } = useUserQuery()


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

    const handleCurrencyChange = (event: SelectChangeEvent<string>) => {
        const currency = event.target.value as string;
        updateUser({ ...user, currency })
    };

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
                        alignItems: "center"

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

                        <SavingsOutlinedIcon sx={{
                            display: { xs: 'flex', md: 'none' },
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
                                display: { xs: 'flex', md: 'none' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: theme.palette.text.secondary,
                                textDecoration: 'none',
                            }}
                        >
                            TrackIt
                        </Typography>

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
                    <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>

                        <FormControl
                            fullWidth={isMobile}
                            size="small"
                            variant="standard"
                            sx={{
                                flex: isMobile ? "1 1 100%" : "1 1 auto",
                                minWidth: isMobile ? "100%" : "200px",
                                "& .MuiInput-underline:before": {
                                    borderBottomColor: (theme) => theme.palette.text.secondary,
                                },
                            }}
                        >
                            {isLoadingCurrencies ? (
                                <Skeleton variant="text" width="100%" height={40} />
                            ) : (
                                <Select
                                    value={user.currency}
                                    defaultValue={user.currency}
                                    onChange={handleCurrencyChange}
                                    sx={{
                                        color: (theme) => theme.palette.text.secondary,
                                        display: "flex",
                                        alignItems: "center"
                                    }}
                                    renderValue={(selected) => (
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <AttachMoneyIcon titleAccess="Moeda" sx={{ color: (theme) => theme.palette.text.secondary }} />
                                            {selected}
                                        </div>
                                    )}
                                >
                                    {currencies?.map((currency) => (
                                        <MenuItem
                                            key={currency}
                                            value={currency}
                                            sx={{ color: (theme) => theme.palette.text.secondary }}
                                        >
                                            {currency}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        </FormControl>

                        <ThemeToggleButton />

                        <LogoutButton />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

