import math
from datetime import datetime, timedelta
from typing import List, Dict, Any
from app.models.schemas import IndustrialLoad

class LoadForecaster:
    """
    Industrial Load Forecaster breaking down demand by production shift schedules,
    critical machine lines, and flexible/shiftable operations.
    """
    def predict_load_schedule(self, horizon_hours: int = 24) -> List[Dict[str, Any]]:
        now = datetime.now()
        schedule = []
        
        for h in range(horizon_hours):
            t = now + timedelta(hours=h)
            hour_val = t.hour
            
            # Baseline shift profiles
            if 8 <= hour_val < 16:
                shift = "Shift 1: Morning Production Peak"
                cnc = 340.0
                hvac = 180.0
                comp = 135.0
                pumps = 60.0
                ev = 40.0
                aux = 55.0
            elif 16 <= hour_val < 23:
                shift = "Shift 2: Evening Operations"
                cnc = 290.0
                hvac = 145.0
                comp = 110.0
                pumps = 45.0
                ev = 85.0
                aux = 50.0
            else:
                shift = "Shift 3: Night Maintenance & Thermal Cool-down"
                cnc = 220.0
                hvac = 90.0
                comp = 50.0
                pumps = 95.0 # Pumping prioritized during off-peak night
                ev = 110.0 # Fleet overnight charging
                aux = 35.0

            # Add minor operational variability
            jitter = math.sin(h * 0.8) * 8.0
            total_load = cnc + hvac + comp + pumps + ev + aux + jitter
            critical_load = cnc # Strictly locked
            flexible_load = pumps + ev # Shiftable

            schedule.append({
                "time": t.strftime("%H:%M"),
                "timestamp": t.isoformat(),
                "shift": shift,
                "total_demand": round(total_load, 1),
                "critical_demand": round(critical_load, 1),
                "high_priority_demand": round(hvac, 1),
                "medium_priority_demand": round(comp + aux, 1),
                "flexible_demand": round(flexible_load, 1),
                "subloads": {
                    "CNC Machining": round(cnc, 1),
                    "HVAC Chiller": round(hvac, 1),
                    "Compressed Air": round(comp, 1),
                    "Pumping ETP": round(pumps, 1),
                    "EV Fleet": round(ev, 1),
                    "Auxiliary": round(aux, 1)
                }
            })
            
        return schedule

load_forecaster = LoadForecaster()
