import { Button } from "@mui/material";
import { signOut } from "next-auth/react";

export const LogoutButton = () => {
    const handleLogout = () => {
        // Sign out the user and redirect them to the home page or login page
        signOut({ callbackUrl: "/login" }); // or /home if you want to go to home page
    };

    return (
        <Button color="secondary" onClick={handleLogout}>Logout</Button>
    );
};






