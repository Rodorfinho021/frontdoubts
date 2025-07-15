

'use client';
import React, { useEffect, useState, useRef } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';

const ChatInterface = () => {
  const [amigos, setAmigos] = useState([]);
  const [amigoSelecionado, setAmigoSelecionado] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [modoRemocao, setModoRemocao] = useState(false);
  const [amigosSelecionados, setAmigosSelecionados] = useState([]);

  const mensagensFimRef = useRef(null);
  const containerChatRef = useRef(null); // ref do container das mensagens
  const [scrollInicial, setScrollInicial] = useState(false);

  // Scroll para o fim normal (usado só no carregamento inicial)
  const scrollParaFim = () => {
    if (mensagensFimRef.current) {
      mensagensFimRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll ajustado para subir um pouco e mostrar penúltima mensagem
  const scrollAjustado = () => {
    if (containerChatRef.current) {
      const container = containerChatRef.current;
      const offset = 0; // Ajuste esse valor para definir o quanto sobe o scroll
      container.scrollTop = container.scrollHeight - offset;
    }
  };

  // Buscar mensagens, com flag para scroll inicial
  const buscarMensagens = async (amigoId, inicial = false) => {
    try {
      const response = await fetch(`https://apidoubts.dev.vilhena.ifro.edu.br/mensagens/amigos/${amigoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      const usuarioLogadoId = parseInt(localStorage.getItem("userId"));
      const mensagensFormatadas = data.map(msg => ({
        ...msg,
        eh_sua: msg.de_usuario_id === usuarioLogadoId
      }));

      setMensagens(mensagensFormatadas);

     if (inicial) {
  setScrollInicial(true);
}

    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  };

  // Efeito para scroll inicial (carregamento da conversa)
useEffect(() => {
  if (!containerChatRef.current) return;

  const container = containerChatRef.current;

  if (scrollInicial) {
    // Força scroll total no carregamento inicial
    container.scrollTop = container.scrollHeight;
    setScrollInicial(false);
  } else {
    // Só faz scroll automático se estiver perto do fim (100px)
    const distanciaDoFim = container.scrollHeight - container.scrollTop - container.clientHeight;
    if (distanciaDoFim < 100) {
      container.scrollTop = container.scrollHeight;
    }
  }
}, [mensagens, scrollInicial]);



  // Atualizar mensagens com polling e carregamento inicial
  useEffect(() => {
    if (!amigoSelecionado) return;

    buscarMensagens(amigoSelecionado.id, true);

    const interval = setInterval(() => {
      buscarMensagens(amigoSelecionado.id, false);
    }, 1000);

    return () => clearInterval(interval);
  }, [amigoSelecionado]);

  // Enviar mensagem e fazer scroll ajustado
  const enviarMensagem = async () => {
    if (!novaMensagem.trim()) return;
    try {
      await fetch(`https://apidoubts.dev.vilhena.ifro.edu.br/mensagens/amigos/${amigoSelecionado.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ mensagem: novaMensagem })
      });
      setNovaMensagem('');
      await buscarMensagens(amigoSelecionado.id);
      scrollAjustado(); // scroll ajustado após enviar
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  // Remover amigos selecionados
  const removerAmigosSelecionados = async () => {
    if (!confirm('Tem certeza que deseja remover os amigos selecionados?')) return;

    try {
      await Promise.all(amigosSelecionados.map(async (id) => {
        const response = await fetch(`https://apidoubts.dev.vilhena.ifro.edu.br/amizade/remover`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ amigoId: id })
        });

        if (!response.ok) {
          const erro = await response.json();
          console.error(`Erro ao remover amigo ${id}:`, erro);
          throw new Error(`Falha ao remover amigo ${id}`);
        }
      }));

      setAmigos(prev => prev.filter(amigo => !amigosSelecionados.includes(amigo.id)));
      setAmigosSelecionados([]);
      setModoRemocao(false);
    } catch (error) {
      alert('Erro ao remover um ou mais amigos. Veja o console.');
      console.error('Erro ao remover amigos:', error);
    }
  };

  // Alternar seleção de amigo para remoção
  const toggleSelecao = (id) => {
    setAmigosSelecionados(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Buscar amigos na montagem
  useEffect(() => {
    const buscarAmigos = async () => {
      try {
        const response = await fetch('https://apidoubts.dev.vilhena.ifro.edu.br/amizade/amigos', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        setAmigos(data);
      } catch (error) {
        console.error('Erro ao buscar amigos:', error);
      }
    };
    buscarAmigos();
  }, []);

  // Formatar data para timezone
  const formatarDataHora = (dataString) => {
    const data = new Date(dataString);
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Porto_Velho',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(data);
  };

  return (
    <div className={styles.bodyMain}>
      <div className={styles.leftSide}>
   <header className={styles.header}>
          <div className={styles.back}>
            <Link href="/">
              <Image src="/voltar-botao.png" alt="Voltar" width={50} height={50} className={styles.voltar_botao} />
            </Link>
            <p className={styles.p}>Amigos</p>
          </div>
          <div className={styles.icons}>
            <div className={styles.iconContainer}>
              <Link href="/componentes/notificaamizada">
                <Image src="/notificacao.png" alt="Notificações" width={55} height={55} className={styles.voltar_botao} />
              </Link>
              <Link href="/componentes/adicionaramg">
                <Image src="/mais.png" alt="Adicionar" width={55} height={55} className={styles.voltar_botao} />
              </Link>
              <Link href="../html/aparéncia.html">
                <Image src="/engrenagem.png" alt="Configurações" width={55} height={55} className={styles.voltar_botao} />
              </Link>
            </div>
          </div>
        </header>

        <input type="text" className={styles.search} placeholder="Pesquisar" />

        <div className={styles.friendsHeader}>
          <h2>Meus Amigos</h2>
          {modoRemocao ? (
            <>
              <button
                className={styles.removeFriendsActive}
                onClick={removerAmigosSelecionados}
              >
                Excluir
              </button>
              <button
                className={styles.cancelarRemocao}
                onClick={() => {
                  setModoRemocao(false);
                  setAmigosSelecionados([]);
                }}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              className={styles.removeFriends}
              onClick={() => setModoRemocao(true)}
            >
              Remover amigos
            </button>
          )}
        </div>

        <section className={styles.friends}>
          {amigos.length === 0 ? (
            <p style={{ color: 'white' }}>Você ainda não tem amigos.</p>
          ) : (
            amigos.map((amigo) => (
              <div
                key={amigo.id}
                className={styles.friend}
                onClick={() => !modoRemocao && setAmigoSelecionado(amigo)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  className={styles.imagem}
                  src={`https://apidoubts.dev.vilhena.ifro.edu.br/uploads/${amigo.foto_url || 'default_user.png'}`}
                  alt={amigo.nome}
                  width={50}
                  height={50}
                />

                <div className={styles.friendInfo}>
                  <h3>{amigo.nome}</h3>
                </div>

                {modoRemocao && (
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={amigosSelecionados.includes(amigo.id)}
                    onChange={() => toggleSelecao(amigo.id)}
                  />
                )}
              </div>
            ))
          )}
        </section>

        <footer className={styles.logo}>
          <svg width="210" height="111" viewBox="0 0 210 111" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M42.884 110H1L40.0444 1H78.3788L111.744 50.5455L96.8362 68.8392L56.372 20.0559L28.686 81.035L42.884 110Z" stroke="white" />
            <path d="M47.1433 61.979L56.372 38.3497L96.8362 81.035L151.498 20.0559L156.468 45.972L101.096 110H78.3788L47.1433 61.979Z" stroke="white" />
            <path d="M169.956 38.3497L156.468 1H209L140.85 110H121.683L169.956 38.3497Z" stroke="white" />
          </svg>
        </footer>
      </div>

      <div className={styles.rightSide}>
        {amigoSelecionado ? (
          <>
            <div className={styles.chatHeader}>
              <img
                className={styles.imagem}
                src={`https://apidoubts.dev.vilhena.ifro.edu.br/uploads/${amigoSelecionado.foto_url || 'default_user.png'}`}
                alt={amigoSelecionado.nome}
                width={50}
                height={50}
              />
              <div className={styles.chatInfo}>
                <h3 className={styles.tit}>{amigoSelecionado.nome}</h3>
              </div>
            </div>

            <div className={styles.chat} ref={containerChatRef}>
              {mensagens.map((msg, index) => (
                <div
                  key={index}
                  className={`${styles.messageBox} ${msg.eh_sua ? styles.right : styles.left}`}
                >
                  <div className={styles.messageContent}>
                    <span>{msg.mensagem}</span>
                    <span className={msg.eh_sua ? styles.messageTimestampRight : styles.messageTimestampLeft}>
                      {formatarDataHora(msg.criado_em || msg.data_envio)}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={mensagensFimRef} />
            </div>

            <div className={styles.chatFooter}>
              <input
                type="text"
                className={styles.chatFooterInput}
                placeholder="Escreva..."
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
              />
<button className={styles.botaoEnviar} onClick={enviarMensagem}>
  Enviar
</button>

            </div>
          </>
        ) : (
          <div className={styles.chatInfoVazio}>
            <p>Selecione um amigo para começar a conversar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;

