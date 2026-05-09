import React, { useEffect, useState } from 'react';
import { CheckSquare, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: string;
}

const COLUMNS = [
  { id: 'TODO', title: 'To Do', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  { id: 'DONE', title: 'Done', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' }
] as const;

const MyTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const moveTask = async (taskId: string, newStatus: string) => {
    try {
      // Optimistic update for better "vibe"
      const previousTasks = [...tasks];
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus as any } : t));
      
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
      toast.success('Task updated');
    } catch (error) {
      toast.error('Failed to move task');
      fetchTasks(); // Revert on error
    }
  };

  const handleDragEnd = (event: any, info: any, taskId: string, currentStatus: string) => {
    // Get the element that represents the board to calculate drop position
    const board = document.getElementById('task-board');
    if (!board) return;

    const boardRect = board.getBoundingClientRect();
    const x = info.point.x - boardRect.left;
    const y = info.point.y - boardRect.top;
    
    let newStatus = currentStatus;

    // Responsive detection:
    // If board is horizontal (desktop)
    if (window.innerWidth >= 768) {
      const colWidth = boardRect.width / 3;
      if (x < colWidth) newStatus = 'TODO';
      else if (x < colWidth * 2) newStatus = 'IN_PROGRESS';
      else newStatus = 'DONE';
    } else {
      // If board is vertical (mobile)
      const colHeight = boardRect.height / 3;
      if (y < colHeight) newStatus = 'TODO';
      else if (y < colHeight * 2) newStatus = 'IN_PROGRESS';
      else newStatus = 'DONE';
    }

    if (newStatus !== currentStatus) {
      moveTask(taskId, newStatus);
    }
  };

  return (
    <div className="h-full flex flex-col">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex justify-between items-center"
        >
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">My Task Board</h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Drag tasks to change status</p>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div id="task-board" className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden min-h-[500px]">
            {COLUMNS.map((col) => {
              const columnTasks = tasks.filter(t => t.status === col.id);
              return (
                <div key={col.id} className="flex flex-col h-full bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden">
                  <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <h3 className="font-bold text-white">{col.title}</h3>
                    <motion.span 
                      key={columnTasks.length}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className={`text-xs font-bold px-2 py-0.5 rounded-full border ${col.color}`}
                    >
                      {columnTasks.length}
                    </motion.span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence mode="popLayout">
                      {columnTasks.map(task => (
                        <motion.div 
                          key={task.id}
                          layout
                          drag
                          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                          dragElastic={1}
                          dragSnapToOrigin={true}
                          onDragEnd={(e, info) => handleDragEnd(e, info, task.id, task.status)}
                          whileDrag={{ 
                            scale: 1.05, 
                            zIndex: 50,
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)",
                            cursor: 'grabbing'
                          }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          whileHover={{ y: -4, transition: { duration: 0.2 } }}
                          className="glass-morphism p-4 cursor-grab hover:border-indigo-500/50 transition-colors group active:cursor-grabbing touch-none"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-white text-sm">{task.title}</h4>
                          </div>
                          <p className="text-xs text-slate-500 mb-4 line-clamp-2">{task.description}</p>
                          
                          <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${task.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-400 border-rose-500/20' : task.priority === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border-amber-500/20' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'}`}>
                              {task.priority}
                            </span>
                            
                            <div className="flex gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {columnTasks.length === 0 && (
                      <div className="text-center text-slate-600 text-[10px] uppercase tracking-widest font-bold py-12 border-2 border-dashed border-white/5 rounded-xl">
                        Drop tasks here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
  );
};

export default MyTasks;
