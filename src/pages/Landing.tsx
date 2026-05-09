import React from 'react';
import { Layout, CheckSquare, Plus, Users, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="bg-[#0f172a] min-h-screen text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Blobs - Fixed */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
      </div>

      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 w-full z-50 bg-[#0f172a]/60 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center p-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Layout className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Taskrix</span>
          </div>
          <div className="flex gap-6 items-center">
            <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-6">Sign Up</Link>
          </div>
        </div>
      </motion.nav>

      <div className="relative z-10 flex flex-col items-center">

      <main className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-20 px-6">
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
            A high-performance task management ecosystem designed for speed and precision. 
            Built with real-time sync and a fluid kanban interface.
          </p>
          <div className="flex gap-4">
            <Link to="/register" className="btn-primary flex items-center gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="glass-morphism px-8 py-3 font-semibold hover:bg-white/5 transition-all text-white"
            >
              Learn More
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
              { icon: <CheckSquare className="text-emerald-400" />, title: "Implement Auth Flow", status: "Done" },
              { icon: <Clock className="text-cyan-400" />, title: "Configure BullMQ Workers", status: "In Progress" },
              { icon: <Users className="text-indigo-400" />, title: "Team Dashboard UI", status: "Todo" },
            ].map((task, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  {task.icon}
                  <span className="font-medium">{task.title}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${
                  task.status === 'Done' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 
                  task.status === 'In Progress' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/20' : 'bg-slate-500/20 text-slate-400 border-slate-500/20'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
          
          <div className="absolute -top-4 -right-4 w-24 h-24 premium-gradient rounded-full blur-[40px] opacity-30" />
        </motion.div>
      </main>

      {/* Features Section */}
      <section id="features" className="max-w-7xl w-full mx-auto px-6 mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 scroll-mt-24">
        {[
          { 
            icon: <Clock className="text-indigo-400 w-6 h-6" />, 
            title: "Real-time Sync", 
            desc: "Tasks update instantly across all devices using high-performance websocket architecture." 
          },
          { 
            icon: <Users className="text-purple-400 w-6 h-6" />, 
            title: "Team Collaboration", 
            desc: "Invite members, assign roles, and track progress with precision-built team dashboards." 
          },
          { 
            icon: <Layout className="text-pink-400 w-6 h-6" />, 
            title: "Smart Analytics", 
            desc: "Generate background reports and visualize your team's velocity with built-in analytics." 
          }
        ].map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-morphism p-8 border-white/5 hover:border-indigo-500/30 transition-all group"
          >
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Landing Footer */}
      <footer className="w-full max-w-7xl mx-auto p-6 mt-32 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-12">
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
          <div className="flex gap-4 text-xs mt-2 text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
          <p className="text-[10px] mt-1 text-slate-700">© 2024 Taskrix Labs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  </div>
  );
};

export default Landing;
