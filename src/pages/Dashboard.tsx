import React, { useEffect, useState } from 'react';
import { 
  Layout, 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  Plus, 
  LogOut, 
  User, 
  Search,
  Filter,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import CreateTaskModal from '../components/CreateTaskModal';
import { useAuth } from '../store/AuthContext';
import { toast } from 'react-hot-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  deadline: string;
  is_overdue: boolean;
}

interface Stats {
  total: number;
  overdue: number;
  completed: number;
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, overdue: 0, completed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [tasksRes, statsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/tasks/stats')
      ]);
      setTasks(tasksRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await api.patch(`/tasks/${taskId}/complete`);
      toast.success('Task marked as completed!');
      fetchData();
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE': return 'bg-green-500/20 text-green-400';
      case 'IN_PROGRESS': return 'bg-amber-500/20 text-amber-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-400';
      case 'MEDIUM': return 'text-amber-400';
      default: return 'text-blue-400';
    }
  };

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
          {[
            { icon: <Layout className="w-5 h-5" />, label: 'Overview', active: true },
            { icon: <CheckSquare className="w-5 h-5" />, label: 'My Tasks' },
            { icon: <Clock className="w-5 h-5" />, label: 'Schedule' },
            { icon: <User className="w-5 h-5" />, label: 'Team' },
          ].map((item, i) => (
            <button 
              key={i} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.active ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'hover:bg-white/5 text-slate-400'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all mt-auto"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="p-6 border-bottom border-white/5 flex justify-between items-center bg-[#080c14]/80 backdrop-blur-md sticky top-0 z-20">
          <div>
            <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name.split(' ')[0]}!</h2>
            <p className="text-slate-500 text-sm">Here's what's happening with your projects today.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-all w-64"
              />
            </div>
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

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total Tasks', value: stats.total, icon: <Layout className="text-indigo-400" />, trend: '+2 this week' },
              { label: 'Overdue', value: stats.overdue, icon: <AlertCircle className="text-red-400" />, trend: 'Needs attention', danger: true },
              { label: 'Completed', value: stats.completed, icon: <CheckSquare className="text-green-400" />, trend: '85% success rate' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="glass-morphism p-6 relative overflow-hidden group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                    {stat.icon}
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${stat.danger ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                    {stat.trend}
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
              </motion.div>
            ))}
          </div>

          {/* Task List */}
          <div className="glass-morphism overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Recent Tasks</h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"><Filter className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"><MoreVertical className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] text-slate-500 text-xs uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Task Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Deadline</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                          <span>Loading tasks...</span>
                        </div>
                      </td>
                    </tr>
                  ) : tasks.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                        No tasks found. Create one to get started!
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task) => (
                      <tr key={task.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-white font-medium mb-1">{task.title}</div>
                            <div className="text-xs text-slate-500 line-clamp-1">{task.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`flex items-center gap-2 text-sm ${getPriorityColor(task.priority)}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${task.priority === 'HIGH' ? 'bg-red-400' : task.priority === 'MEDIUM' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                            {task.priority}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-400">
                            {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {task.status !== 'DONE' && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCompleteTask(task.id);
                                }}
                                className="p-2 hover:bg-green-500/10 rounded-lg text-slate-500 hover:text-green-400 transition-colors opacity-0 group-hover:opacity-100"
                                title="Mark as Complete"
                              >
                                <CheckSquare className="w-4 h-4" />
                              </button>
                            )}
                            <button className="p-2 hover:bg-white/10 rounded-lg text-slate-500 transition-colors opacity-0 group-hover:opacity-100">
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData} 
      />
    </div>

  );
};

export default Dashboard;
