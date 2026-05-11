import React, { useState } from 'react';
import { X, Calendar, Flag, AlignLeft, Type, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { toast } from 'react-hot-toast';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateTaskModal = ({ isOpen, onClose, onSuccess }: CreateTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [deadline, setDeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAIPlan = async () => {
    if (!title) {
      toast.error('Please enter a task title first!');
      return;
    }

    setIsAiLoading(true);
    try {
      const res = await api.post('/ai/breakdown', { title, description });
      setDescription(prev => prev ? `${prev}\n\nAI Magic Plan:\n${res.data.breakdown}` : `AI Magic Plan:\n${res.data.breakdown}`);
      toast.success('Magic plan generated!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'AI is currently offline. Check your API key.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/tasks', {
        title,
        description,
        priority,
        deadline: new Date(deadline).toISOString(),
      });
      toast.success('Task created successfully!');
      onSuccess();
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setDeadline('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[101] p-4"
          >
            <div className="glass-morphism bg-[#111827] p-8 shadow-2xl relative border-white/10">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-bold text-white mb-6">Create New Task</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Task Title</label>
                  <div className="relative">
                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter task name..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-medium text-slate-300">Description</label>
                    <button 
                      type="button"
                      onClick={handleAIPlan}
                      disabled={isAiLoading}
                      className="text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all disabled:opacity-50"
                    >
                      {isAiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      Magic Plan
                    </button>
                  </div>
                  <div className="relative">
                    <AlignLeft className="absolute left-3 top-4 w-4 h-4 text-slate-500" />
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What needs to be done?"
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600 resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Priority</label>
                    <div className="relative">
                      <Flag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <select 
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                      >
                        <option value="LOW" className="bg-[#111827]">Low</option>
                        <option value="MEDIUM" className="bg-[#111827]">Medium</option>
                        <option value="HIGH" className="bg-[#111827]">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Deadline</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="date" 
                        required
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 font-semibold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-2 btn-primary flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Task'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateTaskModal;

