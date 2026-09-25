# ENERGIQ: AI-Powered Renewable Energy & Industrial Load Orchestration Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PuLP MILP](https://img.shields.io/badge/Optimization-PuLP%20MILP%20CBC-FF6F00.svg)](https://coin-or.github.io/pulp/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

---

## 1. Executive Summary & Problem Statement

Modern industrial manufacturing sites integrate on-site renewable generation (Solar PV, Wind), Battery Energy Storage Systems (BESS), complex Time-of-Use (ToU) grid contracts, and diverse industrial machine lines. While renewable generation is naturally intermittent and weather-dependent, industrial production lines have rigid schedules, tight tolerances, and non-negotiable throughput targets.

**ENERGIQ** is a hackathon-grade reference implementation of a production energy-orchestration architecture. It models behind-the-meter generation, predicts weather and machine demand profiles, tracks cyclic battery degradation, evaluates peak-demand tariff exposure, and utilizes formal **Mixed-Integer Linear Programming (MILP)** to autonomously compute optimal multi-period dispatch schedules while guaranteeing 100% feasibility for critical industrial manufacturing processes.

---

## 2. Key Capabilities & Platform Architecture

### Core Modules
1. **Executive Industrial Dashboard**: Real-time KPI matrix (Renewable Gen, Industrial Demand, Grid Net Import, BESS SOC, Curtailment, Cost/Hour, Daily Savings).
2. **Live Animated Energy Flow**: Directed Sankey-style topology showing power routing across Solar PV, BESS, Grid Substation, Central Hub, and Industrial Loads with real-time animated flow pulses.
3. **Renewable Generation Forecaster**: Multi-horizon ML pipeline (15-min, 30-min, 1-hr, 6-hr, 24-hr) with upper and lower quantile confidence intervals (10%–90%), GHI irradiance modeling, cell temperature derating, and real held-out MAE/RMSE tracking. *(Note: The model currently trains and predicts on synthetic weather data; live Open-Meteo weather API integration is provided as a real-time option).*
4. **Segmented Industrial Load Management**: Configurable load matrix modeling CNC Machining Cells (CRITICAL), Cleanroom HVAC Chiller (HIGH), Compressed Air (MEDIUM), Water Treatment Pumps (FLEXIBLE), Fleet EV Charging (FLEXIBLE), and Auxiliary UPS (MEDIUM), with safety-locked protection against arbitrary shedding of critical lines.
5. **Battery Intelligence (BESS)**: SOC circular gauge, continuous available energy estimation, round-trip efficiency (94%), cyclic degradation cost accounting (₹0.45/kWh), thermal state tracking, and projected 24-hour SOC curves.
6. **Dynamic Grid & Tariff Intelligence**: Time-of-Use (ToU) tariff ladder (Off-Peak ₹4.50, Standard ₹7.80, Peak ₹12.50), upcoming tier switch alarms, monthly demand charge penalty exposure calculator, and substation import ceiling monitoring.
7. **Formal MILP Optimization Engine**: PuLP CBC solver minimizing energy cost, peak demand charges, battery degradation, and curtailment subject to instantaneous nodal Kirchhoff energy balance, battery SOC dynamics, and production continuity constraints.
8. **Explainable AI (XAI) Recommender**: Synthesizes natural language operational justifications with quantified impacts for plant operators before execution.
9. **Interactive What-If Simulator**: Real-time scenario sandbox allowing operators to adjust renewable yield, factory demand, tariff spikes, battery reserve margins, and load flexibility, producing side-by-side BEFORE vs. AFTER impact comparisons.
10. **Predefined Industrial Stress Scenarios**: High Solar Availability, Cloudy Day, High Tariff Spike, Emergency Production Surge, Low Battery Reserve, and Constrained Substation Events.
11. **Industrial Microgrid Digital Twin**: Virtual representation of electrical busbars, line frequency (50.02 Hz), 415V RMS voltage, power factor (0.982), asset nodal efficiencies, and active SCADA operating states.
12. **Historical Analytics & Savings Audit**: Multi-timeframe auditing (Day, Week, Month) of avoided peak charges, cumulative financial savings, solar energy recovered, and forecaster accuracy trends.

---

## 3. Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (Industrial Light Control-Room Theme)
- **Data Visualization**: Recharts (ComposedChart, AreaChart, BarChart, LineChart)
- **Icons**: Lucide React
- **Animations**: CSS Keyframe Flow Animations + Framer Motion primitives

### Backend & AI/Optimization
- **Framework**: Python 3.12 + FastAPI
- **Mathematical Optimization**: PuLP CBC Mixed-Integer Linear Programming (MILP)
- **Machine Learning**: Scikit-Learn (Gradient Boosting Regressors with Quantile Regression for uncertainty bands), NumPy, Pandas
- **Validation**: Pydantic v2 Settings & Schemas
- **Database Architecture**: PostgreSQL / Supabase Schema (`backend/app/database/schema.sql`) with zero-dependency in-memory repository fallback for instant local execution.

---

## 4. Mathematical Formulation

### Objective Function
$$\min \sum_{t=1}^T \left[ C^{\text{grid}}_t \cdot (p^{\text{grid2load}}_t + p^{\text{grid2bess}}_t) \Delta t + C^{\text{deg}} \cdot (p^{\text{pv2bess}}_t + p^{\text{grid2bess}}_t + p^{\text{bess2load}}_t) \Delta t + w^{\text{curt}} \cdot p^{\text{curt}}_t \Delta t \right] + C^{\text{peak}} \cdot p^{\text{peak}}$$

