  'use client';
  import React, { useEffect, useState } from 'react';
  import styles from './page.module.css';
  import Link from 'next/link';
  import Image from 'next/image';



  const Notificacoes = () => {
    const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    const buscarNotificacoes = async () => {
      try {
        const token = localStorage.getItem("token");

        // Obter as configurações salvas
        const config = JSON.parse(localStorage.getItem("configNotificacoes")) || {
          geral: true,
          amizade: true,
          canais: true
        };

        // Se notificações gerais estiverem desativadas, não carrega nada
        if (!config.geral) {
          setNotificacoes([]);
          return;
        }

        const [amizadeRes, canaisRes] = await Promise.all([
          fetch('https://apidoubts.dev.vilhena.ifro.edu.br/amizade/notificacoes', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('https://apidoubts.dev.vilhena.ifro.edu.br/notificacoes/canais', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const amizadeData = await amizadeRes.json();
        const canaisData = await canaisRes.json();

        // Unifica os dois tipos de notificações
        let todasNotificacoes = [...amizadeData, ...canaisData];

        // Filtrar com base nas configurações específicas
        todasNotificacoes = todasNotificacoes.filter((notif) => {
          if (notif.tipo === 'amizade' && !config.amizade) return false;
          if (notif.tipo === 'compartilhamento_canal' && !config.canais) return false;
          return true;
        });

        // Filtro por remetente mais recente
        const notificacoesFiltradas = [];
        const remetentesMap = new Map();

        todasNotificacoes.forEach((notif) => {
          const remetenteId = notif.remetente_id || notif.usuario_id || notif.id;
          const existente = remetentesMap.get(remetenteId);

          if (!existente || (notif.created_at && existente.created_at && new Date(notif.created_at) > new Date(existente.created_at))) {
            remetentesMap.set(remetenteId, notif);
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



    // Responder solicitação de amizade
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

        setNotificacoes(prev => prev.filter(n => n.id !== id));
      } catch (error) {
        console.error('Erro ao responder solicitação:', error);
        alert('Erro ao responder solicitação.');
      }
    };

    // Responder convite para compartilhar canal
  const responderCompartilhamento = async (id, acao) => {
    try {
      const response = await fetch('https://apidoubts.dev.vilhena.ifro.edu.br/responder_compartilhamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ id, acao })
      });

      const data = await response.json();

      if (acao === 'aceitar') {
        if (data.ja_participa) {
          alert(data.mensagem || 'Você já participa deste canal.');
        } else {
          alert(data.mensagem || 'Você entrou no canal.');
          if (data.canal_id) {
            router.push(`/componentes/canais/${data.canal_id}`);
          }
        }
      } else {
        alert(data.mensagem || 'Convite ignorado.');
      }

      // Remover notificação após ação
      setNotificacoes(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Erro ao responder compartilhamento:', error);
      alert('Erro ao responder convite do canal.');
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
            <Link href="/componentes/confignotificaoes">
              <Image src="/engrenagem.png" alt="Configurações" width={40} height={40} className={styles.img_t} />
            </Link>
            <Link href="/componentes/notificacaoes">
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
                    {notificacao.tipo === 'compartilhamento_canal' && (
    <div className={styles.botoes}>
      <button
        className={styles.aceitar}
        onClick={() => responderCompartilhamento(notificacao.id, 'aceitar')}
      >
        Entrar
      </button>
      <button
        className={styles.recusar}
        onClick={() => responderCompartilhamento(notificacao.id, 'recusar')}
      >
        Ignorar
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
