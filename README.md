# GST Anomaly Detection System (AI-Powered)

A full-stack application designed to help tax officers identify suspicious businesses whose declared turnover does not match their operational activity (electricity usage, employee count).

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### 2. Setup Backend
```bash
cd backend
pip install -r requirements.txt
python api/main.py
```
The backend will automatically generate a synthetic dataset and train the ML model on first run.

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Access the dashboard at [http://localhost:3000](http://localhost:3000).

## 🧩 Features
- **AI Core**: Uses Isolation Forest algorithm for unsupervised anomaly detection.
- **Explainable AI**: Provides specific reasons for risk flags.
- **Interactive Analytics**: Industry-wise benchmarking and scatter correlations.
- **SaaS UI**: Modern, responsive dashboard built with Next.js and Tailwind CSS.

## 📁 Structure
- `/backend`: FastAPI server and data processing.
- `/backend/ml`: Machine learning models and data generators.
- `/frontend`: Next.js application.

## 🛠 Tech Stack
- **Frontend**: Next.js, Tailwind CSS, Recharts, Lucide Icons.
- **Backend**: FastAPI, Pandas, Scikit-learn, Numpy.
