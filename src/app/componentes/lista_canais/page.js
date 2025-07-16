  "use client";

  import { useEffect, useState, useRef} from "react";
  import Image from "next/image";
  import Link from "next/link";
  import styles from "./page.module.css";
  import { useRouter } from "next/navigation";
  import ImagemExterna from '../ImagemExterna/ImagemExterna';



  export default function Sidebar() {
    const [mensagem, setMensagem] = useState("");
    const [imagem, setImagem] = useState(null);
    const [mensagens, setMensagens] = useState([]);
    const [mostrarMais, setMostrarMais] = useState(false);
    const [canais, setCanais] = useState([]);
    const [canalSelecionado, setCanalSelecionado] = useState(null);
    const [mostrarMenuCanal, setMostrarMenuCanal] = useState(false);
    const [userId, setUserId] = useState(null);
    const [editandoId, setEditandoId] = useState(null);
    const [novoTexto, setNovoTexto] = useState("");
    const [menuAbertoId, setMenuAbertoId] = useState(null);
    const [mostrarCompartilhar, setMostrarCompartilhar] = useState(false);
    const [amigos, setAmigos] = useState([]);
    const [amigosSelecionados, setAmigosSelecionados] = useState([]);




    const router = useRouter();


  const menuRef = useRef(null);

  const buscarAmigos = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("https://apidoubts.dev.vilhena.ifro.edu.br/amizade/amigos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAmigos(data);
    } catch (err) {
      console.error("Erro ao buscar amigos:", err);
    }
  };




  useEffect(() => {
    function handleClickFora(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAbertoId(null);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.id);

        fetch("https://apidoubts.dev.vilhena.ifro.edu.br/meus_canais", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            const canaisComImagem = data.map((canal) => ({
              ...canal,
              imagem: `https://apidoubts.dev.vilhena.ifro.edu.br/uploads_canais/${canal.foto_url || "default_canal.png"}`,
            }));
            setCanais(canaisComImagem);

            const canalSalvo = localStorage.getItem("canalSelecionado");
            if (canalSalvo) {
              const canalObj = JSON.parse(canalSalvo);
              const canalExistente = canaisComImagem.find((c) => c.id === canalObj.id);
              if (canalExistente) {
                setCanalSelecionado(canalExistente);
                buscarMensagens(canalExistente.id);
              }
            }
          })
          .catch((err) => console.error("Erro ao buscar canais:", err));
      }
    }, []);

    useEffect(() => {
      if (!canalSelecionado) return;

      const intervalo = setInterval(() => {
        buscarMensagens(canalSelecionado.id);
      }, 2000); // 2 segundos

      return () => clearInterval(intervalo);
    }, [canalSelecionado]);

    const buscarMensagens = async (canalId) => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`https://apidoubts.dev.vilhena.ifro.edu.br/canais/${canalId}/mensagens`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMensagens(data);
      } catch (err) {
        console.error("Erro ao buscar mensagens:", err);
      }
    };

    const selecionarCanal = (canal) => {
      setCanalSelecionado(canal);
      localStorage.setItem("canalSelecionado", JSON.stringify(canal));
      buscarMensagens(canal.id);
    };

    const enviarMensagem = async () => {
      if (!mensagem.trim() && !imagem) return;
      if (!canalSelecionado) return;

      const token = localStorage.getItem("token");
      if (!token) return;

      const formData = new FormData();
      formData.append("mensagem", mensagem);
      if (imagem) formData.append("imagem", imagem);

      try {
        const res = await fetch(`https://apidoubts.dev.vilhena.ifro.edu.br/canais/${canalSelecionado.id}/mensagem`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!res.ok) throw new Error("Erro ao enviar mensagem");

        setMensagem("");
        setImagem(null);
        buscarMensagens(canalSelecionado.id);
      } catch (err) {
        console.error("Erro ao enviar:", err);
        alert("Erro ao enviar mensagem.");
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter") enviarMensagem();
    };

    const canaisParaMostrar = canais.length > 2 && !mostrarMais ? canais.slice(0, 2) : canais;
    const mostrarBotao = canais.length > 2;

    return (
      <div className={styles.divPrincipal}>
        <div className={styles.topBar}>
          {canalSelecionado ? (
            <>
              <div className={styles.topBarContent}>
                <img
                  src={canalSelecionado.imagem}
                  alt={canalSelecionado.nome}
                  className={styles.topBarImage}
                  onError={(e) => {
                    e.target.src = "https://apidoubts.dev.vilhena.ifro.edu.br/uploads_canais/default_canal.png";
                  }}
                />
                <h2 className={styles.topBarTitle}>{canalSelecionado.nome}</h2>
              </div>
              <div className={styles.topBarGear} onClick={() => setMostrarMenuCanal(!mostrarMenuCanal)}>
                <Image src="/engrenagem.png" alt="Config" width={30} height={30} />
              </div>
            </>
          ) : (
            <div className={styles.topBarContent}>
              <p style={{ color: "#ccc" }}>Nenhum canal selecionado</p>
            </div>
          )}

          {mostrarMenuCanal && canalSelecionado && (
            <div className={styles.menuCanal}>
              <div className={styles.menuCanalContent}>
  <img
    src={canalSelecionado.imagem}
    alt="Canal"
    width={100}
    height={100}
    className={styles.menuImagem}
  />

                <h3 className={styles.menuNome}>{canalSelecionado.nome}</h3>
                <p className={styles.menuDescricao}>{canalSelecionado.descricao || "Sem descrição"}</p>

                {/* Botão Sair do Canal */}
                <button
                  className={styles.menuBotaoSair}
                  onClick={async () => {
                    const token = localStorage.getItem("token");
                    if (!token || !canalSelecionado) return;

                    try {
                      const res = await fetch(`https://apidoubts.dev.vilhena.ifro.edu.br/sair_canal/${canalSelecionado.id}`, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` },
                      });

                      if (res.status === 204) {
                        const novaLista = canais.filter(c => c.id !== canalSelecionado.id);
                        setCanais(novaLista);
                        setCanalSelecionado(novaLista[0] || null);
                        setMostrarMenuCanal(false);
                        localStorage.removeItem("canalSelecionado");
                        if (novaLista[0]) {
                          localStorage.setItem("canalSelecionado", JSON.stringify(novaLista[0]));
                          buscarMensagens(novaLista[0].id);
                        } else {
                          setMensagens([]);
                        }
                      } else {
                        alert("Erro ao sair do canal.");
                      }
                    } catch (err) {
                      console.error("Erro ao sair do canal:", err);
                      alert("Erro na requisição ao sair do canal.");
                    }
                  }}
                >
                  Sair do Canal
                </button>

                {/* Botão Deletar Canal - somente para o criador */}
                {canalSelecionado.usuario_criador_id === userId && (
                  <button
                    className={styles.menuBotaoDeletar}
                    onClick={async () => {
                      const confirmar = confirm("Tem certeza que deseja deletar este canal?");
                      if (!confirmar) return;

                      const token = localStorage.getItem("token");
                      try {
                        const res = await fetch(`https://apidoubts.dev.vilhena.ifro.edu.br/canais/${canalSelecionado.id}`, {
                          method: "DELETE",
                          headers: { Authorization: `Bearer ${token}` },
                        });

                        if (res.ok) {
                          const novaLista = canais.filter(c => c.id !== canalSelecionado.id);
                          setCanais(novaLista);
                          setCanalSelecionado(novaLista[0] || null);
                          setMensagens([]);
                          localStorage.removeItem("canalSelecionado");
                        } else {
                          alert("Erro ao deletar canal");
                        }
                      } catch (err) {
                        console.error("Erro ao deletar canal:", err);
                        alert("Erro interno");
                      }
                    }}
                  >
                    Deletar Canal
                  </button>
                  
                )}
                <button
    className={styles.menuBotaoCompartilhar}
    onClick={() => {
      setMostrarCompartilhar(true);
      buscarAmigos();
    }}
  >
    Compartilhar Canal
  </button>
  {mostrarCompartilhar && (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Compartilhar canal com amigos</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
    {amigos.map((amigo) => (
      <li
        key={amigo.id}
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
          gap: "10px",
          backgroundColor: "#222",
          padding: "8px",
          borderRadius: "8px",
        }}
      >
        <input
          type="checkbox"
          checked={amigosSelecionados.includes(amigo.id)}
          onChange={(e) => {
            const atualizado = e.target.checked
              ? [...amigosSelecionados, amigo.id]
              : amigosSelecionados.filter((id) => id !== amigo.id);
            setAmigosSelecionados(atualizado);
          }}
        />
        <img
          src={`https://apidoubts.dev.vilhena.ifro.edu.br/uploads/${amigo.foto_url || "default_user.png"}`}
          alt={`Foto de ${amigo.nome}`}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.target.src = "https://apidoubts.dev.vilhena.ifro.edu.br/uploads/default_user.png";
          }}
        />
        <span style={{ color: "white" }}>{amigo.nome}</span>
      </li>
    ))}
  </ul>

