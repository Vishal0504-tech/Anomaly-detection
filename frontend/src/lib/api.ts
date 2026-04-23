export const API_BASE_URL = 'http://localhost:8000';

export interface Business {
  business_id: string;
  name: string;
  industry: string;
  turnover: number;
  electricity_usage: number;
  employee_count: number;
  is_anomaly: number;
  risk_score: number;
  explanation: string;
  risk_breakdown?: {
    electricity: number;
    employment: number;
    revenue_consistency: number;
  };
  industry_averages?: {
    turnover: number;
    electricity_usage: number;
    employee_count: number;
  };
}

export interface Analytics {
  summary: {
    total_businesses: number;
    total_anomalies: number;
    anomaly_rate: number;
    avg_risk: number;
  };
  industry_data: Array<{
    industry: string;
    count: number;
    anomalies: number;
  }>;
  risk_distribution: Array<{
    level: string;
    count: number;
  }>;
}

export async function fetchBusinesses(industry?: string, minRisk?: number): Promise<Business[]> {
  const url = new URL(`${API_BASE_URL}/businesses`);
  if (industry) url.searchParams.append('industry', industry);
  if (minRisk) url.searchParams.append('min_risk', minRisk.toString());
  
  const res = await fetch(url.toString());
  return res.json();
}

export async function fetchBusiness(id: string): Promise<Business> {
  const res = await fetch(`${API_BASE_URL}/business/${id}`);
  if (!res.ok) throw new Error('Business not found');
  return res.json();
}

export async function fetchAnomalies(): Promise<Business[]> {
  const res = await fetch(`${API_BASE_URL}/anomalies`);
  return res.json();
}

export async function fetchAnalytics(): Promise<Analytics> {
  const res = await fetch(`${API_BASE_URL}/analytics`);
  return res.json();
}
