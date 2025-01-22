import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Button } from "@mui/material";
import { signOut } from "next-auth/react";
import { useAuth } from "../hooks/useAuthContext";

export const LogoutButton = () => {
    const { updateAuthenticated, updateUserId } = useAuth()

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        updateAuthenticated(false);
        updateUserId(null);
        signOut({ callbackUrl: "/login" });
    };

    return (
        <Button title="Sair" sx={{
            color: (theme) => theme.palette.text.secondary,
        }} onClick={handleLogout}>
            <LogoutOutlinedIcon />
        </Button>
    );
};






