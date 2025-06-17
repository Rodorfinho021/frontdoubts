'use client';

import { useState } from 'react';
import styles from './page.module.css';
import axios from 'axios';

const CriarCanais = () => {
  const [nomeCanal, setNomeCanal] = useState('');
  const [descricao, setDescricao] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !nomeCanal || !descricao) {
      alert('Preencha todos os campos e selecione uma imagem.');
      return;
    }

    const formData = new FormData();
    formData.append('imagem', file);
    formData.append('nome', nomeCanal);
    formData.append('descricao', descricao);

    try {
      await axios.post('http://localhost:3001/_cadastrar_canal', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });


  
      

      alert('Canal criado com sucesso!');
      // Limpar campos após o cadastro
      setNomeCanal('');
      setDescricao('');
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error('Erro ao criar canal:', error);
      alert('Erro ao criar canal');
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
