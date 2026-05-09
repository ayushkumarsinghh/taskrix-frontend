import React, { useEffect, useState } from 'react';
import { User, ShieldCheck, Mail, Calendar } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

const Team = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await api.get('/auth/users');
      setMembers(res.data);
    } catch (error) {
      toast.error('Failed to load team members');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Team Management</h2>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Invite Member
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-10">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            members.map((member) => (
              <div key={member.id} className="glass-morphism p-6 flex flex-col items-center text-center group hover:bg-white/[0.02] transition-all">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-lg font-bold text-white">{member.name}</h3>
                <div className="flex items-center gap-1 text-slate-400 text-sm mb-4">
                  <Mail className="w-3 h-3" /> {member.email}
                </div>
                
                <div className="w-full flex justify-between items-center pt-4 border-t border-white/5">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border ${member.role === 'ADMIN' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20' : 'bg-slate-500/20 text-slate-300 border-slate-500/20'}`}>
                    {member.role}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(member.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
  );
};

export default Team;
