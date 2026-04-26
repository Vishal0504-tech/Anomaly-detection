'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2, 
  IndianRupee, 
  Zap, 
  Users,
  Info,
  ShieldAlert,
  Truck,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { motion } from 'framer-motion';
import { fetchBusiness, Business } from '@/lib/api';

export default function BusinessDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusiness(id).then(setBusiness).finally(() => setLoading(false));
  }, [id]);

  if (loading || !business) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const radarData = [
    { subject: 'Electricity', A: business.electricity_usage / (business.industry_averages?.electricity_usage || 1) * 100 },
    { subject: 'Employees', A: business.employee_count / (business.industry_averages?.employee_count || 1) * 100 },
    { subject: 'Turnover', A: business.turnover / (business.industry_averages?.turnover || 1) * 100 },
    { subject: 'Logistics', A: business.freight_cost / (business.industry_averages?.freight_cost || 1) * 100 },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <Link 
        href="/businesses" 
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Business Inventory
      </Link>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{business.name}</h1>
            <div className={`flex h-6 items-center rounded-full px-2 text-[10px] font-bold uppercase tracking-wider ${
              business.is_anomaly ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {business.is_anomaly ? 'Anomaly Flagged' : 'Compliant'}
            </div>
          </div>
          <p className="mt-1 text-muted-foreground font-mono">{business.business_id} • {business.industry}</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="glass-card flex items-center gap-6 rounded-xl p-4">
          <div className="text-center">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Risk Index</p>
            <p className={`text-3xl font-bold ${
              business.risk_score > 80 ? 'text-rose-600' : 
              business.risk_score > 50 ? 'text-amber-600' : 
              'text-emerald-600'
            }`}>
              {Math.round(business.risk_score)}
            </p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="text-center">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Decision</p>
            <div className="mt-1 flex justify-center">
              {business.is_anomaly ? (
                <AlertTriangle className="h-6 w-6 text-rose-600 animate-pulse" />
              ) : (
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Metrics & Breakdown */}
        <div className="space-y-6 lg:col-span-1">
          <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Risk Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(business.risk_breakdown || {}).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="capitalize">{key.replace('_', ' ')}</span>
                    <span className="font-semibold">{Math.round(val)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${val}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full ${val > 70 ? 'bg-rose-500' : val > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className={`rounded-xl p-6 relative overflow-hidden ${
            business.is_anomaly ? 'bg-rose-50/50 border border-rose-100' : 'bg-emerald-50/50 border border-emerald-100'
          }`}>
            <div className="relative z-10">
              <h3 className={`mb-3 flex items-center text-sm font-semibold uppercase ${
                business.is_anomaly ? 'text-rose-800' : 'text-emerald-800'
              }`}>
                <Info className="mr-2 h-4 w-4" />
                Explainable AI Insights
              </h3>
              <p className={`text-sm leading-relaxed ${
                business.is_anomaly ? 'text-rose-700' : 'text-emerald-700'
              }`}>
                {business.explanation}
              </p>
            </div>
            {business.is_anomaly && (
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <ShieldAlert className="h-24 w-24 text-rose-900" />
              </div>
            )}
          </motion.div>
        </div>

        {/* Center: Benchmarking Radar */}
        <motion.div variants={itemVariants} className="glass-card rounded-xl p-6 lg:col-span-1">
          <h3 className="mb-6 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center">Industry Peer Comparison</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} />
                <Radar
                  name="Business"
                  dataKey="A"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-[10px] text-muted-foreground text-center">
            Values represent percentage (%) deviation from industry mean.
          </p>
        </motion.div>

        {/* Right: Actual Numbers */}
        <motion.div variants={itemVariants} className="glass-card rounded-xl p-6 lg:col-span-1">
          <h3 className="mb-6 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Raw Evidence</h3>
          <div className="space-y-4">
            {[
              { label: 'Revenue', value: business.turnover, icon: IndianRupee, unit: 'L' },
              { label: 'Electricity', value: business.electricity_usage, icon: Zap, unit: 'kWh' },
              { label: 'Logistics', value: business.freight_cost, icon: Truck, unit: '₹' },
              { label: 'Employees', value: business.employee_count, icon: Users, unit: '' }
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-card shadow-sm">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold font-mono">{item.value.toLocaleString()} {item.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
