import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Briefcase, BarChart3, LayoutDashboard, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Briefcase, label: 'Opportunities', path: '/admin/opportunities' },
    { icon: BarChart3, label: 'Stats', path: '/admin/stats' }
  ];

  return (
    <div className="bg-indigo-800 text-white w-64 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out flex flex-col justify-between h-full">

      {/* Top section - Logo and navigation */}
      <div>
        <div className="flex items-center space-x-2 px-4 mb-8">
          <LayoutDashboard className="h-8 w-8" />
          <span className="text-2xl font-semibold">Admin Panel</span>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${
                  isActive
                    ? 'bg-indigo-900 text-white'
                    : 'text-indigo-100 hover:bg-indigo-700'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom section - User info and logout */}
      <div className="mt-auto pb-4 px-4">
        <div className="pt-4 border-t border-indigo-700">
          <div className="flex items-center space-x-2 mb-4">
            <User className="h-5 w-5 text-indigo-200" />
            <span className="text-indigo-100">{user?.name}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 w-full text-indigo-100 hover:text-white py-2 px-4 rounded transition duration-200 hover:bg-indigo-700"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;