import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header  from './Header';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden relative" style={{background:'#06090f'}}>
      {/* Neon glow backdrop orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.10] animate-float"
          style={{background:'radial-gradient(circle, #06b6d4 0%, transparent 70%)'}} />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.08] animate-float"
          style={{background:'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', animationDelay: '-7s'}} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full opacity-[0.04] animate-float"
          style={{background:'radial-gradient(circle, #a855f7 0%, transparent 70%)', animationDelay: '-13s'}} />
      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="max-w-7xl mx-auto animate-slide-up"><Outlet /></div>
        </main>
      </div>
    </div>
  );
}
