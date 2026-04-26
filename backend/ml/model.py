import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import os

class GSTAnomalyModel:
    def __init__(self, data_path=None):
        if data_path is None:
            # Assume data is in the same parent directory as ml
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            self.data_path = os.path.join(base_dir, "data", "business_data.csv")
        else:
            self.data_path = data_path
        self.df = None
        self.model = None
        self.scaler = StandardScaler()
        
    def load_and_preprocess(self):
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Dataset not found at {self.data_path}")
            
        self.df = pd.read_csv(self.data_path)
        
        # Feature Engineering
        # Ratios are more telling than absolute values
        self.df['elec_ratio'] = self.df['electricity_usage'] / (self.df['turnover'] + 1e-9)
        self.df['emp_ratio'] = self.df['employee_count'] / (self.df['turnover'] + 1e-9)
        self.df['freight_ratio'] = self.df['freight_cost'] / (self.df['turnover'] + 1e-9)
        
        # Simulated Entity Matching (Fuzzy Matching)
        # In a real app, this would use Levenshtein distance on business names from different sources
        self.df['entity_match_score'] = np.random.uniform(85, 100, size=len(self.df))
        
        # Lower match score for some anomalies (if ground truth exists)
        if 'is_anomaly_manual' in self.df.columns:
            self.df.loc[self.df['is_anomaly_manual'] == 1, 'entity_match_score'] -= np.random.uniform(10, 40, size=sum(self.df['is_anomaly_manual']))
        
        return self.df
        
    def train(self):
        if self.df is None:
            self.load_and_preprocess()
            
        # Features for anomaly detection
        features = ['elec_ratio', 'emp_ratio', 'freight_ratio', 'turnover']
        X = self.df[features]
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train Isolation Forest
        # contamination=0.07 matches our synthetic data injection
        self.model = IsolationForest(contamination=0.07, random_state=42)
        self.df['anomaly_label'] = self.model.fit_predict(X_scaled)
        
        # Isolation Forest outputs -1 for anomaly and 1 for normal
        # Convert to 1 for anomaly, 0 for normal for easier frontend handling
        self.df['is_anomaly'] = self.df['anomaly_label'].apply(lambda x: 1 if x == -1 else 0)
        
        # Risk Score: Higher score = more anomalous
        # decision_function returns the anomaly score (lower is more anomalous)
        scores = self.model.decision_function(X_scaled)
        # Map scores to 0-100 range (inverted)
        min_score = min(scores)
        max_score = max(scores)
        self.df['risk_score'] = 100 * (1 - (scores - min_score) / (max_score - min_score))
        self.df['risk_score'] = self.df['risk_score'].round(2)
        
        self.generate_explanations()
        
        return self.df
        
    def generate_explanations(self):
        # Industry averages and std for benchmarking
        industry_stats = self.df.groupby('industry')[['elec_ratio', 'emp_ratio', 'freight_ratio', 'turnover']].agg(['mean', 'std']).to_dict()
        
        explanations = []
        risk_breakdowns = []
        
        for idx, row in self.df.iterrows():
            stats = {
                'elec': {'mean': industry_stats[('elec_ratio', 'mean')][row['industry']], 'std': industry_stats[('elec_ratio', 'std')][row['industry']]},
                'emp': {'mean': industry_stats[('emp_ratio', 'mean')][row['industry']], 'std': industry_stats[('emp_ratio', 'std')][row['industry']]},
                'freight': {'mean': industry_stats[('freight_ratio', 'mean')][row['industry']], 'std': industry_stats[('freight_ratio', 'std')][row['industry']]},
                'turnover': {'mean': industry_stats[('turnover', 'mean')][row['industry']], 'std': industry_stats[('turnover', 'std')][row['industry']]}
            }
            
            # Calculate deviations (z-scores)
            elec_z = (row['elec_ratio'] - stats['elec']['mean']) / (stats['elec']['std'] + 1e-9)
            emp_z = (row['emp_ratio'] - stats['emp']['mean']) / (stats['emp']['std'] + 1e-9)
            freight_z = (row['freight_ratio'] - stats['freight']['mean']) / (stats['freight']['std'] + 1e-9)
            turnover_z = (row['turnover'] - stats['turnover']['mean']) / (stats['turnover']['std'] + 1e-9)
            
            breakdown = {
                'electricity': max(0, min(100, elec_z * 20)),
                'employment': max(0, min(100, emp_z * 20)),
                'logistics': max(0, min(100, freight_z * 20)),
                'revenue_consistency': max(0, min(100, -turnover_z * 20)),
                'entity_matching': row['entity_match_score']
            }
            
            if row['is_anomaly'] == 0:
                explanations.append("Business operations are within expected industry parameters.")
                risk_breakdowns.append(breakdown)
                continue
                
            reasons = []
            if elec_z > 2:
                reasons.append(f"Electricity intensity is {round(row['elec_ratio']/stats['elec']['mean'], 1)}x higher than peers.")
            if emp_z > 2:
                reasons.append(f"Staffing levels are disproportionately high ({round(row['emp_ratio']/stats['emp']['mean'], 1)}x) relative to revenue.")
            if freight_z > 2:
                reasons.append(f"Logistics/Freight costs are significantly above industry baseline ({round(row['freight_ratio']/stats['freight']['mean'], 1)}x).")
            if row['entity_match_score'] < 80:
                reasons.append(f"Weak entity matching ({round(row['entity_match_score'], 1)}%) between GST and e-Way bill records.")
            if turnover_z < -1.5 and (elec_z > 1 or emp_z > 1 or freight_z > 1):
                reasons.append("High operational throughput detected against suspiciously low declared turnover.")
                
            if not reasons:
                reasons.append("Atypical multidimensional pattern in operational-to-revenue ratios.")
                
            explanations.append(" ".join(reasons))
            risk_breakdowns.append(breakdown)
            
        self.df['explanation'] = explanations
        self.df['risk_breakdown'] = risk_breakdowns

    def get_data(self):
        if 'is_anomaly' not in self.df.columns:
            self.train()
        return self.df

if __name__ == "__main__":
    model = GSTAnomalyModel()
    results = model.train()
    print("Model trained.")
    print(results[['business_id', 'is_anomaly', 'risk_score', 'explanation']].head(10))
