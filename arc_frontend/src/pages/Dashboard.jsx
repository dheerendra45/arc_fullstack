import React from 'react';
import Sidebar from '../components/Sidebar';

import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />

        <main className="p-4 overflow-y-auto">
          <Outlet /> {/* Page content will be rendered here */}
        </main>
      </div>
    </div>
  );
}
