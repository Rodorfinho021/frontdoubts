"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Canais() {
  const router = useRouter();

  const [canais, setCanais] = useState([]);
  const [participando, setParticipando] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [confirmado, setConfirmado] = useState({});
  const [canalSelecionado, setCanalSelecionado] = useState(null);


useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/componentes/login");
    return;
  }

  const canalRecemCriado = localStorage.getItem("canalSelecionado");
  if (canalRecemCriado) {
    carregarDados(); // força atualização
    localStorage.removeItem("canalSelecionado"); // limpa para não repetir
  } else {
    carregarDados(); // carregamento normal
  }
}, []);

const carregarDados = async () => {
  const token = localStorage.getItem("token");

  const resParticipando = await fetch("https://apidoubts.dev.vilhena.ifro.edu.br/meus_canais", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const dataParticipando = await resParticipando.json();

  const canaisParticipando = dataParticipando.map((canal) => ({
    ...canal,
    imagem: `https://apidoubts.dev.vilhena.ifro.edu.br/uploads_canais/${canal.foto_url || 'default_canal.png'}`
  }));

  setParticipando(canaisParticipando);

  // Agora que temos os canais que participa, buscar todos e remover os que já participa
  const resTodos = await fetch("https://apidoubts.dev.vilhena.ifro.edu.br/canais");
  const dataTodos = await resTodos.json();

  const idsParticipando = canaisParticipando.map((c) => c.id);

  const canaisDisponiveis = dataTodos
    .filter((canal) => !idsParticipando.includes(canal.id))
    .map((canal) => ({
      ...canal,
      imagem: `https://apidoubts.dev.vilhena.ifro.edu.br/uploads_canais/${canal.foto_url || 'default_canal.png'}`
    }));

  setCanais(canaisDisponiveis);
};





const fetchCanais = async () => {
  try {
    const response = await fetch("https://apidoubts.dev.vilhena.ifro.edu.br/canais");
    const data = await response.json();

    // Exclui os canais que já está participando
    const idsParticipando = participando.map((c) => c.id);
    const canaisFiltrados = data.filter((canal) => !idsParticipando.includes(canal.id));

    // Monta o caminho das imagens
    const canaisComImagem = canaisFiltrados.map((canal) => ({
      ...canal,
      imagem: `https://apidoubts.dev.vilhena.ifro.edu.br/uploads_canais/${canal.foto_url || 'default_canal.png'}`
    }));

    setCanais(canaisComImagem);
  } catch (err) {
    console.error("Erro ao buscar canais:", err);
  }
};


const fetchCanaisParticipando = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("https://apidoubts.dev.vilhena.ifro.edu.br/meus_canais", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
const canaisComImagem = data.map((canal) => ({
  ...canal,
  imagem: `https://apidoubts.dev.vilhena.ifro.edu.br/uploads_canais/${canal.foto_url || 'default_canal.png'}`
}));
setParticipando(canaisComImagem);

};

const participarCanal = async (canal) => {
  const token = localStorage.getItem("token");
  if (!token) return alert("Faça login antes");

  try {
    const usuarioId = JSON.parse(atob(token.split('.')[1])).id;

    const response = await fetch(`https://apidoubts.dev.vilhena.ifro.edu.br/canais/${canal.id}/usuarios/${usuarioId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    if (response.ok) {
      setConfirmado(prev => ({ ...prev, [canal.id]: true }));

      // Atualiza listas para refletir a mudança
      await carregarDados();

      setTimeout(() => {
        setConfirmado(prev => ({ ...prev, [canal.id]: false }));
      }, 1500);
    } else {
      const errorData = await response.json();
      alert(errorData.message || "Erro ao participar do canal");
    }
  } catch (error) {
    console.error("Erro ao participar do canal:", error);
    alert("Erro ao participar do canal");
  }
};


const canaisFiltrados = canais.filter((canal) =>
  canal.nome.toLowerCase().includes(pesquisa.toLowerCase())
);




  return (
    <div className={styles.body}>
      <div className={styles.conteinerLateral}>
        <Image
          src="/logo.jpeg"
          alt="Image"
          width={150}
          height={150}
          className={styles.modificaImgLogo}
        />
        <div className={styles.card}>
        <button className={styles.botao} onClick={() => router.push("/componentes/criar_canais")}>
  <div className={styles.img}>
    <Image
      src="/561169.png"
      alt="Image"
      width={40}
      height={50}
      className={styles.modificaImg}
    />
  </div>
  <p>CRIAR</p>
</button>

        </div>

        <div className={styles.iconeConteiner}>
          <Link href="/componentes/confignotificaoes">
            <Image src="/simbolo-de-interface-da-roda-dentada-de-configuracao.png" alt="Configuração" className={styles.icone} width={40} height={40} />
          </Link>
          <Link href="/componentes/notificacaoes">
            <Image src="/sino.png" alt="Notificações" className={styles.icone} width={40} height={40} />
          </Link>
          <Link href="/componentes/login">
            <Image src="/casa.png" alt="Login" className={styles.icone} width={40} height={40} />
          </Link>
          <Link href="/componentes/amigos">
            <Image src="/amigos.png" alt="Amigos" className={styles.icone} width={40} height={40} />
          </Link>
        </div>
      </div>

      <div className={styles.pesquisaConteiner}>
        <input
          type="text"
          placeholder="Faça a pesquisa de canais"
          className={styles.barraPesquisa}
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
        <button type="submit" className={styles.botaoPesquisa}>
          <div className={styles.imgBotaoPesquisa}>
            <Image src="/702988.png" alt="Buscar" width={20} height={20} />
          </div>
        </button>
      </div>

      <p className={styles.pi}>
        Receba atualizações sobre o assunto do seu interesse.
        <br />
        Encontre canais que você pode participar nessa aba.
      </p>

      <div className={styles.filtrosTitulos}>
        <h2>Canais:</h2>
      </div>

      <div className={styles.filtros}>
        <div className={styles.filtrosFilhos}>
          {canaisFiltrados.map((canal) => (
            <div key={canal.id} className={styles.car}>
              <div className={styles.imgCar}>
              <img
              src={canal.imagem}
              alt={canal.nome}
              width={200}
              height={200}
              onError={(e) =>
                (e.target.src = "https://apidoubts.dev.vilhena.ifro.edu.br/uploads_canais/default_canal.png")
              }
              className={styles.imgCar}
              />

              </div>
              <h1 className={styles.n}>{canal.nome}</h1>
             <button onClick={() => participarCanal(canal)} className={styles.botaoParticipar}>
  {confirmado[canal.id] ? "✔" : "participar"}
</button>

            </div>
          ))}
        </div>
      </div>

      <div className={styles.titulo}>
        <h2>Participando:</h2>
      </div>

      <div className={styles.conteinerPai}>
        <div className={styles.conteinerFilho}>
      {participando.map((canal) => (
      <div key={canal.id} className={styles.carde}>
        <div className={styles.imgCar}>
          <img
            src={canal.imagem}
            alt={canal.nome}
            width={200}
            height={200}
            onError={(e) =>
              (e.target.src = "https://apidoubts.dev.vilhena.ifro.edu.br/uploads_canais/default_canal.png")
            }
            className={styles.imgCar}
          />
        </div>

              <h1 className={styles.nome}>{canal.nome}</h1>
<button
  className={styles.botaoAcessar}
  onClick={() => {
    localStorage.setItem("canalSelecionado", JSON.stringify(canal));
    router.push("/componentes/lista_canais");
  }}
>
  Acessar
</button>


            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
