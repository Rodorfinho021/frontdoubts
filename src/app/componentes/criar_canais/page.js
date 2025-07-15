'use client';

import { useState } from 'react';
import styles from './page.module.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';






const CriarCanais = () => {
  const router = useRouter();
  const [nomeCanal, setNomeCanal] = useState('');
  const [descricao, setDescricao] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return; // impede cliques múltiplos

  if (!file || !nomeCanal || !descricao) {
    alert('Preencha todos os campos e selecione uma imagem.');
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado para criar um canal.");
    return;
  }

  setLoading(true); // começa a carregar

  const formData = new FormData();
  formData.append('imagem', file);
  formData.append('nome', nomeCanal);
  formData.append('descricao', descricao);

  try {
    const response = await axios.post(
      'https://apidoubts.dev.vilhena.ifro.edu.br/_cadastrar_canal',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    const canalCriado = response.data;
    localStorage.setItem("canalSelecionado", JSON.stringify(canalCriado));
    router.push("https://apidoubts.dev.vilhena.ifro.edu.br/");
    
    // Limpa campos
    setNomeCanal('');
    setDescricao('');
    setFile(null);
    setPreview(null);
  } catch (error) {
    console.error('Erro ao criar canal:', error.response?.data || error.message);
    alert('Erro ao criar canal');
  } finally {
    setLoading(false); // fim do carregamento
  }
};



  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Criar Novo Canal</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome do Canal"
            value={nomeCanal}
            onChange={(e) => setNomeCanal(e.target.value)}
            className={styles.inputField}
          />

          <textarea
            placeholder="Descrição do Canal"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className={styles.textareaField}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.inputField}
          />

        <div className={styles.alinhamento}>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{ maxWidth: '100px', marginTop: '10px', borderRadius: '8px' }}
            />
          )}
        </div>
          <button type="submit" className={styles.button}>
            Criar Canal
          </button>
        </form>
      </div>
    </div>
  );
};

export default CriarCanais;