### Constraints
1. **Hub Energy Balance**:
   $$p^{\text{pv2load}}_t + p^{\text{grid2load}}_t + p^{\text{bess2load}}_t = \sum_i p^{\text{load}}_{i,t} \quad \forall t$$
2. **Renewable Allocation**:
   $$p^{\text{pv2load}}_t + p^{\text{pv2bess}}_t + p^{\text{curt}}_t = P^{\text{pv}}_t \quad \forall t$$
3. **Battery SOC Dynamics**:
   $$\text{SOC}_{t+1} = \text{SOC}_t + \frac{100}{E^{\text{cap}}} \left( \eta_{\text{ch}} (p^{\text{pv2bess}}_t + p^{\text{grid2bess}}_t) - \frac{1}{\eta_{\text{dis}}} p^{\text{bess2load}}_t \right) \Delta t$$
   $$\text{SOC}_{\min} \le \text{SOC}_t \le \text{SOC}_{\max}, \quad \text{SOC}_T \ge \text{SOC}_{\text{reserve}}$$
4. **Mutual Exclusivity of Battery Charge/Discharge**:
   $$u^{\text{ch}}_t + u^{\text{dis}}_t \le 1, \quad u^{\text{ch}}_t, u^{\text{dis}}_t \in \{0, 1\}$$
5. **Critical Load Protection**:
   $$p^{\text{load}}_{i,t} = P^{\text{load\_nominal}}_{i,t} \quad \forall i \in \text{CRITICAL}, t$$

---

## 5. Quickstart Guide

### Prerequisites
- Node.js v18+ (tested on Node v25)
- Python 3.11 or 3.12

### Step 1: Start Backend Server
```bash
cd backend
# Create virtual environment (using uv or python -m venv)
python -m venv .venv
source .venv/bin/activate  # Or on Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Launch FastAPI on port 8000
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Step 2: Start Frontend Application
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. The Vite development proxy forwards all `/api/*` calls automatically to `http://localhost:8000`.

---

## 6. API Reference Summary

| Endpoint | Method | Description |
|---|---|---|
| `/health` | `GET` | System health, solver status, and service metadata |
| `/api/dashboard/kpis` | `GET` | Real-time executive KPIs with trends and contextual badges |
| `/api/energy-flow` | `GET` | Directed numerical flows between Solar, BESS, Grid, and Factory |
| `/api/forecast/renewable` | `GET` | Weather-aware forecast curve with upper/lower uncertainty bounds |
| `/api/forecast/load` | `GET` | Production shift-based factory demand schedule |
| `/api/loads` | `GET` | Configurable industrial load matrix with ratings and priority |
| `/api/loads/{load_id}` | `PUT` | Shed or modulate flexible loads (Critical loads locked) |
| `/api/battery` | `GET` | Real-time BESS SOC, health, available energy, and 24h trajectory |
| `/api/grid` | `GET` | Time-of-Use schedule, current rate, and demand charge exposure |
| `/api/optimization/run` | `POST` | Execute PuLP MILP solver and return optimal dispatch schedule |
| `/api/simulator/run` | `POST` | Execute What-If simulation comparing Before vs After dispatch |
| `/api/digital-twin` | `GET` | Electrical busbar frequency, voltage, power factor, and nodal states |
| `/api/analytics` | `GET` | Historical savings, peak reduction, and forecast error metrics |
| `/api/alerts` | `GET` | Active system alarms and recommended operator actions |

---

## 7. Decision-Support & Industrial Safety Boundary

ENERGIQ functions as an **industrial decision-support and supervisory optimization system**. It models physics, forecasts variability, and recommends optimal schedules. To prevent industrial equipment damage or unintended production line stoppages, all optimization dispatch decisions and load modulations are presented as structured recommendations requiring authorized operator approval before SCADA execution. Critical manufacturing lines (e.g., CNC 5-Axis machining cells) are locked against arbitrary disconnection.

---

## 8. Documentation Index
- System Architecture: [`docs/architecture.md`](file:///c:/Users/acer/OneDrive%20-%20ELCOT/PROJECTS/RENEWABLE%20ENERGY%20RESOURCE/docs/architecture.md)
- Optimization Formulation: [`docs/optimization.md`](file:///c:/Users/acer/OneDrive%20-%20ELCOT/PROJECTS/RENEWABLE%20ENERGY%20RESOURCE/docs/optimization.md)
- Machine Learning & Forecasting: [`docs/ml.md`](file:///c:/Users/acer/OneDrive%20-%20ELCOT/PROJECTS/RENEWABLE%20ENERGY%20RESOURCE/docs/ml.md)
- REST API Specification: [`docs/api.md`](file:///c:/Users/acer/OneDrive%20-%20ELCOT/PROJECTS/RENEWABLE%20ENERGY%20RESOURCE/docs/api.md)
- Database SQL Schema: [`backend/app/database/schema.sql`](file:///c:/Users/acer/OneDrive%20-%20ELCOT/PROJECTS/RENEWABLE%20ENERGY%20RESOURCE/backend/app/database/schema.sql)
