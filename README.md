# 🛡️ AI-Powered GST Anomaly Detection System

A sophisticated full-stack compliance intelligence platform designed to help tax authorities identify high-risk businesses through multi-dimensional operational analysis.

## 🌟 Overview

This system goes beyond traditional rule-based audits. It uses **Unsupervised Machine Learning** to cross-reference a business's declared turnover against its real-world operational footprint (Electricity usage, Employee count, and Freight costs).

### Key Innovation
The platform identifies businesses that exhibit "Low Turnover but High Operational Activity"—a classic indicator of tax evasion or off-the-book sales.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Python 3.8+**
- **Node.js 18+**
- **npm** or **yarn**

### 2. Setup Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python api/main.py
```
> **Note:** On the first run, the system automatically generates a synthetic dataset of 1,200 businesses and trains the Isolation Forest model.

### 3. Setup Frontend (Next.js 15+)
```bash
cd frontend
npm install
npm run dev
```
Access the dashboard at [http://localhost:3000](http://localhost:3000).

---

## 🧠 Intelligence Engine

### Machine Learning Logic
- **Algorithm:** Isolation Forest (Unsupervised)
- **Features Analyzed:** 
    - `elec_ratio`: Electricity consumption per unit of turnover.
    - `emp_ratio`: Staffing levels relative to revenue.
    - `freight_ratio`: Logistics/Freight expenditure vs turnover.
    - `entity_match_score`: Fuzzy matching consistency between GST and e-Way bill records.

### Explainable AI (XAI)
Every anomaly flag comes with a human-readable explanation, such as:
> *"Electricity intensity is 5.2x higher than peers. Logistics costs are significantly above industry baseline."*

---

## 🧩 Key Features

- **Executive Dashboard:** High-level summary of total anomalies, system-wide risk distribution, and highest-risk sectors.
- **Dynamic Analytics:** Real-time correlation analysis (e.g., Turnover vs. Energy Usage) and industry benchmarking.
- **Deep Investigation:** Detailed 360° view of individual entities, including:
    - Radar chart peer comparison.
    - Risk breakdown across 5 dimensions.
    - Historical raw evidence (Revenue, Power, Logistics, Staff).
- **Compliance Workflow:** "Start Audit Loop" and "Export Analysis" features to transition from detection to enforcement.
- **Data Center (Custom Analysis):** Upload any CSV dataset to instantly analyze compliance. The system automatically retrains the AI model and updates the entire dashboard based on the uploaded data.

---

## 🏗️ Technical Architecture

### Backend (Python/FastAPI)
- **Scikit-learn:** For Isolation Forest anomaly detection.
- **Pandas/Numpy:** For feature engineering and data processing.
- **FastAPI:** High-performance REST API with automated documentation.

### Frontend (TypeScript/Next.js)
- **Tailwind CSS:** Modern, premium UI design.
- **Framer Motion:** Smooth micro-animations and transitions.
- **Recharts:** Interactive data visualizations (Radar, Scatter, Bar, Pie).
- **Lucide React:** Consistent and professional iconography.

---

## 📁 Project Structure

```text
├── backend/
│   ├── api/            # FastAPI endpoints and route logic
│   ├── data/           # CSV storage for business records
│   └── ml/             # ML model, data generator, and feature engine
└── frontend/
    ├── src/
    │   ├── app/        # Next.js App Router (Dashboard, Analytics, Alerts)
    │   ├── components/ # Reusable UI components
    │   └── lib/        # API client and type definitions
```

---

## 🔮 Future Roadmap
- [ ] **Live API Integration:** Connecting to real GSTN and Power Grid APIs.
- [ ] **Geospatial Risk Mapping:** Visualizing anomaly clusters on a geographic map.
- [ ] **Predictive Auditing:** Using historical audit outcomes to improve detection accuracy.

---

## 🧪 Testing with Sample Data

To demonstrate the system's flexibility, we have provided 5 distinct sample datasets located in `backend/data/samples/`. You can upload these in the **Data Center** to see how the AI adapts:

1.  **`dataset_low_risk.csv`**: Baseline compliant entities.
2.  **`dataset_industrial_fraud.csv`**: Focused on energy consumption anomalies in manufacturing.
3.  **`dataset_ghost_firms.csv`**: Focused on turnover/activity mismatches (Ghost Corporations).
4.  **`dataset_logistics_scams.csv`**: Focused on inflated freight costs and logistics fraud.
5.  **`dataset_extreme_outliers.csv`**: Severe multi-dimensional risk cases for stress testing.
