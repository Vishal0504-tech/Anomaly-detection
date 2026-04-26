'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { fetchAnalytics, fetchBusinesses, Analytics, Business } from '@/lib/api';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAnalytics(), fetchBusinesses()])
      .then(([a, b]) => {
        setAnalytics(a);
        setBusinesses(b);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !analytics) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Prep scatter data
  const scatterData = businesses.map(b => ({
    x: b.turnover,
    y: b.electricity_usage,
    z: b.risk_score,
    is_anomaly: b.is_anomaly,
    name: b.name
  }));

  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Macro Analytics</h1>
        <p className="text-muted-foreground">Deep dive into industry trends and operational correlations.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Industry Anomaly Rate */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="mb-6 text-lg font-semibold">Anomaly Prevalence by Industry</h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.industry_data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="industry" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
                <Legend />
                <Bar dataKey="count" name="Total Businesses" fill="var(--muted)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="anomalies" name="Detected Anomalies" fill="var(--destructive)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Turnover vs Electricity Correlation */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="mb-6 text-lg font-semibold">Turnover vs Electricity (Correlation)</h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name="Turnover" unit=" L" />
                <YAxis type="number" dataKey="y" name="Electricity" unit=" kWh" />
                <ZAxis type="number" dataKey="z" range={[50, 400]} name="Risk" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter 
                  name="Normal" 
                  data={scatterData.filter(d => !d.is_anomaly)} 
                  fill="var(--primary)" 
                  fillOpacity={0.6}
                />
                <Scatter 
                  name="Anomalous" 
                  data={scatterData.filter(d => d.is_anomaly)} 
                  fill="var(--destructive)" 
                />
                <Legend />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h2 className="mb-4 text-lg font-semibold">Key Observations</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Highest Risk Sector</p>
            <p className="mt-1 text-lg font-bold">{analytics.summary.highest_risk_industry}</p>
            <p className="text-xs text-muted-foreground">Due to systemic operational inconsistencies.</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Correlation Factor</p>
            <p className="mt-1 text-lg font-bold">{analytics.summary.correlation_factor}</p>
            <p className="text-xs text-muted-foreground">Link between turnover and resource usage.</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">AI Confidence</p>
            <p className="mt-1 text-lg font-bold">{analytics.summary.ai_confidence}%</p>
            <p className="text-xs text-muted-foreground">Based on model precision metrics.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
