# ENERGIQ: System Architecture & Design Specification

## 1. Overview
ENERGIQ is an AI-powered industrial energy orchestration platform engineered to solve the complex challenge of coordinating variable on-site renewable generation (Solar PV, Wind), Battery Energy Storage Systems (BESS), dynamic grid electricity tariffs, and flexible industrial loads while strictly guaranteeing critical industrial manufacturing production targets.

## 2. High-Level Architecture

```
+-----------------------------------------------------------------------------------+
|                                 ENERGIQ PLATFORM                                  |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                   Presentation Layer: React 19 + TypeScript                 |  |
|  |  * Industrial Control Dashboard       * Renewable & Load Forecast Analytics |  |
|  |  * Animated Live Flow Sankey Engine    * Digital Twin & Hub Network Topology |  |
|  |  * Mixed-Integer What-If Simulator    * Explainable AI Recommender          |  |
|  |  * Configurable Multi-Load Matrix     * Battery Degradation & SOC Tracker   |  |
|  +-----------------------------------------------------------------------------+  |
|                                         | REST APIs / SSE / WebSockets            |
|                                         v                                         |
|  +-----------------------------------------------------------------------------+  |
|  |                   API & Orchestration Layer: FastAPI                        |  |
|  |  /api/dashboard  |  /api/forecast  |  /api/battery  |  /api/optimization    |  |
|  |  /api/simulator  |  /api/loads     |  /api/alerts   |  /api/digital-twin    |  |
|  +-----------------------------------------------------------------------------+  |
|                 |                                             |                   |
|                 v                                             v                   |
|  +------------------------------+             +-------------------------------+   |
|  |      Forecasting Engine      |             |      Optimization Engine      |   |
|  |  * Gradient Boosting / RF    |             |  * Formal MILP / LP (PuLP)    |   |
|  |  * Weather-Aware (GHI, Temp, |             |  * Multi-Objective Cost Min   |   |
|  |    Wind Speed, Cloud Cover)  |             |  * Production Feasibility     |   |
|  |  * 15m, 30m, 1h, 6h, 24h     |             |  * Peak Shaving & Degradation |   |
|  |  * Confidence Interval Bands |             |  * Explainable AI Rule Synthes|   |
|  +------------------------------+             +-------------------------------+   |
|                 |                                             |                   |
|                 +-----------------------+---------------------+                   |
|                                         v                                         |
|  +-----------------------------------------------------------------------------+  |
|  |               Data & Persistence Abstraction Layer                          |  |
|  |  * Supabase PostgreSQL Schema with Timescale-ready structures              |  |
|  |  * In-Memory High-Fidelity Industrial Simulation Engine                     |  |
|  |  * Production-grade Fallback Seed Engine (Zero external dependency mode)    |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

## 3. Industrial Load Classification & Hierarchy
Industrial facilities do not behave as monolithic loads. ENERGIQ models distinct sub-systems with granular priority levels:

| Load ID | Machine / Subsystem | Criticality | Minimum Power (kW) | Maximum Power (kW) | Flexibility Type | Operating Window |
|---|---|---|---|---|---|---|
| `cnc-01` | CNC 5-Axis Milling Cells | **CRITICAL** | 220 kW | 380 kW | Non-curtailable | Continuous (24/7) |
| `hvac-01` | Cleanroom HVAC & Chiller | **HIGH** | 80 kW | 210 kW | Thermal inertia buffer (±2°C) | Continuous |
| `comp-01` | Compressed Air Generation | **MEDIUM** | 50 kW | 160 kW | Pressure reservoir storage (30m) | Shift-based |
| `pump-01` | Water Treatment & Pumping | **FLEXIBLE**| 0 kW | 120 kW | Delay-tolerant buffer tank | Variable / Peak Avoidance |
| `ev-01` | Fleet EV Charging Hub | **FLEXIBLE**| 0 kW | 150 kW | Modulated duty-cycle | Daytime / Night |
| `aux-01` | Lighting, Office & Aux | **MEDIUM** | 30 kW | 75 kW | Base load + occupancy | Continuous |

## 4. Formal Mathematical Optimization Formulation
The core optimization formulation uses Mixed-Integer Linear Programming (MILP):

### Objective Function:
$$\min \sum_{t=1}^T \left( C^{\text{grid}}_t \cdot P^{\text{grid}}_t \cdot \Delta t + C^{\text{deg}} \cdot (P^{\text{ch}}_t + P^{\text{dis}}_t) \cdot \Delta t + w_{\text{curt}} \cdot P^{\text{curt}}_t + w_{\text{peak}} \cdot \max(0, P^{\text{grid}}_t - P^{\text{peak\_target}}) + \sum_i w^{\text{viol}}_i \cdot S^{\text{viol}}_{i,t} \right)$$

### Constraints:
1. **Instantaneous Energy Balance**:
   $$P^{\text{pv}}_t - P^{\text{curt}}_t + P^{\text{grid}}_t + P^{\text{dis}}_t = \sum_i P^{\text{load}}_{i,t} + P^{\text{ch}}_t \quad \forall t$$
2. **Battery State of Charge Dynamics**:
   $$\text{SOC}_{t+1} = \text{SOC}_t + \left( \eta_{\text{ch}} P^{\text{ch}}_t - \frac{1}{\eta_{\text{dis}}} P^{\text{dis}}_t \right) \frac{\Delta t}{E_{\text{cap}}}$$
   $$\text{SOC}_{\min} \le \text{SOC}_t \le \text{SOC}_{\max}$$
   $$\text{SOC}_T \ge \text{SOC}_{\text{reserve}}$$
3. **Mutual Exclusivity of Charge and Discharge**:
   $$P^{\text{ch}}_t \le P^{\text{ch\_max}} \cdot u_t, \quad P^{\text{dis}}_t \le P^{\text{dis\_max}} \cdot (1 - u_t), \quad u_t \in \{0, 1\}$$
4. **Grid Capacity Limit**:
   $$0 \le P^{\text{grid}}_t \le P^{\text{grid\_max}}$$
5. **Industrial Load Satisfaction**:
   $$P^{\text{load\_min}}_{i,t} - S^{\text{viol}}_{i,t} \le P^{\text{load}}_{i,t} \le P^{\text{load\_max}}_{i,t}$$
   $$S^{\text{viol}}_{i,t} = 0 \quad \text{for all CRITICAL loads}$$
