# VitalWatch — Intelligent Patient Monitoring & Early-Warning Platform

A modern, production-quality healthcare web platform built with React, Vite, Tailwind CSS, and Lucide React. VitalWatch helps hospital staff monitor vital-sign trends, detect potential deterioration early, and improve patient safety through explainable alerts and role-based workflows.

---

## 🏥 Platform Highlights

- **Explainable Early-Warning Telemetry:** Real-time simulated ECG waveform, vital signs (HR, SpO₂, Blood Pressure, Temperature), NEWS2 risk scoring, and transparent trigger factors.
- **Role-Based Hospital Access:**
  - **Receptionist Portal (`/login/receptionist`):** For patient registration, bed assignment, and admissions.
  - **Nurse / Caretaker Portal (`/login/caretaker`):** For clinical observation, patient telemetry, and alert triage.
- **Accessible Role Selection Modal:** Modal with Escape key closing, backdrop dismiss, and keyboard accessibility.
- **Minimalist Hospital SaaS Aesthetic:** Custom color palette (`#16845B`, `#105C43`, `#EAF7F0`, `#F7FAF8`), Inter typography, subtle animations, and zero visual clutter.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 📁 Project Architecture

```text
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Logo.jsx               # Shield & heartbeat SVG brand logo
│   │   ├── Header.jsx             # Sticky navigation & staff login trigger
│   │   ├── LoginModal.jsx         # Role-selection modal (Receptionist / Caretaker)
│   │   ├── Hero.jsx               # Value proposition & trust badges
│   │   ├── DashboardPreview.jsx   # Live telemetry, ECG wave & explainable alert
│   │   ├── Features.jsx           # 6 core hospital capability cards
│   │   ├── HowItWorks.jsx         # 3-step numbered hospital workflow
│   │   ├── PatientSafety.jsx      # Clinical decision-support & safety principles
│   │   └── Footer.jsx             # Platform links, security notes & disclaimers
│   ├── pages/
│   │   ├── Home.jsx               # Landing page assembly
│   │   ├── ReceptionistLogin.jsx  # Reception & admissions authentication UI
│   │   └── CaretakerLogin.jsx     # Clinical caretaker & nurse authentication UI
│   ├── App.jsx                    # React Router configuration & scroll handling
│   ├── main.jsx                   # React root mount
│   └── index.css                  # Tailwind CSS theme & animation styles
├── package.json
└── .env.example
```
