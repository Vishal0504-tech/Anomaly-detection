// ✅ Use env variable (recommended)
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://anomaly-detection-1-bpb3.onrender.com";

// ---------------- TYPES ----------------

export interface Business {
  business_id: string;
  name: string;
  industry: string;
  turnover: number;
  electricity_usage: number;
  employee_count: number;
  freight_cost: number;
  entity_match_score: number;
  is_anomaly: number;
  risk_score: number;
  explanation: string;
  risk_breakdown?: {
    electricity: number;
    employment: number;
    logistics: number;
    revenue_consistency: number;
    entity_matching: number;
  };
  industry_averages?: {
    turnover: number;
    electricity_usage: number;
    employee_count: number;
    freight_cost: number;
  };
}

export interface Analytics {
  summary: {
    total_businesses: number;
    total_anomalies: number;
    anomaly_rate: number;
    avg_risk: number;
    highest_risk_industry: string;
    correlation_factor: number;
    ai_confidence: number;
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

// ---------------- SAFE FETCH HELPER ----------------

async function safeFetch(url: string) {
  try {
    const res = await fetch(url, {
      cache: "no-store", // always fresh data
    });

    if (!res.ok) {
      console.error("API error:", res.status, url);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
}

// ---------------- API FUNCTIONS ----------------

export async function fetchBusinesses(
  industry?: string,
  minRisk?: number
): Promise<Business[]> {
  const url = new URL(`${API_BASE_URL}/businesses`);

  if (industry) url.searchParams.append("industry", industry);
  if (minRisk) url.searchParams.append("min_risk", minRisk.toString());

  const data = await safeFetch(url.toString());
  return data || []; // ✅ never crash
}

export async function fetchBusiness(id: string): Promise<Business | null> {
  const data = await safeFetch(`${API_BASE_URL}/business/${id}`);
  return data || null;
}

export async function fetchAnomalies(): Promise<Business[]> {
  const data = await safeFetch(`${API_BASE_URL}/anomalies`);
  return data || [];
}

export async function fetchAnalytics(): Promise<Analytics | null> {
  const data = await safeFetch(`${API_BASE_URL}/analytics`);
  return data || null;
}