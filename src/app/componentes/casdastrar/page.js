'use client'

import React, { useState } from "react";
import styles from "./page.module.css";

const Page = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("As senhas não coincidem.");
            return;
        }

        try {
            const response = await fetch("https://apidoubts.dev.vilhena.ifro.edu.br/cadastro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: username,
                    email,
                    senha: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Cadastro realizado com sucesso!");
                window.location.href = "/componentes/login";
            } else {
                if (data.mensagem?.includes("já cadastrado")) {
                    alert(data.mensagem);
                } else {
                    alert(`Erro ao cadastrar: ${data.mensagem || "Erro desconhecido"}`);
                }
            }
        } catch (error) {
            alert("Erro de conexão com o servidor.");
        }
    }; // <- Aqui fecha corretamente o handleSubmit

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h2 className={styles.h2}>Cadastrar-se</h2>
                <form id="registerForm" onSubmit={handleSubmit}>
                    <input
                        className={styles.input}
                        type="text"
                        id="username"
                        placeholder="Nome de usuário"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className={styles.input}
                        type="email"
                        id="email"
                        placeholder="Seu gmail"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className={styles.input}
                        type="password"
                        id="password"
                        placeholder="Criar senha"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        className={styles.input}
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirmar senha"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <input className={styles.submitButton} type="submit" value="Confirmar" />
                </form>
            </div>
        </div>
    );
};

export default Page;
