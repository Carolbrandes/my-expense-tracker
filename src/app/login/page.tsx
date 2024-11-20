"use client";

import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../hooks/useAuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    console.log("🚀 ~ LoginPage ~ message:", message);
    const { updateAuthenticated } = useAuth();
    const router = useRouter();

    const MessagesSeverity = {
        "Invalid code.": "error",
        "Código de verificação enviado para o seu email.": "success",
        "Login realizado com sucesso!": "success"
    };

    const sendCode = async () => {
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
    };

    const verifyCode = async () => {
        const response = await fetch("/api/verify-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code }),
        });

        const data = await response.json();
        if (response.ok) {
            setMessage("Login realizado com sucesso!");
            localStorage.setItem("auth_token", "your-token"); // Save token
            updateAuthenticated(true);
            router.push("/"); // Redirect to home page
        } else {
            setMessage(data.error || "Código inválido.");
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
                        fullWidth
                        type="email"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined"
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={sendCode}
                        size="large"
                    >
                        Solicitar código de verificação
                    </Button>
                    {message && (
                        <Alert severity={MessagesSeverity[message]}>
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
                        fullWidth
                        type="text"
                        label="Código de Verificação"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        variant="outlined"
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
                            <Alert severity={MessagesSeverity[message]}>
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
