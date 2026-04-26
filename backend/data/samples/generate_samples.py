import pandas as pd
import numpy as np
import random
import os

def generate_gstin():
    state_code = str(random.randint(10, 37))
    pan = ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ', k=5)) + \
          ''.join(random.choices('0123456789', k=4)) + \
          random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    entity_code = str(random.randint(1, 9))
    check_sum = random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
    return f"{state_code}{pan}{entity_code}Z{check_sum}"

def generate_custom_set(num_records=500, anomaly_type_focus=None, anomaly_rate=0.05):
    industries = ['Manufacturing', 'Retail', 'Wholesale', 'Services', 'Logistics', 'Construction']
    data = []
    
    for i in range(num_records):
        business_id = generate_gstin()
        industry = random.choice(industries)
        turnover = round(random.uniform(10, 400), 2)
        
        # Base scaling
        elec_mult = 100 if industry == 'Manufacturing' else 30
        emp_mult = 0.8 if industry == 'Services' else 0.3
        freight_mult = 20 if industry == 'Logistics' else 5
        
        electricity = round(turnover * elec_mult + random.uniform(-5, 5), 2)
        employees = int(turnover * emp_mult + random.randint(1, 3))
        freight = round(turnover * freight_mult + random.uniform(-2, 2), 2)
        
        data.append({
            'business_id': business_id,
            'name': f"Entity_{i+1}",
            'industry': industry,
            'turnover': max(5, turnover),
            'electricity_usage': max(5, electricity),
            'employee_count': max(1, employees),
            'freight_cost': max(0, freight)
        })
    
    df = pd.DataFrame(data)
    
    # Inject Specific Anomalies
    num_anomalies = int(num_records * anomaly_rate)
    anomaly_indices = random.sample(range(num_records), num_anomalies)
    
    for idx in anomaly_indices:
        if anomaly_type_focus == 'high_elec':
            df.at[idx, 'electricity_usage'] *= 10
        elif anomaly_type_focus == 'ghost_firms':
            df.at[idx, 'turnover'] /= 20
            df.at[idx, 'electricity_usage'] = 2 # Almost zero
        elif anomaly_type_focus == 'logistics_scam':
            df.at[idx, 'freight_cost'] *= 15
        elif anomaly_type_focus == 'mixed':
            df.at[idx, random.choice(['electricity_usage', 'employee_count', 'freight_cost'])] *= 8
            
    return df

if __name__ == "__main__":
    output_dir = "backend/data/samples"
    
    sets = [
        ("dataset_low_risk.csv", "mixed", 0.01),
        ("dataset_industrial_fraud.csv", "high_elec", 0.12),
        ("dataset_ghost_firms.csv", "ghost_firms", 0.08),
        ("dataset_logistics_scams.csv", "logistics_scam", 0.10),
        ("dataset_extreme_outliers.csv", "mixed", 0.20)
    ]
    
    for filename, focus, rate in sets:
        df = generate_custom_set(anomaly_type_focus=focus, anomaly_rate=rate)
        df.to_csv(os.path.join(output_dir, filename), index=False)
        print(f"Created {filename}")
