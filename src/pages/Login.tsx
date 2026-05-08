import React, { useState } from 'react';
import { Layout, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../store/AuthContext';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(response.data.token, response.data.user);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0f172a] relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-md w-full glass-morphism p-8 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 premium-gradient rounded-xl flex items-center justify-center shadow-lg mb-4">
            <Layout className="text-white w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-slate-400 mt-2">Enter your credentials to access Taskrix</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-all"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm px-1">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
              <input type="checkbox" className="rounded border-white/10 bg-white/5" />
              Remember me
            </label>
            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-8">
          Don't have an account? {' '}
          <Link to="/register" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
