import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { MobileBottomNav } from './MobileBottomNav';

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Sidebar (Desktop 240px + Mobile Drawer) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="lg:pl-60 flex flex-col flex-1 min-h-screen">
        <TopHeader />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 lg:pb-12 space-y-6">
          <Outlet />
        </main>

        <MobileBottomNav />
      </div>
    </div>
  );
};
