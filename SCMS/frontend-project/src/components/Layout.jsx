import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, Package, Truck, PackageCheck,
  BarChart3, LogOut, Menu, X, Sun, Moon,
  ChevronRight, Bell, User
} from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/suppliers', icon: Package, label: 'Suppliers' },
  { to: '/shipments', icon: Truck, label: 'Shipments' },
  { to: '/deliveries', icon: PackageCheck, label: 'Deliveries' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 dark:bg-slate-950 border-r border-slate-800
        transform transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/30">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">SupplyNet</h1>
              <p className="text-slate-400 text-xs font-mono mt-0.5">SCMS v1.0</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm">{label}</span>
              <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-800/50 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-600/30 border border-brand-500/30 flex items-center justify-center">
              <User className="w-4 h-4 text-brand-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.username}</p>
              <p className="text-slate-400 text-xs truncate">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 flex items-center px-4 lg:px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          <button
            onClick={toggle}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title={dark ? 'Light mode' : 'Dark mode'}
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="relative">
            <button className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              <Bell className="w-5 h-5" />
            </button>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-500 border-2 border-white dark:border-slate-900"></span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800">
            <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{user?.username}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 animate-fade-in">
          <Outlet />
        </main>

        <footer className="text-center py-4 text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200 dark:border-slate-800">
          © 2026 SupplyNet Ltd — Musanze District, Northern Province, Rwanda
        </footer>
      </div>
    </div>
  );
}