<button
  onClick={async () => {
    if (amigosSelecionados.length === 0) {
      alert("Selecione pelo menos um amigo para compartilhar.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      for (const destinatarioId of amigosSelecionados) {
        const res = await fetch(`https://apidoubts.dev.vilhena.ifro.edu.br/compartilhar_canal`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
    body: JSON.stringify({
      canalId: canalSelecionado.id,
      paraId: destinatarioId,
      mensagem: `Convite para o canal ${canalSelecionado.nome}`,
    }),
        });

        if (!res.ok) {
          const erro = await res.text();
          throw new Error(erro);
        }
      }
      alert("Convites enviados com sucesso!");
      setMostrarCompartilhar(false);
      setAmigosSelecionados([]);
    } catch (err) {
      console.error("Erro ao enviar convites:", err);
      alert("Erro ao compartilhar canal.");
    }
  }}

  disabled={amigosSelecionados.length === 0}
  style={{
    backgroundColor: amigosSelecionados.length === 0 ? "#999" : "#4CAF50",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: amigosSelecionados.length === 0 ? "not-allowed" : "pointer",
    marginTop: "10px",
  }}
>
  Enviar Convite
</button>


        <button
    onClick={() => setMostrarCompartilhar(false)}
    style={{
      marginTop: "10px",
      marginLeft: "5px",
      backgroundColor: "red",
      color: "white",
      padding: "8px 16px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    }}
  >
    Cancelar
  </button>

      </div>
    </div>
  )}

              </div>
            </div>
          )}
        </div>

        <div className={styles.conteinerLateral}>
          <h1>Canais</h1>

          <div
            className={styles.listaCanais}
            style={{
              maxHeight: canais.length > 4 ? "300px" : "auto",
              overflowY: canais.length > 4 ? "auto" : "visible",
            }}
          >
            {canaisParaMostrar.map((canal, index) => (
              <div key={index} className={styles.carde}>
                <button className={styles.botao} onClick={() => selecionarCanal(canal)}>
                  <div className={styles.carImg}>
                  <img
    src={canal.imagem}
    alt={canal.nome}
    className={styles.modificaImg}
    width={50}
    height={50}
    style={{ objectFit: "cover", borderRadius: "50px" }}
    onError={(e) => {
      e.target.src = "https://apidoubts.dev.vilhena.ifro.edu.br/uploads_canais/default_canal.png";
    }}
  />

                  </div>
                  <p>{canal.nome}</p>
                </button>
              </div>
            ))}
          </div>

          {mostrarBotao && (
            <button
              onClick={() => setMostrarMais(!mostrarMais)}
              className={styles.mostrarMais}
            >
              {mostrarMais ? "Mostrar Menos" : "Mostrar Mais"}
            </button>
          )}

          <Image className={styles.logo} src="/logo.jpeg" alt="Logo" width={200} height={200} />

          <div className={styles.iconeConteiner}>
            <Link href="/componentes/aparencia">
              <Image src="/engrenagem.png" alt="Configuração" className={styles.icone} width={40} height={40} />
            </Link>
            <Link href="/componentes/notificaoes">
              <Image src="/sino.png" alt="Notificações" className={styles.icone} width={40} height={40} />
            </Link>
            <Link href="/">
              <Image src="/casa.png" alt="Início" className={styles.icone} width={40} height={40} />
            </Link>
          </div>
        </div>

        <div className={styles.mensagensContainer}>
          {mensagens.map((msg, index) => (
            <div key={index} className={styles.mensagem} style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Imagem do perfil do autor */}
                <img
                  src={`https://apidoubts.dev.vilhena.ifro.edu.br/uploads/${msg.foto_url || 'default_user.png'}`}
                  alt={`Foto de ${msg.autor}`}
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://apidoubts.dev.vilhena.ifro.edu.br/uploads/default.png'; }}
                />
                <div>
                  {/* Nome do autor e horário formatado */}
                  <strong style={{ color: 'white' }}>{msg.autor}</strong>{' '}
                  <span style={{ fontSize: '12px', color: '#888' }}>
                    {new Date(msg.data_envio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div>
                    {/* Mensagem de texto */}
                    {editandoId === msg.id ? (
    <div style={{ marginTop: '5px' }}>
      <input
        type="text"
        value={novoTexto}
        onChange={(e) => setNovoTexto(e.target.value)}
        style={{ padding: '5px', width: '100%' }}
      />
  <button
    className={styles.botaoSalvar}
    onClick={async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://apidoubts.dev.vilhena.ifro.edu.br/mensagens/${msg.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ novaMensagem: novoTexto }),
      });
      if (res.ok) {
        buscarMensagens(canalSelecionado.id);
        setEditandoId(null);
        setNovoTexto("");
      } else {
        alert("Erro ao editar");
      }
    }}
  >
    Salvar
  </button>
  <button
    className={styles.botaoCancelar}
    onClick={() => setEditandoId(null)}
  >
    Cancelar
  </button>

    </div>
  ) : (
    <div>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <p style={{ margin: 0, color: 'white' }}>
      {msg.mensagem}
      {msg.data_edicao && (
        <span style={{ fontSize: "11px", color: "#888", marginLeft: "8px" }}>
          (editado às {new Date(msg.data_edicao).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })})
        </span>
      )}
    </p>

    {/* Botão de 3 pontinhos */}
    {msg.usuario_id === userId && (
      <div style={{ position: "relative" }} ref={menuRef}>
        <button
          onClick={() => setMenuAbertoId(menuAbertoId === msg.id ? null : msg.id)}
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "20px",
            cursor: "pointer",
          }}
          aria-label="Menu de opções"
        >
          ⋮
        </button>

        {menuAbertoId === msg.id && (
          <div
            style={{
              position: "absolute",
              top: "25px",
              right: 0,
              backgroundColor: "#333",
              color: "white",
              borderRadius: "5px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              zIndex: 1000,
              minWidth: "100px",
            }}
          >
            <button
              style={{
                display: "block",
                width: "100%",
                padding: "8px 12px",
                textAlign: "left",
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
              onClick={() => {
                setNovoTexto(msg.mensagem);
                setEditandoId(msg.id);
                setMenuAbertoId(null);
              }}
            >
              Editar
            </button>
            <button
              style={{
                display: "block",
                width: "100%",
                padding: "8px 12px",
                textAlign: "left",
                background: "none",
                border: "none",
                color: "red",
                cursor: "pointer",
              }}
              onClick={async () => {
                const confirmar = confirm("Tem certeza que deseja excluir?");
                if (!confirmar) return;

                const token = localStorage.getItem("token");
                const res = await fetch(`https://apidoubts.dev.vilhena.ifro.edu.br/mensagens/${msg.id}`, {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                });

                if (res.ok) {
                  buscarMensagens(canalSelecionado.id);
                  setMenuAbertoId(null);
                } else {
                  alert("Erro ao deletar mensagem");
                }
              }}
            >
              Excluir
            </button>
          </div>
        )}
      </div>
    )}
  </div>


  {msg.usuario_id === userId && (
  <div style={{ position: "relative" }} ref={menuRef}>


      {menuAbertoId === msg.id && (
        <div
          style={{
            position: "absolute",
            top: "0px",
            right: 0,
            backgroundColor: "#333",
            color: "white",
            borderRadius: "5px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            zIndex: 1000,
            minWidth: "100px",
          }}
        >
          <button
            style={{
              display: "block",
              width: "100%",
              padding: "8px 12px",
              textAlign: "left",
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => {
              setNovoTexto(msg.mensagem);
              setEditandoId(msg.id);
              setMenuAbertoId(null);
            }}
          >
            Editar
          </button>
          <button
            style={{
              display: "block",
              width: "100%",
              padding: "8px 12px",
              textAlign: "left",
              background: "none",
              border: "none",
              color: "red",
              cursor: "pointer",
            }}
            onClick={async () => {
              const confirmar = confirm("Tem certeza que deseja excluir?");
              if (!confirmar) return;

              const token = localStorage.getItem("token");
              const res = await fetch(
                `https://apidoubts.dev.vilhena.ifro.edu.br/mensagens/${msg.id}`,
                {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (res.ok) {
                buscarMensagens(canalSelecionado.id);
                setMenuAbertoId(null);
              } else {
                alert("Erro ao deletar mensagem");
              }
            }}
          >
            Excluir
          </button>
        </div>
      )}
    </div>
  )}

    </div>
  )}
      
                    {/* Imagem enviada na mensagem */}
                  {msg.imagem_url && (
  <ImagemExterna
    src={`https://apidoubts.dev.vilhena.ifro.edu.br/uploads_mensagens/${msg.imagem_url}`}
    alt="imagem da mensagem"
    width={500}
    height={300}
    style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
    fallback="/default_mensagem.png"
  />



  )}

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.menssagemBarra}>
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            className={styles.menssagemInput}
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            onKeyDown={handleKeyDown} // Use onKeyDown
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagem(e.target.files[0])}
            style={{ marginRight: "10px" }}
          />
          <button className={styles.botaoEnviar} onClick={enviarMensagem}>
            Enviar
          </button>
        </div>

  {imagem && (
    <div style={{
      margin: "10px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap: "5px"
    }}>
      <strong style={{ color: "white" }}>Imagem selecionada:</strong>
      <img
        src={URL.createObjectURL(imagem)}
        alt="preview"
        style={{ maxWidth: "200px", maxHeight: "200px", borderRadius: "10px", objectFit: "contain" }}
      />
    </div>
  )}

      </div>
    );
  }
