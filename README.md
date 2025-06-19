# 🧠 AI-Powered Medical Diagnosis System

A smart healthcare tool that uses machine learning to predict diseases based on user-input symptoms. The system features a Python backend with an ensemble ML model and a Next.js frontend for real-time predictions.

## 🚀 Features

- 🧪 **Ensemble Learning for High Accuracy**  
  Implemented a voting classifier that combines predictions from 4 machine learning algorithms for robust diagnosis.

- 🎯 **High Performance**  
  Achieved **97% accuracy**, significantly outperforming traditional models like K-Nearest Neighbors (**90% accuracy**).

- 🌐 **Real-Time Predictions**  
  Integrated the trained model into a **Next.js** web application to provide instant disease predictions based on symptoms entered by users.

## 📦 Tech Stack

- **Frontend**: Next.js
- **Backend**: Python ( FastAPI ) and Prisma
- **Machine Learning**: Voting Classifier (combining 4 algorithms)
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS, Shadcn UI


## ⚙️ Getting Started

Follow these steps to run the project locally.

### Backend Setup (Python)

```bash
cd server
pip install -r requirements.txt
python symptom_server.py

```

### Frontend Setup

```bash
npm run dev
# or
yarn dev
# or
pnpm run dev
# or
bun dev

```
