/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'apidoubts.dev.vilhena.ifro.edu.br',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'apidoubts.dev.vilhena.ifro.edu.br',
        pathname: '/uploads_canais/**',
      },
      {
        protocol: 'https',
        hostname: 'apidoubts.dev.vilhena.ifro.edu.br',
        pathname: '/uploads_mensagens/**',
      },
    ],
  },
};

export default nextConfig;
