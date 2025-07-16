'use client'
import React, { useState, useEffect } from "react";
import styles from "./page.module.css"; 
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

const AdicionarAmigos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usuarioLogadoId, setUsuarioLogadoId] = useState(null);
  const [amigos, setAmigos] = useState([]); // Estado para armazenar amigos

  // Pega ID do usuário logado do localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      setUsuarioLogadoId(user.id);
    }
  }, []);

  // Busca lista de amigos do usuário logado
  useEffect(() => {
    const fetchAmigos = async () => {
      try {
        const response = await axios.get('https://apidoubts.dev.vilhena.ifro.edu.br/amizade/amigos', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setAmigos(response.data); // salva a lista de amigos
      } catch (error) {
        console.error('Erro ao buscar amigos:', error);
      }
    };

    if (usuarioLogadoId) {
      fetchAmigos();
    }
  }, [usuarioLogadoId]);

  // Busca usuários filtrando por busca e removendo amigos e usuário logado
  const buscarUsuarios = async (query) => {
    try {
      setLoading(true);
      const response = await axios.get('https://apidoubts.dev.vilhena.ifro.edu.br/usuarios', {
        params: { search: query }
      });

      // Filtra para não incluir usuário logado nem amigos já adicionados
      const filtrados = response.data.filter(u => 
        u.id !== usuarioLogadoId && !amigos.some(amigo => amigo.id === u.id)
      );

      setUsuarios(filtrados);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setLoading(false);
    }
  };

  // useEffect com debounce para buscar quando searchTerm muda
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim().length > 0) {
        buscarUsuarios(searchTerm.trim());
      } else {
        setUsuarios([]); // limpa lista se campo vazio
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, amigos]); // adiciona 'amigos' para atualizar lista quando amigos mudarem

  // Função para enviar solicitação de amizade
  const adicionarAmigo = async (paraId) => {
    try {
      await axios.post('https://apidoubts.dev.vilhena.ifro.edu.br/amizade/solicitar', {
        paraId: paraId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      alert('Solicitação enviada com sucesso!');
      
      // Atualiza lista de amigos para não mostrar usuário novamente
      // Você pode optar por buscar os amigos de novo ou remover localmente:
      setAmigos(prev => [...prev, { id: paraId }]); // adiciona novo amigo provisoriamente
      setUsuarios(prev => prev.filter(u => u.id !== paraId)); // remove da lista de busca

    } catch (error) {
      console.error('Erro ao enviar solicitação de amizade:', error);
      alert('Erro ao enviar solicitação.');
    }
  };

  return (
    <section className={styles.bodyMain}>
      {/* Lado Esquerdo */}
      <section className={styles.leftSide}>
        <div>
          <svg
            className={styles.logo}
            width="100"
            height="50"
            viewBox="0 0 150 63"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M30.6007 62H1L28.5939 1H55.686L79.2662 28.7273L68.7304 38.965L40.1331 11.6643L20.5666 45.7902L30.6007 62Z"
              stroke="white"
            />
            <path
              d="M33.6109 35.1259L40.1331 21.9021L68.7304 45.7902L107.362 11.6643L110.874 26.1678L71.7406 62H55.686L33.6109 35.1259Z"
              stroke="white"
            />
            <path
              d="M120.406 21.9021L110.874 1H148L99.8362 62H86.2901L120.406 21.9021Z"
              stroke="white"
            />
          </svg>
        </div>

        <nav className={styles.menu}>
          <Link className={styles.link} href="/componentes/minha-conta">
            <p>Minha Conta</p>
          </Link>
          <Link className={styles.link} href="/componentes/notificacaoes">
            <p>Notificações</p>
          </Link>
          <Link className={styles.link} href="/componentes/confignotificaoes">
            <p>Configurações</p>
          </Link>
        </nav>

        <div className={styles.itens}>
          <Link href="/">
            <Image
              src="/casa.png"
              alt="Voltar"
              width={40}
              height={40}
              className={styles.img_t}
            />
          </Link>

          <Link href="/componentes/confignotificaoes">
            <Image
              src="/engrenagem.png"
              alt="Voltar"
              width={40}
              height={40}
              className={styles.img_t}
            />
          </Link>

          <Link href="/componentes/notificacaoes">
            <Image
              src="/sino.png"
              alt="Voltar"
              width={40}
              height={40}
              className={styles.img_t}
            />
          </Link>
        </div>
      </section>

      {/* Lado Direito */}
      <section className={styles.rightSide}>
        <div className={styles.header}>
          <h1>Adicionar amigos:</h1>
          <input
            type="text"
            className={styles.search}
            placeholder="Pesquisar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.userList}>
          {loading && <p>Carregando...</p>}

          {!loading && usuarios.length === 0 && searchTerm.trim().length > 0 && (
            <p>Nenhum usuário encontrado.</p>
          )}

          {usuarios.map((usuario) => (
            <div key={usuario.id} className={styles.userCard}>
              <div className={styles.userIcon}>
                <img
                  src={`https://apidoubts.dev.vilhena.ifro.edu.br/uploads/${usuario.foto_url || 'default_user.png'}`}
                  alt={`${usuario.nome} foto`}
                  className={styles.userPhoto}
                />
              </div>
              <div className={styles.userInfo}>
                <span>{usuario.nome}</span>
              </div>
              <button
                className={styles.addBtn}
                onClick={() => adicionarAmigo(usuario.id)}
              >
                Adicionar
              </button>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default AdicionarAmigos;
