import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import DashboardLayout from './layouts/Dashboard';
import Users from './pages/Users';
import Opportunities from './pages/Opportunities';
import Stats from './pages/Stats';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/admin" element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="users" element={<Users />} />
              <Route path="opportunities" element={<Opportunities />} />
              <Route path="stats" element={<Stats />} />
              <Route index element={<Navigate to="users" replace />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/admin/users" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;