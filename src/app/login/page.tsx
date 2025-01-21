"use client";

import { Alert, Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const { updateAuthenticated, updateUserId } = useAuth();
    const router = useRouter();
    const theme = useTheme();

    const MessagesSeverity = {
        "Invalid code.": "error",
        "Código de verificação enviado para o seu email.": "success",
        "Login realizado com sucesso!": "success",
        default: "info",
    };

    // Utility function to validate the token
    const isTokenValid = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 > Date.now(); // Token expiration in milliseconds
        } catch (error) {
            console.error("Invalid token:", error);
            return false;
        }
    };

    // Check for token validity on page load
    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token && isTokenValid(token)) {
            updateAuthenticated(true);
            updateUserId(jwtDecode(token).userId); // Update user ID from token
            router.push("/");
        } else {
            localStorage.removeItem("auth_token");
            updateAuthenticated(false);
        }
    }, []);

    const sendCode = async () => {
        try {
            const response = await fetch("/api/send-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setIsCodeSent(true);
                setMessage("Código de verificação enviado para o seu email.");
            } else {
                setMessage(data.error || "Falha ao enviar o código.");
            }
        } catch (error) {
            console.error("Error sending code:", error);
            setMessage("Ocorreu um erro. Tente novamente.");
        }
    };

    const verifyCode = async () => {
        try {
            const response = await fetch("/api/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code }),
            });

            const data = await response.json();
            if (response.ok) {
                const token = data.token;

                if (token) {
                    localStorage.setItem("auth_token", token);
                    updateUserId(data.userId);
                    updateAuthenticated(true);
                    setMessage("Login realizado com sucesso!");
                    router.push("/");
                } else {
                    console.error("Token is missing in the response.");
                    setMessage("Erro no login. Tente novamente.");
                }
            } else {
                setMessage(data.error || "Código inválido.");
            }
        } catch (error) {
            console.error("Error verifying code:", error);
            setMessage("Ocorreu um erro. Tente novamente.");
        }
    };

    const handleBackToEmail = () => {
        setIsCodeSent(false);
        setCode("");
        setMessage("");
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            padding={2}
            bgcolor="#f5f5f5"
        >
            {!isCodeSent ? (
                <Box
                    component="form"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={2}
                    bgcolor="white"
                    p={4}
                    borderRadius={2}
                    boxShadow={3}
                    width="100%"
                    maxWidth={400}
                >
                    <Typography variant="h5" fontWeight="bold" color="primary">
                        Login
                    </Typography>

                    <TextField
                        type="email"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        size="small"
                        variant="standard"
                        InputProps={{
                            style: {
                                borderBottom: `1px solid ${theme?.palette.primary.main}`, // Borda visível no estado inicial
                                color: theme?.palette.primary.main
                            },
                        }}
                        InputLabelProps={{
                            style: { color: theme?.palette.primary.main }, // Garantir rótulo visível
                        }}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={sendCode}
                        size="large"
                        sx={{
                            fontSize: {
                                xs: '0.75rem',
                                sm: '1rem',
                            },
                            color: theme?.palette?.text?.secondary
                        }}
                    >
                        Solicitar código de verificação
                    </Button>
                    {message && (
                        <Alert severity={MessagesSeverity[message] || MessagesSeverity.default}>
                            {message}
                        </Alert>
                    )}
                </Box>
            ) : (
                <Box
                    component="form"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={2}
                    bgcolor="white"
                    p={4}
                    borderRadius={2}
                    boxShadow={3}
                    width="100%"
                    maxWidth={400}
                >
                    <Typography variant="h5" fontWeight="bold" color="primary">
                        Inserir Código de Verificação
                    </Typography>


                    <TextField
                        type="text"
                        label="Código de Verificação"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        fullWidth
                        size="small"
                        variant="standard"
                        InputProps={{
                            style: {
                                borderBottom: `1px solid ${theme?.palette.primary.main}`, // Borda visível no estado inicial
                                color: theme?.palette.primary.main
                            },
                        }}
                        InputLabelProps={{
                            style: { color: theme?.palette.primary.main }, // Garantir rótulo visível
                        }}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={verifyCode}
                        size="large"
                    >
                        Verificar Código
                    </Button>
                    {message && (
                        <>
                            <Alert severity={MessagesSeverity[message] || MessagesSeverity.default}>
                                {message}
                            </Alert>
                            {message === "Invalid code." && (
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleBackToEmail}
                                    size="large"
                                    sx={{ marginTop: "40px" }}
                                >
                                    Voltar para o início
                                </Button>
                            )}
                        </>
                    )}
                </Box>
            )}
        </Box>
    );
}
