import math
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from app.models.schemas import (
    PlantSummary, ExecutiveDashboardKPIs, KpiMetric, EnergyFlowData, FlowAllocations,
    IndustrialLoad, BatteryState, GridTariffInfo, TariffScheduleItem,
    ForecastData, ForecastPoint, SystemAlert, ExplainableMetadata,
    OptimizationResult, OptimizationSummary, OptimizationScheduleItem,
    DigitalTwinState, DigitalTwinNode, WhatIfSimulationParams, SimulationResult,
    SimulationKPI, SimulationComparison
)

class DataRepository:
    """
    Data repository abstraction supporting both real database (Supabase/PostgreSQL)
    and high-fidelity in-memory seed telemetry for zero-dependency local operation.
    """
    def __init__(self):
        self.plant = PlantSummary(
            id="plant-elcot-01",
            name="ELCOT Advanced Precision Manufacturing Hub",
            location="Industrial Corridor, Chennai",
            capacity_solar_kw=650.0,
            capacity_bess_kwh=800.0,
            grid_contract_kw=500.0,
            current_mode="NORMAL",
            system_health="OPTIMAL",
            last_updated=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )

        self.loads: List[IndustrialLoad] = [
            IndustrialLoad(
                id="cnc-01",
                name="CNC 5-Axis Milling Cells",
                category="CNC",
                criticality="CRITICAL",
                current_power=285.0,
                min_power=220.0,
                max_power=380.0,
                nominal_power=300.0,
                flexibility_type="Non-curtailable (Precision Machining)",
                operating_schedule="Continuous 24/7 (3-Shift Rotation)",
                production_dependency="Critical Spindle Path - Tolerance ±2µm",
                is_sheddable=False,
                is_modulatable=False,
                status="RUNNING"
            ),
            IndustrialLoad(
                id="hvac-01",
                name="Cleanroom HVAC & Process Chiller",
                category="HVAC",
                criticality="HIGH",
                current_power=140.0,
                min_power=80.0,
                max_power=210.0,
                nominal_power=150.0,
                flexibility_type="Thermal Buffer (±2°C Deadband modulation)",
                operating_schedule="Continuous (Temperature & Humidity Controlled)",
                production_dependency="Cleanroom ISO Class 6 environment compliance",
                is_sheddable=False,
                is_modulatable=True,
                status="MODULATED"
            ),
            IndustrialLoad(
                id="comp-01",
                name="Compressed Air Generation Station",
                category="COMPRESSOR",
                criticality="MEDIUM",
                current_power=95.0,
                min_power=40.0,
                max_power=160.0,
                nominal_power=110.0,
                flexibility_type="Pressure Vessel Storage (30 min buffer)",
                operating_schedule="06:00 - 22:00 Demand Tracking",
                production_dependency="Pneumatic tooling & robotic pick-and-place",
                is_sheddable=True,
                is_modulatable=True,
                status="RUNNING"
            ),
            IndustrialLoad(
                id="pump-01",
                name="Effluent Treatment & Industrial Pumping",
                category="PUMP",
                criticality="FLEXIBLE",
                current_power=45.0,
                min_power=0.0,
                max_power=120.0,
                nominal_power=80.0,
                flexibility_type="Storage Reservoir Buffer (Can shift 4 hours)",
                operating_schedule="Intermittent / Off-Peak preferred",
                production_dependency="Wastewater balancing tank capacity 500m³",
                is_sheddable=True,
                is_modulatable=True,
                status="RUNNING"
            ),
            IndustrialLoad(
                id="ev-01",
                name="Fleet EV Logistics Fast Chargers",
                category="EV_CHARGING",
                criticality="FLEXIBLE",
                current_power=60.0,
                min_power=0.0,
                max_power=150.0,
                nominal_power=90.0,
                flexibility_type="Smart Curtailment & Duty Cycle Throttling",
                operating_schedule="Shift changeovers & nighttime charging",
                production_dependency="Internal material transport AGVs & forklifts",
                is_sheddable=True,
                is_modulatable=True,
                status="RUNNING"
            ),
            IndustrialLoad(
                id="aux-01",
                name="Facility Lighting & Auxiliary UPS",
                category="AUXILIARY",
                criticality="MEDIUM",
                current_power=42.0,
                min_power=30.0,
                max_power=75.0,
                nominal_power=45.0,
                flexibility_type="Lighting zone dimming (15% reduction)",
                operating_schedule="Continuous Base Load",
                production_dependency="Plant safety lighting and telemetry servers",
                is_sheddable=False,
                is_modulatable=True,
                status="RUNNING"
            )
        ]

        self.alerts: List[SystemAlert] = [
            SystemAlert(
                id="alt-01",
                timestamp=(datetime.now() - timedelta(minutes=14)).strftime("%H:%M:%S"),
                severity="WARNING",
                title="Grid Peak Approaching Threshold",
                description="Import is at 445 kW (89% of contracted 500 kW limit). Demand charge penalty risk.",
                component="GRID",
                recommended_action="Dispatch BESS discharge at 75 kW or modulate flexible EV & pumping loads.",
                acknowledged=False
            ),
            SystemAlert(
                id="alt-02",
                timestamp=(datetime.now() - timedelta(minutes=38)).strftime("%H:%M:%S"),
                severity="INFO",
                title="Solar Generation Exceeds Base Forecast",
                description="GHI is 820 W/m² (+12% above morning prediction). Opportunity to top-up BESS.",
                component="RENEWABLE",
                recommended_action="Route 80 kW surplus solar to BESS to prepare for 18:00 Peak Tariff tier.",
                acknowledged=False
            ),
            SystemAlert(
                id="alt-03",
                timestamp=(datetime.now() - timedelta(hours=2)).strftime("%H:%M:%S"),
                severity="CRITICAL",
                title="High Tariff Window Ahead (₹12.50/kWh)",
                description="Evening peak tier starts at 18:00. Projected grid expense without optimization: ₹18,400/hr.",
                component="OPTIMIZER",
                recommended_action="Authorize automated MILP dispatch to shave 140 kW from grid import.",
                acknowledged=False
            )
        ]

    def get_plant_summary(self) -> PlantSummary:
        return self.plant

    def get_tariffs(self) -> GridTariffInfo:
        now = datetime.now()
        current_hour = now.hour
        
        # Realistic Time-of-Use schedule
        # 22 - 06: Off-peak (₹4.50)
        # 06 - 09, 12 - 18: Standard (₹7.80)
        # 09 - 12, 18 - 22: Peak (₹12.50)
        schedule = []
        for h in range(24):
            if h < 6 or h >= 22:
                tier = "OFF_PEAK"
                rate = 4.50
            elif (9 <= h < 12) or (18 <= h < 22):
                tier = "PEAK"
                rate = 12.50
            else:
                tier = "STANDARD"
                rate = 7.80
            
            schedule.append(TariffScheduleItem(
                hour=h,
                time_label=f"{h:02d}:00",
                tariff=rate,
                tier=tier,
                is_current=(h == current_hour)
            ))
            
        current_item = schedule[current_hour]
        next_hour = (current_hour + 1) % 24
        next_item = schedule[next_hour]

        return GridTariffInfo(
            current_tariff=current_item.tariff,
            currency_symbol="₹",
            current_tier=current_item.tier,
            next_tier=next_item.tier,
            next_tier_time=f"{next_hour:02d}:00",
            import_limit_kw=500.0,
            current_import_kw=215.0,
            demand_charge_rate=350.0, # ₹/kW/month
            monthly_peak_kw=462.0,
            demand_charge_exposure=161700.0,
            schedule=schedule
        )

    def get_battery_state(self) -> BatteryState:
        # Projected curve over 24 hours
        curve = []
        base_soc = 68.0
        for i in range(24):
            t_label = f"{i:02d}:00"
            # Charge during afternoon solar peak, discharge during evening peak
            if 10 <= i <= 15:
                delta = 5.0
                p = -120.0
            elif 18 <= i <= 21:
                delta = -10.0
                p = 150.0
            else:
                delta = 0.0
                p = 0.0
            base_soc = max(15.0, min(95.0, base_soc + delta))
            curve.append({"time": t_label, "soc": round(base_soc, 1), "power": p})

        return BatteryState(
            capacity_kwh=800.0,
            current_soc=68.5,
            min_soc=15.0,
            max_soc=95.0,
            reserve_soc=20.0,
            max_charge_kw=250.0,
            max_discharge_kw=250.0,
            charge_efficiency=0.94,
            discharge_efficiency=0.94,
            degradation_cost_per_kwh=0.45,
            current_power=-65.0, # currently charging 65 kW from solar
            available_energy_kwh=548.0,
            temperature_c=27.4,
            state="CHARGING",
            cycle_count=412,
            health_soh=96.8,
            projected_soc_curve=curve
        )

    def get_energy_flow(self) -> EnergyFlowData:
        now = datetime.now()
        h = now.hour + now.minute / 60.0
        
        # Physically consistent solar profile (peaking at solar noon ~12:30)
        if 6.0 <= h <= 18.0:
            solar_norm = math.sin((h - 6.0) / 12.0 * math.pi) ** 1.8
            solar_gen = round(650.0 * 0.88 * solar_norm, 1) # ~500 kW max
        else:
            solar_gen = 0.0
            
        wind_gen = 45.0 # baseline auxiliary wind turbine
        total_renewable = solar_gen + wind_gen

        # Sum of loads
        total_demand = sum(l.current_power for l in self.loads) # ~667 kW

        # Energy routing logic:
        # Solar feeds loads first, excess to battery, residual from grid/battery
        if total_renewable >= total_demand:
            ren_to_load = total_demand
            surplus = total_renewable - total_demand
            ren_to_bat = min(surplus, 180.0) # max charge rating
            curtailment = max(0.0, surplus - ren_to_bat)
            grid_import = 0.0
            bat_to_load = 0.0
            bat_power = -ren_to_bat # charging
        else:
            ren_to_load = total_renewable
            ren_to_bat = 0.0
            curtailment = 0.0
            deficit = total_demand - total_renewable
            
            # If peak tariff, use battery to shave deficit
            tariff = self.get_tariffs().current_tariff
            if tariff > 10.0:
                bat_to_load = min(deficit, 150.0)
                grid_import = deficit - bat_to_load
                bat_power = bat_to_load
            else:
                bat_to_load = 0.0
                grid_import = deficit
                bat_power = 0.0

        return EnergyFlowData(
            solar_generation=solar_gen,
            wind_generation=wind_gen,
            total_renewable=total_renewable,
            grid_import=round(grid_import, 1),
            battery_power=round(bat_power, 1),
            battery_soc=68.5,
            total_demand=round(total_demand, 1),
            curtailment=round(curtailment, 1),
            flows=FlowAllocations(
                renewable_to_load=round(ren_to_load, 1),
                renewable_to_battery=round(ren_to_bat, 1),
                grid_to_load=round(grid_import, 1),
                battery_to_load=round(bat_to_load, 1),
                renewable_to_curtailment=round(curtailment, 1),
                grid_to_battery=0.0
            )
        )

    def get_dashboard_kpis(self) -> ExecutiveDashboardKPIs:
        flow = self.get_energy_flow()
        tariff = self.get_tariffs().current_tariff
        
        return ExecutiveDashboardKPIs(
            renewable_generation=KpiMetric(
                value=flow.total_renewable,
                unit="kW",
                trend=12.4,
                trend_direction="up",
                is_positive_trend=True,
                label="Renewable Generation",
                context="Solar (520 kW) + Wind (45 kW)"
            ),
            industrial_demand=KpiMetric(
                value=flow.total_demand,
                unit="kW",
                trend=-2.1,
                trend_direction="down",
                is_positive_trend=True,
                label="Industrial Demand",
                context="6 Active Load Centers (CNC, HVAC, Pumping)"
            ),
            grid_consumption=KpiMetric(
                value=flow.grid_import,
                unit="kW",
                trend=-28.5,
                trend_direction="down",
                is_positive_trend=True,
                label="Grid Consumption",
                context="Contract Limit: 500 kW"
            ),
            battery_soc=KpiMetric(
                value=flow.battery_soc,
                unit="%",
                trend=5.2,
                trend_direction="up",
                is_positive_trend=True,
                label="Battery SOC",
                context="Available: 548 kWh | Health: 96.8%"
            ),
            current_grid_peak=KpiMetric(
                value=445.0,
                unit="kW",
                trend=-6.2,
                trend_direction="down",
                is_positive_trend=True,
                label="Current Grid Peak",
                context="Monthly Threshold: 480 kW"
            ),
            renewable_curtailment=KpiMetric(
                value=flow.curtailment,
                unit="kW",
                trend=-84.0,
                trend_direction="down",
                is_positive_trend=True,
                label="Renewable Curtailment",
                context="99.4% Solar Injected / Stored"
            ),
            current_energy_cost=KpiMetric(
                value=round(flow.grid_import * tariff, 0),
                unit="₹/hr",
                trend=-24.0,
                trend_direction="down",
                is_positive_trend=True,
                label="Current Energy Cost",
                context=f"Tariff: ₹{tariff:.2f}/kWh ({self.get_tariffs().current_tier})"
            ),
            estimated_daily_savings=KpiMetric(
                value=34850.0,
                unit="₹/day",
                trend=18.6,
                trend_direction="up",
                is_positive_trend=True,
                label="Estimated Daily Savings",
                context="vs. Uncoordinated Grid-Only Baseline"
            )
        )

    def get_digital_twin_state(self) -> DigitalTwinState:
        flow = self.get_energy_flow()
        nodes = [
            DigitalTwinNode(
                id="node-solar",
                name="650 kWp Rooftop Solar PV",
                type="SOURCE",
                power_kw=flow.solar_generation,
                status="OPTIMAL" if flow.solar_generation > 0 else "IDLE",
                efficiency_pct=98.2,
                details={"Inverters Online": "4/4", "Irradiance": "840 W/m²", "Cell Temp": "48.2°C"}
            ),
            DigitalTwinNode(
                id="node-grid",
                name="11kV / 415V Substation Grid",
                type="GRID",
                power_kw=flow.grid_import,
                status="OPTIMAL" if flow.grid_import < 400 else "WARNING",
                efficiency_pct=99.1,
                details={"Contract Limit": "500 kW", "Power Factor": "0.98", "Frequency": "50.02 Hz"}
            ),
            DigitalTwinNode(
                id="node-bess",
                name="800 kWh LFP BESS Rack",
                type="STORAGE",
                power_kw=abs(flow.battery_power),
                status="ACTIVE",
                efficiency_pct=94.5,
                details={"SOC": f"{flow.battery_soc}%", "Mode": "Charging" if flow.battery_power < 0 else "Discharging", "Cell Balance": "±4mV"}
            ),
            DigitalTwinNode(
                id="node-hub",
                name="Industrial Energy Orchestration Hub",
                type="HUB",
                power_kw=flow.total_demand,
                status="OPTIMAL",
                efficiency_pct=99.6,
                details={"Busbar Voltage": "414.8 V", "Total Losses": "1.8 kW", "Protection Relay": "Normal"}
            ),
            DigitalTwinNode(
                id="node-cnc",
                name="Precision Machining Center",
                type="SINK",
                power_kw=285.0,
                status="OPTIMAL",
                efficiency_pct=92.0,
                details={"Priority": "CRITICAL", "Active Spindles": "12", "Tolerance Margin": "Locked"}
            ),
            DigitalTwinNode(
                id="node-hvac",
                name="Cleanroom Environmental Chiller",
                type="SINK",
                power_kw=140.0,
                status="ACTIVE",
                efficiency_pct=88.5,
                details={"Thermal Buffer": "±1.5°C", "Set Point": "21.0°C", "Modulation": "-15 kW"}
            ),
            DigitalTwinNode(
                id="node-pumps",
                name="Wastewater Pumping & ETP",
                type="SINK",
                power_kw=45.0,
                status="ACTIVE",
                efficiency_pct=86.0,
                details={"Buffer Headroom": "72%", "Shiftable": "Yes (up to 4h)"}
            )
        ]
        
        mode = "NORMAL"
        if flow.grid_import > 450:
            mode = "PEAK RISK"
        elif self.get_tariffs().current_tariff > 10.0:
            mode = "HIGH TARIFF"
        elif flow.total_renewable < 50.0 and flow.total_demand > 600:
            mode = "LOW RENEWABLE"

        return DigitalTwinState(
            operating_mode=mode,
            hub_frequency_hz=50.02,
            hub_voltage_v=414.8,
            power_factor=0.982,
            nodes=nodes,
            active_alerts_count=len([a for a in self.alerts if not a.acknowledged]),
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )

# Global repository instance
repository = DataRepository()
