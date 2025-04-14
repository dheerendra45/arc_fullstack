import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Briefcase, BarChart3, LayoutDashboard, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    // Close mobile sidebar when clicking outside
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('sidebar');
      if (isMobileOpen && sidebar && !sidebar.contains(event.target) && 
          !event.target.classList.contains('sidebar-toggle')) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileOpen]);

  const menuItems = [
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Briefcase, label: 'Opportunities', path: '/admin/opportunities' },
    { icon: BarChart3, label: 'Stats', path: '/admin/stats' }
  ];

  const toggleSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button 
        className="sidebar-toggle fixed top-4 left-4 z-30 md:hidden bg-indigo-800 text-white p-2 rounded-md"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`bg-indigo-800 text-white w-64 py-7 px-2 fixed inset-y-0 left-0 z-40 flex flex-col justify-between h-full transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative md:z-0`}
      >
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
                onClick={() => window.innerWidth < 768 && setIsMobileOpen(false)}
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
              <span className="text-indigo-100 truncate">{user?.name}</span>
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
      
      {/* Content padding for fixed sidebar */}
      <div className="md:ml-64"></div>
    </>
  );
};

export default Sidebar;
