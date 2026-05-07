import React from 'react';
import { Layout, CheckSquare, Plus, Users, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0f172a] relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />

      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 w-full max-w-7xl flex justify-between items-center p-6 z-50"
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg">
            <Layout className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">Taskrix</span>
        </div>
        <div className="flex gap-6">
          <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors pt-2">Login</Link>
          <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
        </div>
      </motion.nav>

      <main className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-20">
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-6 text-white">
            Manage Tasks <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              With Precision.
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-lg leading-relaxed">
            A queue-driven task management system designed for teams that value speed, clarity, and atomic execution.
          </p>
          <div className="flex gap-4">
            <Link to="/register" className="btn-primary flex items-center gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="glass-morphism px-8 py-3 font-semibold hover:bg-white/5 transition-all">
              Documentation
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass-morphism p-8 shadow-2xl relative"
        >
          <div className="space-y-4">
            {[
              { icon: <CheckSquare className="text-green-400" />, title: "Implement Auth Flow", status: "Done" },
              { icon: <Clock className="text-amber-400" />, title: "Configure BullMQ Workers", status: "In Progress" },
              { icon: <Users className="text-blue-400" />, title: "Team Dashboard UI", status: "Todo" },
            ].map((task, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  {task.icon}
                  <span className="font-medium">{task.title}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  task.status === 'Done' ? 'bg-green-500/20 text-green-400' : 
                  task.status === 'In Progress' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
          
          <div className="absolute -top-4 -right-4 w-24 h-24 premium-gradient rounded-full blur-[40px] opacity-30" />
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;
