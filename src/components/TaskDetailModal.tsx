import React, { useState } from 'react';
import { X, Sparkles, Loader2, Calendar, Flag, AlignLeft, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { toast } from 'react-hot-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: string;
  deadline?: string;
}

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const TaskDetailModal = ({ task, isOpen, onClose, onUpdate }: TaskDetailModalProps) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [description, setDescription] = useState(task?.description || '');

  // Reset description when task changes
  React.useEffect(() => {
    if (task) setDescription(task.description);
  }, [task]);

  if (!task) return null;

  const handleAIPlan = async () => {
    setIsAiLoading(true);
    try {
      const res = await api.post('/ai/breakdown', { 
        title: task.title, 
        description: description 
      });
      
      const newDescription = description 
        ? `${description}\n\nAI Magic Plan:\n${res.data.breakdown}` 
        : `AI Magic Plan:\n${res.data.breakdown}`;
      
      // Update locally and on server
      await api.patch(`/tasks/${task.id}`, { description: newDescription });
      setDescription(newDescription);
      toast.success('Magic plan generated and saved!');
      onUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'AI is currently offline.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-[101] p-4"
          >
            <div className="glass-morphism bg-[#111827] p-8 shadow-2xl relative border-white/10 max-h-[90vh] overflow-y-auto">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${task.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-400 border-rose-500/20' : task.priority === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border-amber-500/20' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'}`}>
                  {task.priority}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-white/5 text-slate-400 border-white/10 uppercase">
                  {task.status.replace('_', ' ')}
                </span>
              </div>

              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                {task.title}
              </h2>

              <div className="space-y-6">
                <div className="flex flex-wrap gap-6 text-sm text-slate-400 border-y border-white/5 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlignLeft className="w-4 h-4 text-indigo-400" />
                    <span>Project: Taskrix Main</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Description & AI Plan</h3>
                    <button 
                      onClick={handleAIPlan}
                      disabled={isAiLoading}
                      className="text-[11px] uppercase tracking-wider font-bold flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all disabled:opacity-50"
                    >
                      {isAiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      Regenerate Magic Plan
                    </button>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-slate-300 leading-relaxed whitespace-pre-wrap min-h-[200px]">
                    {description || "No description provided."}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                <button 
                  onClick={onClose}
                  className="px-6 py-2.5 font-semibold bg-white/5 text-white hover:bg-white/10 rounded-xl transition-all border border-white/10"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskDetailModal;
