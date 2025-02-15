import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Button, Tooltip } from "@mui/material";
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
        <Tooltip title="Sair">
            <Button
                sx={{ color: (theme) => theme.palette.text.secondary }}
                onClick={handleLogout}
            >
                <LogoutOutlinedIcon />
            </Button>
        </Tooltip>
    );
};






