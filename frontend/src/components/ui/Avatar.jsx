import React, { useState } from 'react';

const DICEBEAR_URL = 'https://api.dicebear.com/7.x/avataaars/svg';

export default function Avatar({ name = '', avatar = '', size = 32, className = '' }) {
  const [failed, setFailed] = useState(false);
  const seed = (avatar || name || 'user').trim();
  const initial = (name || 'U').trim().charAt(0).toUpperCase();
  const src = seed.startsWith('http') || seed.startsWith('data:image')
    ? seed
    : `${DICEBEAR_URL}?seed=${encodeURIComponent(seed)}&backgroundColor=0ea5e9,8b5cf6,06b6d4,6366f1,a855f7&backgroundType=gradientLinear`;

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 text-white font-bold flex-shrink-0 ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="Avatar"
      className={`rounded-xl object-cover flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
