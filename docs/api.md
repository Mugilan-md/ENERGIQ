# ENERGIQ REST API Specification

Base URL: `http://localhost:8000/api`

## Core Endpoints

### 1. System & Dashboard
- `GET /health`: System health status, model statuses, and environment information.
- `GET /dashboard`: Aggregated real-time metrics including live flows, KPI trends, plant operating state, and active recommendations.
- `GET /energy-flow`: Directed graph representation of instantaneous energy routing (Renewable, BESS, Grid, Loads, Curtailment).

### 2. Forecasting
- `GET /forecast/renewable`: Multi-horizon forecasts (15m, 30m, 1h, 6h, 24h) with actual vs predicted curves, confidence bands, MAE, RMSE.
- `GET /forecast/load`: Industrial load forecasts categorized by Critical, High, Medium, and Flexible load segments.
- `GET /forecast/weather`: Ambient meteorological telemetry and weather predictions.

### 3. Industrial Assets
- `GET /loads`: Machine-level telemetry, power ratings, priority rankings, and flexibility constraints.
- `PUT /loads/{load_id}`: Update load operating mode, priority, or manual override.
- `GET /battery`: Battery Energy Storage System (BESS) real-time state, SOC, health, temperature, and degradation cost.
- `GET /grid`: Dynamic Time-of-Use tariff structure, current pricing tier, peak demand ceiling, and threshold alerts.

### 4. Optimization & Recommendations
- `POST /optimization/run`: Execute formal MILP solver with custom parameters or current telemetry.
- `GET /optimization/history`: Historical log of optimization runs with objective function values and execution times.
- `GET /recommendations`: Explainable AI recommendations detailing recommended actions, underlying rationale, and quantified impacts.

### 5. Simulation & Digital Twin
- `POST /simulator/run`: Interactive What-If simulation engine comparing baseline vs optimized dispatch.
- `GET /scenarios`: Pre-configured industrial operational scenarios (Cloudy Day, Peak Tariff Spike, Production Surge, Low Battery, etc.).
- `GET /digital-twin`: Complete hub state representation including component nodal statuses, loss vectors, and thermal risks.

### 6. Analytics & Alerts
- `GET /analytics`: Multi-timeframe performance metrics (daily, weekly, monthly) for cost savings, renewable utilization, and grid peak shaving.
- `GET /alerts`: Active system alarms, categorized by severity (Critical, Warning, Info) with recommended operator interventions.
