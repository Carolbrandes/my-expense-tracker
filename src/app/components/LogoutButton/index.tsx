import { Button } from "@mui/material";
import { signOut } from "next-auth/react";
import { useAuth } from "../../hooks/useAuthContext";

export const LogoutButton = () => {
    const { updateAuthenticated, updateUserId } = useAuth()

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        updateAuthenticated(false);
        updateUserId(null);
        signOut({ callbackUrl: "/login" });
    };

    return (
        <Button color="secondary" onClick={handleLogout}>Logout</Button>
    );
};






