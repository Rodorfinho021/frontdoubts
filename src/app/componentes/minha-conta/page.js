'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import axios from 'axios';

const MinhaConta = () => {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fotoUrl, setFotoUrl] = useState(null);
  const [imgTimestamp, setImgTimestamp] = useState(Date.now());

  const loadUserFromLocalStorage = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      window.location.href = '/componentes/login';
    } else {
      setUser(JSON.parse(userData));
    }
  };

  useEffect(() => {
    loadUserFromLocalStorage();
  }, []);

  useEffect(() => {
    if (!user) return;

    async function fetchFotoPerfil() {
      try {
        const response = await fetch(`http://localhost:3001/perfil/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar a foto');
        }

        const data = await response.json();
        setFotoUrl(data.url); // Corrigido: usa o campo 'url' que o backend mandou
      } catch (error) {
        console.error('Erro ao carregar foto:', error);
      }
    }

    fetchFotoPerfil();
  }, [user]); // Agora depende do user

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !user) return;

    const formData = new FormData();
    formData.append('imagem', file);
    formData.append('userId', user.id);

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      const data = response.data;

      const updatedUser = { ...user, foto: data.url };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setImgTimestamp(Date.now()); // Atualiza o timestamp para forçar atualizar imagem

      alert('Foto atualizada com sucesso!');
      setFile(null);
      setPreview(null);
    } catch (error) {
      alert('Erro ao enviar a imagem');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/componentes/login';
  };

  if (!user) return null;

  const fotoFinalUrl = fotoUrl ? `${fotoUrl}?t=${imgTimestamp}` : null;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img
          src={preview || fotoFinalUrl || '/rafaela.png'} // Preview ou foto do banco, ou imagem padrão
          alt="Foto de perfil"
          className={styles.profileImage}
        />

        <h2 className={styles.title}>Minha Conta</h2>
        <p><strong>Nome:</strong> {user.nome}</p>
        <p><strong>Email:</strong> {user.email}</p>

        <form onSubmit={handleUpload} style={{ marginTop: '20px' }}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{ maxWidth: '100px', marginTop: '10px', borderRadius: '8px' }}
            />
          )}
          <br />
          <button type="submit" style={{ marginTop: '10px' }}>Enviar nova foto</button>
        </form>

        <button
          onClick={handleLogout}
          style={{
            marginTop: '20px',
            backgroundColor: 'red',
            color: 'white',
            padding: '10px',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
};

export default MinhaConta;
