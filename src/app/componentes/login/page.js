'use client'

import React, { useState } from "react";
import styles from "./page.module.css";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3001/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    senha
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Salvando token e usuário no localStorage
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                alert("Login bem-sucedido!");
                window.location.href = "/"; // redirecionar para a home ou dashboard
            } else {
                alert(data.mensagem || "Email ou senha inválidos.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro de conexão com o servidor.");
        }
    };

    return (
        <div className={styles.loginContainer}>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
                <h2 className={styles.h2}>Login</h2>
                <div className={styles.inputGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="senha">Senha</label>
                    <input
                        type="password"
                        id="senha"
                        name="senha"
                        required
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </div>
                <button type="submit" className={styles.submitButton}>Entrar</button>
                <div className={styles.forgotPassword}>
                    <a href="/componentes/trocar-senha">Esqueceu a senha?</a>
                </div>
                <div className={styles.register}>
                    <a href="/componentes/casdastrar">Cadastrar-se</a>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
