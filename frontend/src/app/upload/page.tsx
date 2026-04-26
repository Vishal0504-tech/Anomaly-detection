'use client';

import { useState } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ArrowRight,
  Database,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '@/lib/api';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ message: string; summary: any } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Only CSV files are supported.');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        setFile(null);
      } else {
        setError(data.detail || 'Upload failed');
      }
    } catch (err) {
      setError('Could not connect to the server. Make sure the backend is running.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
          <Database className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Center</h1>
          <p className="text-muted-foreground">Upload custom datasets to analyze compliance and detect anomalies.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Upload Section */}
        <div className="lg:col-span-3 space-y-6">
          <div className={`glass-card relative overflow-hidden rounded-3xl border-2 border-dashed p-12 text-center transition-all ${
            file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 z-10 cursor-pointer opacity-0"
              disabled={uploading}
            />
            
            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                {uploading ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  <Upload className="h-8 w-8" />
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-semibold">
                  {file ? file.name : 'Click or drag CSV to upload'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Supports industry standard GST transaction records (.csv)
                </p>
              </div>

              {file && !uploading && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                  className="relative z-20 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Analyze Dataset
                </motion.button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20"
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}

            {result && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-3xl p-8 border-emerald-500/20 bg-emerald-500/5"
              >
                <div className="flex items-center gap-4 mb-6 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                  <h2 className="text-2xl font-bold">Analysis Complete!</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/50 rounded-2xl p-4 border border-emerald-100">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Entities Scanned</p>
                    <p className="text-3xl font-bold">{result.summary.total_businesses}</p>
                  </div>
                  <div className="bg-white/50 rounded-2xl p-4 border border-emerald-100">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Anomalies Detected</p>
                    <p className="text-3xl font-bold text-rose-600">{result.summary.total_anomalies}</p>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <a href="/" className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 text-sm font-bold text-white hover:bg-emerald-700 transition-all">
                    View Dashboard <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href="/businesses" className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-6 py-4 text-sm font-bold text-emerald-600 hover:bg-emerald-50 transition-all">
                    Investigate Flags
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-3xl p-6 bg-muted/30">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-primary" />
              Upload Requirements
            </h3>
            <ul className="space-y-4">
              {[
                { title: 'Column Headers', desc: 'Ensure turnover, electricity_usage, employee_count exist.' },
                { title: 'Format', desc: 'File must be in .csv format with UTF-8 encoding.' },
                { title: 'Data Types', desc: 'Operational values must be numeric (floats/integers).' }
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
            <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Model Stats</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Algorithm</span>
                <span className="text-xs font-bold">Isolation Forest</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Feature Vector</span>
                <span className="text-xs font-bold">4-Dimensional</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Processing Time</span>
                <span className="text-xs font-bold">~0.4s / 1k records</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
