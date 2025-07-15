'use client'

import React, { useState } from "react";
import styles from "./page.module.css";

const ChangePasswordPage = () => {
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            return alert("As senhas não coincidem.");
        }

        const email = localStorage.getItem("reset_email");
        if (!email) return alert("E-mail de recuperação não encontrado. Recomece o processo.");

        setLoading(true);
        try {
            const response = await fetch("https://apidoubts.dev.vilhena.ifro.edu.br/verificar-codigo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    codigo: verificationCode,
                    novaSenha: newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Senha alterada com sucesso!");
                localStorage.removeItem("reset_email");
                window.location.href = "/componentes/login";
            } else {
                alert(data.mensagem || "Erro ao alterar senha.");
            }
        } catch (err) {
            console.error(err);
            alert("Erro na solicitação.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h2 className={styles.h2}>Alterar Senha</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Código de verificação"
                        required
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Nova senha"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Confirmar nova senha"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? "Processando..." : "Confirmar"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
