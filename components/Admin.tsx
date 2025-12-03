import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, DollarSign, Package, TrendingUp } from 'lucide-react';

const Admin: React.FC = () => {
  // Mock Data
  const salesData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  const userData = [
    { name: 'Mon', users: 240 },
    { name: 'Tue', users: 139 },
    { name: 'Wed', users: 980 },
    { name: 'Thu', users: 390 },
    { name: 'Fri', users: 480 },
    { name: 'Sat', users: 380 },
    { name: 'Sun', users: 430 },
  ];

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        <span className="text-green-500 text-sm font-bold flex items-center">
          <TrendingUp size={14} className="mr-1" /> +12.5%
        </span>
      </div>
      <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{label}</h3>
      <p className="text-3xl font-extrabold text-slate-800">{value}</p>
    </div>
  );

  return (
    <div className="h-full bg-slate-50 p-6 sm:p-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-slate-500">Welcome back, Administrator.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={DollarSign} label="Total Revenue" value="$45,231" color="bg-emerald-500" />
          <StatCard icon={Users} label="Active Users" value="2,345" color="bg-blue-500" />
          <StatCard icon={Package} label="Items Sold" value="12,543" color="bg-violet-500" />
          <StatCard icon={TrendingUp} label="Avg. Session" value="24m" color="bg-orange-500" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-96">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Weekly Revenue</h3>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <ReTooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="sales" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-96">
            <h3 className="text-lg font-bold text-slate-800 mb-6">User Growth</h3>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <ReTooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={3} dot={{fill: '#8b5cf6', strokeWidth: 2, r: 4, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Table (Mock) */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[1, 2, 3, 4].map((i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">Player_{i}99</td>
                    <td className="px-6 py-4">Cloud Sofa</td>
                    <td className="px-6 py-4 text-emerald-600 font-bold">+500</td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-bold">Completed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;
