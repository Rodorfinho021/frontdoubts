'use client'

import React, { useState } from "react";
import styles from "./page.module.css"; 

const ResetPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch("https://apidoubts.dev.vilhena.ifro.edu.br/esqueci-senha", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("reset_email", email);
                alert("Código enviado para seu e-mail.");
                window.location.href = "/componentes/mudarsenha";
            } else {
                alert(data.mensagem || "Erro ao enviar código.");
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
            <div className={styles.formBox}>
                <h2 className={styles.h2}>Redefinir Senha</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Seu e-mail cadastrado"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? "Enviando..." : "Enviar código"}
                    </button>
                    <p className={styles.p}>Você receberá um código de verificação no e-mail informado</p>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
