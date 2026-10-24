import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] tech-canvas-bg text-[#1A1612] flex flex-col font-sans antialiased">
      <Navbar />
      <div className="flex-1 flex items-start max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
