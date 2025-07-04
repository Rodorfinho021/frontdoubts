'use client'

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    useEffect(() => {
        setEmail("");
        setSenha("");
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const emailValue = form.email.value.trim();
        const senhaValue = form.senha.value.trim();

        console.log("Valores enviados:", { emailValue, senhaValue });

        if (!emailValue || !senhaValue) {
            alert("Preencha todos os campos.");
            return;
        }

        try {
            const response = await fetch("https://apidoubts.dev.vilhena.ifro.edu.br/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: emailValue,
                    senha: senhaValue
                }),
                cache: "no-store"
            });

            const text = await response.text();
            let data;

            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("Resposta não era JSON:", text);
                alert("Erro inesperado do servidor.");
                return;
            }

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                alert("Login bem-sucedido!");
                window.location.href = "/";
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
