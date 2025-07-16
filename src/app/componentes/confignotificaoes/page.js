'use client';

import React, { useState, useEffect } from "react";
import styles from "./page.module.css"; 

const NotificacoesPage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [loaded, setLoaded] = useState(false); // <- controle de carregamento

  // Carrega do localStorage apenas 1x
  useEffect(() => {
    const configSalva = JSON.parse(localStorage.getItem("configNotificacoes"));
    if (configSalva) {
      setNotificationsEnabled(configSalva.geral ?? true);
      setEmailNotifications(configSalva.amizade ?? false);
      setSmsNotifications(configSalva.canais ?? false);
    }
    setLoaded(true); // <- indica que terminou de carregar
  }, []);

  // Salva no localStorage sempre que mudar
  useEffect(() => {
    if (!loaded) return; // só salva se já carregou
    const config = {
      geral: notificationsEnabled,
      amizade: emailNotifications,
      canais: smsNotifications,
    };
    localStorage.setItem("configNotificacoes", JSON.stringify(config));
  }, [notificationsEnabled, emailNotifications, smsNotifications, loaded]);

  if (!loaded) {
    return <p>Carregando configurações...</p>; // ou um loader melhor
  }

  return (
    <div className={styles.container}>
      <div className={styles.homeIcon}>
        <a href="/">
          <img src="/casa.png" alt="Início" className={styles.icone} />
        </a>
      </div>

      <div className={styles.sidebar}>
        <ul>
          <li><a className={styles.links} href="/componentes/minha-conta">Minha Conta</a></li>
          <li><a className={styles.links} href=""> Notificações</a></li>
        </ul>
      </div>

      <div className={styles.pai}>
        <div className={styles.content}>
          <h2 className={styles.h2}>Configurações de Notificações</h2>

          <label className={styles.switch}>
            Notificações Gerais
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
            />
            <span className={styles.slider}></span>
          </label>

          <label className={styles.switch}>
            Pedidos de Amizades
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
            />
            <span className={styles.slider}></span>
          </label>

          <label className={styles.switch}>
            Notificações Canais
            <input
              type="checkbox"
              checked={smsNotifications}
              onChange={() => setSmsNotifications(!smsNotifications)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificacoesPage;
