'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  ArrowRight, 
  Download, 
  Search,
  CheckSquare,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { fetchAnomalies, Business } from '@/lib/api';

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

export default function AlertsPage() {
  const [anomalies, setAnomalies] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnomalies().then(setAnomalies).finally(() => setLoading(false));
  }, []);

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-rose-600 flex items-center gap-3">
            <ShieldAlert className="h-8 w-8" />
            Critical Enforcement Alerts
          </h1>
          <p className="text-muted-foreground">Immediate action required for high-variance business profiles.</p>
        </div>
        <button className="flex items-center rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
          <Download className="mr-2 h-4 w-4" />
          Export Dossier
        </button>
      </motion.div>

      <div className="grid gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 w-full animate-pulse rounded-2xl bg-muted/20" />
          ))
        ) : anomalies.length === 0 ? (
          <motion.div variants={item} className="glass-card flex flex-col items-center justify-center rounded-2xl p-20 text-center border-emerald-100 bg-emerald-50/20">
            <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
              <CheckSquare className="h-10 w-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-900">Zero Critical Anomalies</h3>
            <p className="text-emerald-700/70 mt-2">All scanned businesses are currently within compliant parameters.</p>
          </motion.div>
        ) : (
          anomalies.map((b) => (
            <motion.div 
              key={b.business_id} 
              variants={item}
              whileHover={{ x: 5 }}
              className="glass-card group flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl p-6 border-rose-100 hover:border-rose-400 transition-all shadow-sm hover:shadow-md bg-gradient-to-r from-card to-rose-50/30"
            >
              <div className="flex items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-inner group-hover:rotate-12 transition-transform">
                  <AlertTriangle className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold tracking-tight">{b.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono tracking-tighter">{b.business_id} • {b.industry}</p>
                  <div className="mt-3 inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-[10px] font-bold text-rose-700 uppercase tracking-widest">
                    {b.explanation.split('.')[0]}
                  </div>
                </div>
              </div>
              <div className="mt-6 sm:mt-0 flex items-center gap-8 w-full sm:w-auto justify-between border-t sm:border-t-0 pt-4 sm:pt-0">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Risk Level</p>
                  <p className="text-3xl font-black text-rose-600">{Math.round(b.risk_score)}</p>
                </div>
                <Link 
                  href={`/businesses/${b.business_id}`}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-110 transition-all"
                >
                  <ChevronRight className="h-6 w-6" />
                </Link>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
