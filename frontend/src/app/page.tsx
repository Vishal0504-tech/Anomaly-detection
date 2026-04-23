'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  IndianRupee, 
  Zap, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { fetchAnalytics, Analytics } from '@/lib/api';

const COLORS = ['#10b981', '#fbbf24', '#f59e0b', '#f97316', '#ef4444'];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  // ✅ error state (VERY IMPORTANT)
  if (!data) {
    return <div className="text-center mt-20 text-red-500">Failed to load data ❌</div>;
  }

  const stats = [
    { name: 'Total Businesses', value: data.summary.total_businesses.toLocaleString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Anomalies Detected', value: data.summary.total_anomalies, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
    { name: 'Anomaly Rate', value: `${data.summary.anomaly_rate}%`, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50' },
    { name: 'Avg Risk Score', value: Math.round(data.summary.avg_risk), icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">GST Compliance Intelligence</h1>
        <p className="text-muted-foreground">AI-driven anomaly detection and risk scoring engine.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <motion.div 
            key={stat.name} 
            variants={item}
            whileHover={{ y: -5 }}
            className="glass-card group relative overflow-hidden rounded-2xl p-6 transition-all"
          >
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight">{stat.value}</p>
              </div>
              <div className={`rounded-xl p-3 transition-transform group-hover:scale-110 ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 h-24 w-24 opacity-5 transition-opacity group-hover:opacity-10">
              <stat.icon className="h-full w-full" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Industry Distribution */}
        <motion.div variants={item} className="glass-card rounded-2xl p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Industry Anomaly Index</h2>
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.industry_data}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="industry" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="anomalies" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Risk Distribution */}
        <motion.div variants={item} className="glass-card rounded-2xl p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold tracking-tight">System Risk Distribution</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.risk_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="count"
                  nameKey="level"
                >
                  {data.risk_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Real-time Insights Card */}
      <motion.div variants={item} className="relative overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground shadow-xl shadow-primary/20">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold flex items-center">
              <Zap className="mr-3 h-6 w-6 text-yellow-300" />
              Intelligence Summary
            </h2>
            <p className="max-w-2xl text-primary-foreground/80 leading-relaxed">
              The AI engine has analyzed all active GST profiles. We recommend prioritizing investigation for 
              <span className="mx-1 font-bold text-white underline decoration-yellow-300 underline-offset-4">{data.summary.total_anomalies} flagged entities</span> 
              exhibiting high operational variance.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary hover:bg-opacity-90 transition-all active:scale-95 shadow-lg">
              Start Audit Loop
            </button>
            <button className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold backdrop-blur-sm hover:bg-white/20 transition-all">
              Export Analysis
            </button>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-black/10 blur-3xl" />
      </motion.div>
    </motion.div>
  );
}
