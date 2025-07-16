'use client';

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";

const AparenciaPage = () => {
    const [theme, setTheme] = useState('original');


    useEffect(() => {
        document.body.classList.remove('original-mode', 'light-mode', 'dark-mode');
        document.body.classList.add(`${theme}-mode`);
    }, [theme]);

    return (
        <div className={styles.container}>
            <div className={styles.homeIcon}>
                <a href="/" target="_blank">
                    <img src="/casa.png" alt="Início" className={styles.icone} />
                </a>
            </div>

            <div className={styles.sidebar}>
                <ul>
                    <li><a className={styles.links} href="/componentes/minha-conta">Minha Conta</a></li>
                    <li><a className={styles.links} href="/componentes/confignotificaoes"> Notificações</a></li>
                    <li><a className={styles.links} href=""> Aparência</a></li>
                </ul>
            </div>

            <div className={styles.pai}>
                <div className={styles.content}>
                    <h2 className={styles.h2}>Configurações de Aparência</h2>

                    <label className={styles.switch}>
                        Modo original
                        <input
                            type="checkbox"
                            checked={theme === 'original'}
                            onChange={() => setTheme('original')}
                        />
                        <span className={styles.slider}></span>
                    </label>

                    <label className={styles.switch}>
                        Modo claro
                        <input
                            type="checkbox"
                            checked={theme === 'light'}
                            onChange={() => setTheme('light')}
                        />
                        <span className={styles.slider}></span>
                    </label>

                    <label className={styles.switch}>
                        Modo escuro
                        <input
                            type="checkbox"
                            checked={theme === 'dark'}
                            onChange={() => setTheme('dark')}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default AparenciaPage;
