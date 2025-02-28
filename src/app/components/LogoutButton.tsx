import AccountCircle from "@mui/icons-material/AccountCircle";
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    Typography
} from "@mui/material";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuthContext";
import { useUserQuery } from "../hooks/useUserQuery";

export const LogoutButton = () => {
    const { updateAuthenticated, updateUserId } = useAuth();
    const { user } = useUserQuery()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        updateAuthenticated(false);
        updateUserId(null);
        signOut({ callbackUrl: "/login" });
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    color: (theme) => theme.palette.text.secondary,
                }}
                onClick={handleMenuOpen}
            >
                <IconButton size="large" color="inherit">
                    <AccountCircle />
                </IconButton>
                <Typography
                    variant="body2"
                    sx={{
                        width: 180,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        textDecoration: "underline",
                        fontSize: "14px",
                    }}
                >
                    Olá, {user?.email}
                </Typography>
            </Box>

            {/* Dropdown Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MenuItem onClick={handleLogout}>Sair</MenuItem>
            </Menu>
        </Box>
    );
};