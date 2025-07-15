'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './page.module.css';
import axios from 'axios';
import Image from 'next/image';

const MinhaConta = () => {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fotoUrl, setFotoUrl] = useState(null);
  const [imgTimestamp, setImgTimestamp] = useState(Date.now());
  const [showEdit, setShowEdit] = useState(false);
  const [formData, setFormData] = useState({ nome: '', email: '', senhaAtual: '', novaSenha: '', confirmarSenha: '' });

  const fileInputRef = useRef(null);

  const loadUserFromLocalStorage = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      window.location.href = '/componentes/login';
    } else {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setFormData({ nome: parsed.nome, email: parsed.email, senhaAtual: '', novaSenha: '', confirmarSenha: '' });
    }
  };

  useEffect(() => {
    loadUserFromLocalStorage();
  }, []);

  useEffect(() => {
    if (!user) return;

    async function fetchFotoPerfil() {
      try {
        const response = await fetch(`https://apidoubts.dev.vilhena.ifro.edu.br/perfil/${user.id}`);

        if (response.status === 404) return;

        if (!response.ok) throw new Error('Erro ao buscar a foto');

        const data = await response.json();
        setFotoUrl(data.url);
      } catch (error) {
        console.error('Erro ao carregar foto:', error);
      }
    }

    fetchFotoPerfil();
  }, [user]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !user) return;

    const form = new FormData();
    form.append('imagem', file);
    form.append('userId', user.id);

    try {
      const response = await axios.post('https://apidoubts.dev.vilhena.ifro.edu.br/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      const data = response.data;
      const updatedUser = { ...user, foto: data.url };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setImgTimestamp(Date.now());
      alert('Foto atualizada com sucesso!');
      setFile(null);
      setPreview(null);
      fileInputRef.current.value = null;
    } catch (error) {
      alert('Erro ao enviar a imagem');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/componentes/login';
  };

  const handleEditToggle = () => setShowEdit(!showEdit);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    if (formData.novaSenha !== formData.confirmarSenha) {
      alert('As novas senhas não coincidem.');
      return;
    }

    try {
      const checkResponse = await axios.post(`https://apidoubts.dev.vilhena.ifro.edu.br/usuarios/verificar`, {
        nome: formData.nome,
        email: formData.email,
        userId: user.id
      });

      if (!checkResponse.data.disponivel) {
        alert('Nome ou email já estão em uso por outro usuário.');
        return;
      }

      const response = await axios.put(`https://apidoubts.dev.vilhena.ifro.edu.br/usuarios/${user.id}`, {
      nome: formData.nome,
      email: formData.email,
      senha: formData.novaSenha || formData.senhaAtual, // ou apenas novaSenha se preferir
    }, {
      headers: { 'Content-Type': 'application/json' },
    });


      alert('Dados atualizados com sucesso!');
      const updated = { ...user, nome: formData.nome, email: formData.email };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      setShowEdit(false);
    } catch (err) {
      alert('Erro ao atualizar dados');
    }
  };

  if (!user) return null;
  const fotoFinalUrl = fotoUrl && fotoUrl.trim() !== '' ? `${fotoUrl}?t=${imgTimestamp}` : 'https://apidoubts.dev.vilhena.ifro.edu.br/uploads/default_user.png';

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleEditToggle} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <Image src="/engrenagem.png" alt="Editar" width={25} height={25} />
          </button>
        </div>

        <img src={preview || fotoFinalUrl} alt="Foto de perfil" className={styles.profileImage} />
        <h2 className={styles.title}>Minha Conta</h2>
        <p><strong>Nome:</strong> {user.nome}</p>
        <p><strong>Email:</strong> {user.email}</p>

        <form onSubmit={handleUpload} style={{ marginTop: '20px' }}>
          <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
          {preview && (
            <>
              <img src={preview} alt="Preview" style={{ maxWidth: '100px', marginTop: '10px', borderRadius: '8px' }} />
              <br />
              <button type="submit" style={{ marginTop: '10px' }}>Enviar nova foto</button>
            </>
          )}
        </form>

        <button
          onClick={handleLogout}
          style={{ marginTop: '20px', backgroundColor: 'red', color: 'white', padding: '10px', border: 'none', borderRadius: '5px' }}
        >
          Sair da conta
        </button>

        {showEdit && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(#800080, black)',
            color: 'white',
            padding: '40px',
            borderRadius: '10px',
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            width: '400px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            alignItems: 'center'
          }}>
            <h3>Editar dados</h3>
            <label>Nome:</label>
            <input name="nome" value={formData.nome} onChange={handleChange} style={{ padding: '8px', borderRadius: '5px', border: 'none', width: '100%' }} />
            <label>Email:</label>
            <input name="email" value={formData.email} onChange={handleChange} style={{ padding: '8px', borderRadius: '5px', border: 'none', width: '100%' }} />
            <label>Senha atual:</label>
            <input name="senhaAtual" value={formData.senhaAtual} onChange={handleChange} type="password" style={{ padding: '8px', borderRadius: '5px', border: 'none', width: '100%' }} />
            <label>Nova senha:</label>
            <input name="novaSenha" value={formData.novaSenha} onChange={handleChange} type="password" style={{ padding: '8px', borderRadius: '5px', border: 'none', width: '100%' }} />
            <label>Confirmar nova senha:</label>
            <input name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} type="password" style={{ padding: '8px', borderRadius: '5px', border: 'none', width: '100%' }} />
            <button onClick={handleSaveChanges} style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', width: '100%' }}>Salvar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinhaConta;
