import React, { useEffect, useState } from 'react';
import { Clock, Calendar as CalendarIcon, CheckSquare } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

interface Task {
  id: string;
  title: string;
  deadline: string;
  status: string;
  priority: string;
}

const Schedule = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      // Sort tasks by deadline ascending
      const sortedTasks = res.data.sort((a: Task, b: Task) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
      setTasks(sortedTasks);
    } catch (error) {
      toast.error('Failed to load schedule');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20';
      case 'IN_PROGRESS': return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20';
      default: return 'bg-slate-500/20 text-slate-400 border border-slate-500/20';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Upcoming Schedule</h2>
        </div>

        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center text-slate-500 py-10 glass-morphism">No tasks scheduled.</div>
          ) : (
            tasks.map((task, index) => {
              const date = new Date(task.deadline);
              const isOverdue = date < new Date() && task.status !== 'DONE';
              
              return (
                <div key={task.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-[#0f172a] group-hover:border-indigo-500 text-slate-500 group-hover:text-indigo-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors z-10">
                    <Clock className="w-4 h-4" />
                  </div>
                  
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-morphism p-5 rounded-2xl border transition-all hover:scale-[1.02] cursor-pointer group-hover:border-indigo-500/30">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-bold ${isOverdue ? 'text-red-400' : 'text-white'}`}>{task.title}</h3>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded border ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <CalendarIcon className="w-4 h-4" />
                      <span className={isOverdue ? 'text-rose-400 font-medium' : ''}>
                        {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      {isOverdue && <span className="text-xs bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20 ml-2">Overdue</span>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
  );
};

export default Schedule;
