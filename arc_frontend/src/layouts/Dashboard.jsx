import React from 'react';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
     <main className="flex-1 pt-2 px-6 pb-6 overflow-y-auto">

        <Outlet />
      </main>
    </div>
  );
}