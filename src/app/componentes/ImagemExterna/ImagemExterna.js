'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ImagemExterna({ src, alt, width, height, className, style, fallback }) {
  const [erro, setErro] = useState(false);

  if (erro) {
    return (
      <Image
        src={fallback || '/default.png'}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
        unoptimized
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      onError={() => setErro(true)}
      unoptimized
    />
  );
}


