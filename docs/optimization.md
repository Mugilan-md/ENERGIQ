# ENERGIQ Optimization Formulation

## 1. Problem Definition
Industrial facilities with behind-the-meter (BTM) renewable generation (PV/Wind) face high demand variability and steep peak-demand tariffs. The ENERGIQ Mixed-Integer Linear Programming (MILP) model determines optimal multi-period dispatch schedules for:
1. Solar generation allocation: Load vs. Battery Energy Storage System (BESS) vs. Curtailment.
2. Battery operation: Charge vs. Discharge vs. Idle states with degradation accounting.
3. Grid import: Managing Time-of-Use (ToU) arbitrage and monthly Peak Demand charges.
4. Industrial load modulation: Shedding or shifting flexible loads while strictly locking critical manufacturing lines.

## 2. Mathematical Model

### Sets & Indices
- $t \in \{1, \dots, T\}$: Optimization time intervals (e.g. 15-minute or 1-hour steps across 24 hours).
- $i \in \{1, \dots, N\}$: Industrial load units (CNC, HVAC, Compressed Air, Pumps, EV charging, Aux).

### Parameters
- $P^{\text{pv}}_t$: Predicted renewable generation at step $t$ (kW).
- $C^{\text{grid}}_t$: Time-of-use grid tariff at step $t$ ($/kWh or INR/kWh).
- $C^{\text{peak}}$: Demand charge penalty rate ($/kW or INR/kW).
- $C^{\text{deg}}$: Levelized battery cycle degradation cost ($/kWh throughput).
- $w^{\text{curt}}$: Penalty weight for renewable curtailment ($/kWh).
- $w^{\text{viol}}_i$: Penalty for deviating from nominal production target ($/kWh).
- $E^{\text{cap}}$: BESS total energy capacity (kWh).
- $\text{SOC}_{\min}, \text{SOC}_{\max}$: Safe battery operating range (%).
- $\text{SOC}_{\text{reserve}}$: Emergency reserve threshold (%).
- $P^{\text{ch\_max}}, P^{\text{dis\_max}}$: Maximum charge/discharge ratings (kW).
- $\eta_{\text{ch}}, \eta_{\text{dis}}$: Round-trip charge and discharge efficiencies.
- $P^{\text{grid\_max}}$: Grid substation import capacity ceiling (kW).
- $P^{\text{load\_min}}_{i,t}, P^{\text{load\_max}}_{i,t}$: Operational boundaries for load $i$ at step $t$ (kW).
- $P^{\text{load\_nominal}}_{i,t}$: Baseline scheduled power demand for load $i$ at step $t$ (kW).

### Decision Variables
- $p^{\text{pv2load}}_t \ge 0$: Renewable power supplied directly to factory loads (kW).
- $p^{\text{pv2bess}}_t \ge 0$: Renewable power diverted to charge BESS (kW).
- $p^{\text{curt}}_t \ge 0$: Curtailed renewable power (kW).
- $p^{\text{grid2load}}_t \ge 0$: Grid power imported for factory loads (kW).
- $p^{\text{grid2bess}}_t \ge 0$: Off-peak grid power imported to charge BESS (kW).
- $p^{\text{bess2load}}_t \ge 0$: Battery power discharged to feed loads (kW).
- $p^{\text{load}}_{i,t} \ge 0$: Net scheduled power allocated to load $i$ at step $t$ (kW).
- $s^{\text{viol}}_{i,t} \ge 0$: Slack production shortfall variable for load $i$ at step $t$ (kW).
- $u^{\text{ch}}_t \in \{0, 1\}$: Binary variable indicating charging state.
- $u^{\text{dis}}_t \in \{0, 1\}$: Binary variable indicating discharging state.
- $p^{\text{peak}} \ge 0$: Maximum peak grid demand achieved across the horizon (kW).

### Objective Function
$$\min \mathcal{J} = \sum_{t=1}^T \left[ C^{\text{grid}}_t \cdot (p^{\text{grid2load}}_t + p^{\text{grid2bess}}_t) \Delta t + C^{\text{deg}} \cdot (p^{\text{pv2bess}}_t + p^{\text{grid2bess}}_t + p^{\text{bess2load}}_t) \Delta t + w^{\text{curt}} \cdot p^{\text{curt}}_t \Delta t + \sum_i w^{\text{viol}}_i \cdot s^{\text{viol}}_{i,t} \Delta t \right] + C^{\text{peak}} \cdot p^{\text{peak}}$$

### Constraints
1. **Renewable Flow Conservation**:
   $$p^{\text{pv2load}}_t + p^{\text{pv2bess}}_t + p^{\text{curt}}_t = P^{\text{pv}}_t \quad \forall t$$

2. **Load Satisfaction & Slack Formulation**:
   $$p^{\text{pv2load}}_t + p^{\text{grid2load}}_t + p^{\text{bess2load}}_t = \sum_i p^{\text{load}}_{i,t} \quad \forall t$$
   $$p^{\text{load}}_{i,t} + s^{\text{viol}}_{i,t} \ge P^{\text{load\_nominal}}_{i,t} \quad \forall i, t$$
   $$P^{\text{load\_min}}_{i,t} \le p^{\text{load}}_{i,t} \le P^{\text{load\_max}}_{i,t} \quad \forall i, t$$
   $$s^{\text{viol}}_{i,t} = 0 \quad \forall i \in \text{CRITICAL}, t$$

3. **Battery Storage Dynamics & State-of-Charge**:
   $$\text{SOC}_1 = \text{SOC}_{\text{initial}}$$
   $$\text{SOC}_{t+1} = \text{SOC}_t + \frac{100}{E^{\text{cap}}} \cdot \left[ \eta_{\text{ch}} (p^{\text{pv2bess}}_t + p^{\text{grid2bess}}_t) - \frac{1}{\eta_{\text{dis}}} p^{\text{bess2load}}_t \right] \Delta t \quad \forall t < T$$
   $$\text{SOC}_{\min} \le \text{SOC}_t \le \text{SOC}_{\max} \quad \forall t$$
   $$\text{SOC}_T \ge \text{SOC}_{\text{reserve}}$$

4. **Charge / Discharge Incompatibility & Rate Limits**:
   $$p^{\text{pv2bess}}_t + p^{\text{grid2bess}}_t \le P^{\text{ch\_max}} \cdot u^{\text{ch}}_t \quad \forall t$$
   $$p^{\text{bess2load}}_t \le P^{\text{dis\_max}} \cdot u^{\text{dis}}_t \quad \forall t$$
   $$u^{\text{ch}}_t + u^{\text{dis}}_t \le 1 \quad \forall t$$

5. **Grid Import Limit & Peak Tracker**:
   $$p^{\text{grid2load}}_t + p^{\text{grid2bess}}_t \le P^{\text{grid\_max}} \quad \forall t$$
   $$p^{\text{peak}} \ge p^{\text{grid2load}}_t + p^{\text{grid2bess}}_t \quad \forall t$$
