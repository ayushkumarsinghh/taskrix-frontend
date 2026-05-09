import React, { useEffect, useState } from 'react';
import { Layout, CheckSquare, Clock, User, LogOut, Search, Plus, Download, Loader2 } from 'lucide-react';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { toast } from 'react-hot-toast';
import { useSocket } from '../hooks/useSocket';
import api from '../services/api';
import CreateTaskModal from './CreateTaskModal';

const DashboardLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useSocket(user?.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Global Real-time notifications
  useEffect(() => {
    if (socket && user) {
      const eventName = `report-ready-${user.id}`;
      socket.on(eventName, (data: { message: string }) => {
        toast.success(data.message, { duration: 6000, icon: '📊' });
        setIsGeneratingReport(false);
      });
      return () => { socket.off(eventName); };
    }
  }, [socket, user]);

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      await api.get('/tasks/report');
      toast.loading('Generating your report in the background...', { id: 'report-toast' });
      setTimeout(() => toast.dismiss('report-toast'), 3000);
    } catch (error) {
      toast.error('Failed to start report generation');
      setIsGeneratingReport(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navItems = [
    { icon: <Layout className="w-5 h-5" />, label: 'Overview', path: '/dashboard' },
    { icon: <CheckSquare className="w-5 h-5" />, label: 'My Tasks', path: '/tasks' },
    { icon: <Clock className="w-5 h-5" />, label: 'Schedule', path: '/schedule' },
    { icon: <User className="w-5 h-5" />, label: 'Team', path: '/team' },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-200 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0f172a]/50 backdrop-blur-xl flex flex-col p-6 hidden lg:flex">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 premium-gradient rounded-lg flex items-center justify-center shadow-lg">
            <Layout className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Taskrix</span>
        </div>

        <nav className="space-y-1 flex-1">
          {navItems.map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={i} 
                to={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'hover:bg-white/5 text-slate-400'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all mt-auto"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="p-6 border-b border-white/5 flex justify-between items-center bg-[#080c14]/80 backdrop-blur-md z-20 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name.split(' ')[0]}!</h2>
            <p className="text-slate-500 text-sm">Here's what's happening today.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-all w-64 text-white"
              />
            </div>
            
            <button 
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
              className="flex items-center gap-2 py-2 px-4 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-slate-300 disabled:opacity-50"
            >
              {isGeneratingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Report
            </button>
            
            {isAdmin && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"
              >
                <Plus className="w-4 h-4" /> New Task
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-8 relative flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          
          {/* Footer with Small Explanation */}
          <footer className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-slate-500 pb-8">
            <div className="max-w-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 premium-gradient rounded-lg flex items-center justify-center shadow-md">
                  <Layout className="text-white w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-white tracking-tighter uppercase">Taskrix</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-400 font-medium">
                Taskrix is a high-performance task management ecosystem designed for speed and precision. 
                Built with real-time sync, background report generation, and a fluid kanban interface.
              </p>
            </div>
            
            <div className="flex flex-col md:items-end gap-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Infrastructure Status</div>
              <div className="flex items-center gap-2 text-[11px] font-bold bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full border border-emerald-500/20">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                Cloud Systems Operational
              </div>
              <div className="flex gap-4 text-xs mt-2">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
              </div>
              <p className="text-[10px] mt-1 text-slate-700">© 2024 Taskrix Labs. Version 1.0.4-prod</p>
            </div>
          </footer>
        </div>
      </main>

      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => window.location.reload()} 
      />
    </div>
  );
};

export default DashboardLayout;
