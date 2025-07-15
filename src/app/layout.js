'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './globals.css';

export default function RootLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const rotaAtual = window.location.pathname;
    const rotasLivres = ['/componentes/login', '/componentes/casdastrar', '/componentes/trocar-senha'];

    if (rotasLivres.includes(rotaAtual)) return;

    if (!token) {
      router.push('/componentes/login');
      return;
    }

    const verificarToken = async () => {
      try {
        const res = await fetch('https://apidoubts.dev.vilhena.ifro.edu.br/verificar_token', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.warn('Token inválido ou usuário não encontrado');
          localStorage.removeItem('token');
          router.push('/componentes/login');
        }
      } catch (err) {
        console.error('Erro ao verificar token:', err);
        router.push('/componentes/login');
      }
    };

    verificarToken();
  }, []);

  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}
