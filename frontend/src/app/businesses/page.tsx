'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowRight, AlertTriangle, ChevronRight } from 'lucide-react';
import { fetchBusinesses, Business } from '@/lib/api';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 }
};

export default function BusinessList() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');

  useEffect(() => {
    fetchBusinesses(industryFilter).then(setBusinesses).finally(() => setLoading(false));
  }, [industryFilter]);

  const filteredBusinesses = businesses.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.business_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Inventory</h1>
          <p className="text-muted-foreground">Monitor and investigate individual compliance profiles.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search GSTIN or Name..."
              className="h-11 w-full sm:w-[300px] rounded-xl border bg-card pl-10 text-sm outline-none ring-primary/10 transition-all focus:border-primary focus:ring-4"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="h-11 rounded-xl border bg-card px-4 text-sm outline-none ring-primary/10 transition-all focus:border-primary focus:ring-4"
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
          >
            <option value="">All Industries</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Retail">Retail</option>
            <option value="Services">Services</option>
            <option value="Wholesale">Wholesale</option>
          </select>
        </div>
      </div>

      <div className="glass-card overflow-hidden rounded-2xl shadow-sm border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
              <tr>
                <th className="px-6 py-5">Entity Name & ID</th>
                <th className="px-6 py-5">Industry</th>
                <th className="px-6 py-5 text-right">Revenue (L)</th>
                <th className="px-6 py-5 text-center">Risk Index</th>
                <th className="px-6 py-5">Assessment</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={container}
              initial="hidden"
              animate="show"
              className="divide-y divide-border/50"
            >
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-6 h-16 bg-muted/5"></td>
                  </tr>
                ))
              ) : filteredBusinesses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-muted-foreground italic">
                    No matching entities found in the registry.
                  </td>
                </tr>
              ) : (
                filteredBusinesses.map((b) => (
                  <motion.tr 
                    key={b.business_id} 
                    variants={item}
                    className="group hover:bg-muted/20 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-5">
                      <div className="font-bold text-foreground group-hover:text-primary transition-colors">{b.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono tracking-tighter">{b.business_id}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
                        {b.industry}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right font-mono font-semibold text-muted-foreground">₹{b.turnover.toLocaleString()}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-xs font-bold ${
                          b.risk_score > 80 ? 'text-rose-600' :
                          b.risk_score > 50 ? 'text-amber-600' :
                          'text-emerald-600'
                        }`}>
                          {Math.round(b.risk_score)}
                        </span>
                        <div className="h-1 w-12 rounded-full bg-muted overflow-hidden">
                          <div 
                            className={`h-full ${
                              b.risk_score > 80 ? 'bg-rose-500' :
                              b.risk_score > 50 ? 'bg-amber-500' :
                              'bg-emerald-500'
                            }`}
                            style={{ width: `${b.risk_score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {b.is_anomaly ? (
                        <span className="flex items-center gap-1.5 text-rose-600 text-xs font-bold uppercase tracking-wider">
                          <AlertTriangle className="h-3.5 w-3.5 animate-bounce" />
                          Suspicious
                        </span>
                      ) : (
                        <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Verified</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link 
                        href={`/businesses/${b.business_id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20 transition-all"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
