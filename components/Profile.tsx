import React from 'react';
import { UserProfile } from '../types';
import { User, Trophy, Clock, Package, Grid } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ProfileProps {
  user: UserProfile;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  // Stats for the chart
  const itemTypeStats = user.inventory.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.keys(itemTypeStats).map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: itemTypeStats[key],
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

  return (
    <div className="h-full bg-slate-50 p-6 sm:p-10 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center shadow-inner">
            <span className="text-4xl font-bold text-white">{user.username.charAt(0).toUpperCase()}</span>
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-slate-800">{user.username}</h1>
            <p className="text-slate-500 mt-1 flex items-center justify-center md:justify-start gap-2">
              <Clock size={16} /> Joined {new Date(user.joinedDate).toLocaleDateString()}
            </p>
            
            <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="bg-violet-50 px-4 py-2 rounded-xl border border-violet-100 flex items-center gap-3">
                <div className="bg-violet-100 p-2 rounded-lg text-violet-600">
                  <Trophy size={20} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Level</div>
                  <div className="text-xl font-bold text-slate-800">{user.level}</div>
                </div>
              </div>
              
              <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                  <Package size={20} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Items</div>
                  <div className="text-xl font-bold text-slate-800">{user.inventory.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Collection Stats */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Grid size={20} className="text-slate-400"/> Collection Distribution
            </h2>
            <div className="h-64">
              {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  No items collected yet
                </div>
              )}
            </div>
            {data.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {data.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    {entry.name} ({entry.value})
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Achievements (Static for now) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Trophy size={20} className="text-slate-400"/> Recent Achievements
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 opacity-50">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center grayscale">
                  <span className="text-2xl">🏠</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-700">First Decorator</h3>
                  <p className="text-sm text-slate-500">Place your first item</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-orange-100">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-yellow-500">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Big Spender</h3>
                  <p className="text-sm text-slate-600">Spend over 1000 coins</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
