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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/componentes/login");
    } else {
      fetchCanais();
    }
  }, []);

  const fetchCanais = async () => {
    try {
      const response = await fetch("https://apidoubts.dev.vilhena.ifro.edu.br/canais");
      const data = await response.json();
      setCanais(data);
    } catch (err) {
      console.error("Erro ao buscar canais:", err);
    }
  };

  const participarCanal = (canal) => {
    if (!participando.some((item) => item.id === canal.id)) {
      setConfirmado({ ...confirmado, [canal.id]: true });
      setTimeout(() => {
        setConfirmado((prev) => ({ ...prev, [canal.id]: false }));
        setParticipando((prev) => [...prev, canal]);
        setCanais((prev) => prev.filter((item) => item.id !== canal.id));
      }, 2000);
    }
  };

  const canaisFiltrados = canais.filter((canal) =>
    canal.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const getImagemUrl = (imagem) =>
    imagem && imagem.trim() !== ""
      ? imagem
      : "https://apidoubts.dev.vilhena.ifro.edu.br/uploads/default.png";

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
          <Link href="/componentes/aparencia">
            <Image src="/simbolo-de-interface-da-roda-dentada-de-configuracao.png" alt="Configuração" className={styles.icone} width={40} height={40} />
          </Link>
          <Link href="/componentes/notificaoes">
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
        <h2>Filtros:</h2>
      </div>

      <div className={styles.filtros}>
        <div className={styles.filtrosFilhos}>
          {canaisFiltrados.map((canal) => (
            <div key={canal.id} className={styles.car}>
              <div className={styles.imgCar}>
                <img
                  src={getImagemUrl(canal.imagem)}
                  alt={canal.nome}
                  width={200}
                  height={200}
                  onError={(e) =>
                    (e.target.src = "https://apidoubts.dev.vilhena.ifro.edu.br/uploads/default.png")
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
                  src={getImagemUrl(canal.imagem)}
                  alt={canal.nome}
                  width={200}
                  height={200}
                  onError={(e) =>
                    (e.target.src = "https://apidoubts.dev.vilhena.ifro.edu.br/uploads/default.png")
                  }
                  className={styles.imgCar}
                />
              </div>
              <h1 className={styles.nome}>{canal.nome}</h1>
              <Link href={`/componentes/lista_canais`}>
                <button className={styles.botaoAcessar}>Acessar</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
