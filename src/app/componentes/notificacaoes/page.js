'use client';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';

// resto do seu código...


const Notificacoes = () => {
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    const buscarNotificacoes = async () => {
      try {
        const response = await fetch('https://apidoubts.dev.vilhena.ifro.edu.br/amizade/notificacoes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        const data = await response.json();

        // Filtrar notificações repetidas por remetente, mantendo a mais recente
        // Supondo que cada notificação tem 'remetente_id' e 'created_at' (ou algum campo que indica data)
        // Se não tiver, mantém a primeira que aparecer
        const notificacoesFiltradas = [];
        const remetentesMap = new Map();

        data.forEach((notif) => {
          const remetenteId = notif.remetente_id || notif.usuario_id || notif.id; // ajuste conforme seu campo
          const existente = remetentesMap.get(remetenteId);

          if (!existente) {
            remetentesMap.set(remetenteId, notif);
          } else {
            // Se tiver data, pode comparar e substituir o antigo pela mais recente
            // Aqui um exemplo simples assumindo campo created_at (ISO string)
            if (notif.created_at && existente.created_at) {
              if (new Date(notif.created_at) > new Date(existente.created_at)) {
                remetentesMap.set(remetenteId, notif);
              }
            }
            // Se não tiver created_at, manter o primeiro e ignorar os seguintes
          }
        });

        remetentesMap.forEach((value) => notificacoesFiltradas.push(value));

        setNotificacoes(notificacoesFiltradas);
      } catch (error) {
        console.error('Erro ao buscar notificações:', error);
      }
    };

    buscarNotificacoes();
  }, []);

  const responderSolicitacao = async (id, acao) => {
    try {
      const response = await fetch('https://apidoubts.dev.vilhena.ifro.edu.br/amizade/responder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ id, acao })
      });

      const data = await response.json();
      alert(data.mensagem);

      // Remove a notificação da lista após resposta
      setNotificacoes(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Erro ao responder solicitação:', error);
      alert('Erro ao responder solicitação.');
    }
  };

  return (
    <section className={styles.bodyMain}>
      {/* Lado Esquerdo */}
      <section className={styles.leftSide}>
        <div>
          <svg className={styles.logo} width="100" height="50" viewBox="0 0 150 63" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30.6007 62H1L28.5939 1H55.686L79.2662 28.7273L68.7304 38.965L40.1331 11.6643L20.5666 45.7902L30.6007 62Z" stroke="white"/>
            <path d="M33.6109 35.1259L40.1331 21.9021L68.7304 45.7902L107.362 11.6643L110.874 26.1678L71.7406 62H55.686L33.6109 35.1259Z" stroke="white"/>
            <path d="M120.406 21.9021L110.874 1H148L99.8362 62H86.2901L120.406 21.9021Z" stroke="white"/>
          </svg>
        </div>

        <div className={styles.itens}>
          <Link href="/">
            <Image src="/casa.png" alt="Home" width={40} height={40} className={styles.img_t} />
          </Link>
          <Link href="/componentes/aparencia">
            <Image src="/engrenagem.png" alt="Configurações" width={40} height={40} className={styles.img_t} />
          </Link>
          <Link href="/componentes/notificacoes">
            <Image src="/sino.png" alt="Notificações" width={40} height={40} className={styles.img_t} />
          </Link>
        </div>
      </section>

      {/* Lado Direito */}
      <section className={styles.rightSide}>
        <h1>Notificações</h1>
        <div className={styles.lista}>
          {notificacoes.length === 0 ? (
            <p>Sem novas notificações</p>
          ) : (
            notificacoes.map((notificacao) => (
              <div key={notificacao.id} className={styles.notificacao}>
                <span>{notificacao.mensagem}</span>
                {notificacao.tipo === 'amizade' && (
                  <div className={styles.botoes}>
                    <button
                      className={styles.aceitar}
                      onClick={() => responderSolicitacao(notificacao.id, 'aceitar')}
                    >
                      Aceitar
                    </button>
                    <button
                      className={styles.recusar}
                      onClick={() => responderSolicitacao(notificacao.id, 'recusar')}
                    >
                      Recusar
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </section>
  );
};

export default Notificacoes;
