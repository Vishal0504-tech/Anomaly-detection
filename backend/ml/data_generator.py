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

def generate_synthetic_data(num_records=1200):
    industries = ['Manufacturing', 'Retail', 'Wholesale', 'Services', 'Logistics', 'Construction']
    
    data = []
    
    for i in range(num_records):
        business_id = generate_gstin()
        industry = random.choice(industries)
        
        # Base turnover in Lakhs (1 - 500)
        turnover = round(random.uniform(5, 500), 2)
        
        # Operational data usually scales with turnover
        # Manufacturing uses more electricity, Services use more employees relative to turnover
        
        if industry == 'Manufacturing':
            elec_mult = random.uniform(80, 150)
            emp_mult = random.uniform(0.1, 0.3)
        elif industry == 'Services':
            elec_mult = random.uniform(10, 30)
            emp_mult = random.uniform(0.5, 1.2)
        else:
            elec_mult = random.uniform(30, 70)
            emp_mult = random.uniform(0.2, 0.5)
            
        electricity = round(turnover * elec_mult + random.uniform(-10, 10), 2)
        employees = int(turnover * emp_mult + random.randint(1, 5))
        
        # Ensure non-negative
        electricity = max(5, electricity)
        employees = max(1, employees)
        
        data.append({
            'business_id': business_id,
            'name': f"Business_{i+1}",
            'industry': industry,
            'turnover': turnover,
            'electricity_usage': electricity,
            'employee_count': employees,
            'is_anomaly_manual': 0 # To track ground truth if needed
        })
    
    df = pd.DataFrame(data)
    
    # Inject Anomalies (approx 7%)
    num_anomalies = int(num_records * 0.07)
    anomaly_indices = random.sample(range(num_records), num_anomalies)
    
    for idx in anomaly_indices:
        anomaly_type = random.choice(['high_elec', 'high_emp', 'low_turnover_ghost'])
        
        if anomaly_type == 'high_elec':
            # 5x expected electricity
            df.at[idx, 'electricity_usage'] *= random.uniform(4, 8)
        elif anomaly_type == 'high_emp':
            # 4x expected employees
            df.at[idx, 'employee_count'] *= random.randint(3, 6)
        elif anomaly_type == 'low_turnover_ghost':
            # High operations but suspiciously low turnover
            df.at[idx, 'turnover'] /= random.uniform(5, 10)
            
        df.at[idx, 'is_anomaly_manual'] = 1
        
    return df

if __name__ == "__main__":
    print("Generating synthetic data...")
    df = generate_synthetic_data()
    
    output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    df.to_csv(os.path.join(output_dir, "business_data.csv"), index=False)
    print(f"Data generated successfully: {len(df)} records saved to {output_dir}/business_data.csv")
