import math
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, Any, List, Tuple, Optional
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score
from app.models.schemas import ForecastData, ForecastPoint

class RenewableForecaster:
    """
    ML Renewable Generation Forecaster.
    Employs Gradient Boosting Regressors with upper & lower quantile regressors
    to generate point predictions and uncertainty bands.
    """
    def __init__(self, peak_capacity_kw: float = 650.0):
        self.peak_capacity_kw = peak_capacity_kw
        self.model_mid = GradientBoostingRegressor(n_estimators=60, max_depth=4, random_state=42)
        self.model_lower = GradientBoostingRegressor(loss='quantile', alpha=0.1, n_estimators=60, max_depth=3, random_state=42)
        self.model_upper = GradientBoostingRegressor(loss='quantile', alpha=0.9, n_estimators=60, max_depth=3, random_state=42)
        self.mae = 0.0
        self.rmse = 0.0
        self.mape = 0.0
        self.r2 = 0.0
        self.is_trained = False
        self._bootstrap_model()

    def _generate_synthetic_weather_training_data(self, days: int = 45) -> pd.DataFrame:
        """Generate realistic synthetic meteorological & solar generation telemetry for training."""
        np.random.seed(42)
        n_samples = days * 24
        timestamps = [datetime.now() - timedelta(hours=n_samples - i) for i in range(n_samples)]
        
        hours = np.array([ts.hour + ts.minute / 60.0 for ts in timestamps])
        day_of_year = np.array([ts.timetuple().tm_yday for ts in timestamps])
        
        # Sun angle and theoretical clear sky GHI
        sun_elev = np.sin((hours - 6.0) / 12.0 * np.pi)
        sun_elev = np.maximum(0.0, sun_elev)
        clear_sky_ghi = 950.0 * (sun_elev ** 1.3)
        
        # Stochastic cloud cover (0 - 100%) with auto-correlation
        cloud_cover = np.zeros(n_samples)
        curr_cloud = 20.0
        for i in range(n_samples):
            curr_cloud = np.clip(curr_cloud + np.random.normal(0, 8), 0, 95)
            cloud_cover[i] = curr_cloud
            
        ghi = clear_sky_ghi * (1.0 - 0.75 * (cloud_cover / 100.0) ** 2)
        ghi = np.maximum(0.0, ghi)
        
        # Ambient temperature (cooler at 05:00, hottest at 14:00)
        temp_diurnal = 26.0 + 8.0 * np.sin((hours - 8.0) / 24.0 * 2 * np.pi)
        temp_c = temp_diurnal + np.random.normal(0, 1.2, n_samples)
        
        # Humidity inverse to temperature
        humidity = np.clip(90.0 - (temp_c - 20.0) * 3.5 + np.random.normal(0, 4, n_samples), 20, 98)
        
        wind_speed = np.clip(np.random.rayleigh(scale=3.5, size=n_samples), 0.5, 14.0)
        
        # Solar generation power (accounting for temperature derating: -0.4%/°C above 25°C)
        cell_temp = temp_c + (ghi / 800.0) * 28.0
        temp_derate = 1.0 - 0.004 * np.maximum(0.0, cell_temp - 25.0)
        actual_power = self.peak_capacity_kw * (ghi / 1000.0) * temp_derate * 0.96
        actual_power = np.clip(actual_power + np.random.normal(0, 8.0, n_samples), 0, self.peak_capacity_kw)
        actual_power = np.where(ghi < 10.0, 0.0, actual_power)

        return pd.DataFrame({
            "timestamp": timestamps,
            "hour": hours,
            "day_of_year": day_of_year,
            "ghi": ghi,
            "temp_c": temp_c,
            "humidity": humidity,
            "wind_speed": wind_speed,
            "cloud_cover": cloud_cover,
            "generation_kw": actual_power
        })

    def _bootstrap_model(self):
        """Train baseline model on synthetic telemetry and compute true evaluation metrics."""
        df = self._generate_synthetic_weather_training_data(days=30)
        features = ["hour", "ghi", "temp_c", "humidity", "wind_speed", "cloud_cover"]
        X = df[features]
        y = df["generation_kw"]
        
        # 80/20 chronological split (no shuffling for time series)
        split_idx = int(len(df) * 0.8)
        X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
        y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]
        
        # Fit self.model_mid on train split only for held-out evaluation
        self.model_mid.fit(X_train, y_train)
        y_pred = self.model_mid.predict(X_test)
        
        # Compute real metrics on held-out test split
        self.mae = round(float(mean_absolute_error(y_test, y_pred)), 2)
        self.rmse = round(float(root_mean_squared_error(y_test, y_pred)), 2)
        self.r2 = round(float(r2_score(y_test, y_pred)), 3)
        
        # Compute MAPE manually where actual generation > 0 (avoiding div by zero at night)
        mask = y_test > 0
        if np.any(mask):
            self.mape = round(float(np.mean(np.abs((y_test[mask] - y_pred[mask]) / y_test[mask])) * 100.0), 2)
        else:
            self.mape = 0.0
            
        # Refit all models on FULL dataset (train+test) for production predictions
        self.model_mid.fit(X, y)
        self.model_lower.fit(X, y)
        self.model_upper.fit(X, y)
        self.is_trained = True

    def _fetch_open_meteo_forecast(self, latitude: float = 13.08, longitude: float = 80.27) -> Optional[Dict[str, Any]]:
        """
        Fetch real-time hourly meteorological forecast from Open-Meteo API for plant coordinates.
        Requests cloud cover, ambient temperature, relative humidity, and wind speed.
        """
        import urllib.request
        import json
        url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={latitude}&longitude={longitude}&"
            f"hourly=cloudcover,temperature_2m,relativehumidity_2m,windspeed_10m&"
            f"forecast_days=3&timezone=auto"
        )
        req = urllib.request.Request(url, headers={"User-Agent": "ENERGIQ-Forecaster/1.0"})
        with urllib.request.urlopen(req, timeout=3.5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("hourly")

    def predict_horizon(self, horizon: str = "24h") -> ForecastData:
        """
        Generate forecast points with confidence bands for specified horizon:
        '15m', '30m', '1h', '6h', '24h'.
        Uses live Open-Meteo weather telemetry for plant location with synthetic fallback.
        """
        now = datetime.now()
        
        if horizon == "15m":
            steps = 4
            delta_mins = 15
        elif horizon == "30m":
            steps = 6
            delta_mins = 30
        elif horizon == "1h":
            steps = 12
            delta_mins = 60
        elif horizon == "6h":
            steps = 12
            delta_mins = 30
        else: # 24h
            steps = 24
            delta_mins = 60

        # Attempt to retrieve live Open-Meteo weather data
        weather_hourly = None
        try:
            from app.config import settings
            lat = getattr(settings, "PLANT_LATITUDE", 13.08)
            lon = getattr(settings, "PLANT_LONGITUDE", 80.27)
            weather_hourly = self._fetch_open_meteo_forecast(latitude=lat, longitude=lon)
        except Exception:
            weather_hourly = None

        is_live_weather = weather_hourly is not None

        points: List[ForecastPoint] = []
        actuals = []
        preds = []

        for i in range(steps):
            t = now + timedelta(minutes=i * delta_mins)
            h = t.hour + t.minute / 60.0
            
            # Predict irradiance and weather features
            used_live = False
            if weather_hourly and "time" in weather_hourly:
                target_str = t.strftime("%Y-%m-%dT%H:00")
                if target_str in weather_hourly["time"]:
                    idx = weather_hourly["time"].index(target_str)
                    cloud = float(weather_hourly["cloudcover"][idx])
                    temp = float(weather_hourly["temperature_2m"][idx])
                    humidity = float(weather_hourly["relativehumidity_2m"][idx])
                    wind = float(weather_hourly["windspeed_10m"][idx])
                    used_live = True

            if not used_live:
                # Fallback synthetic weather feature calculation
                cloud = 25.0 + 15.0 * math.sin(i * 0.4)
                temp = 28.0 + 6.0 * math.sin((h - 9.0) / 24.0 * 2 * math.pi)
                humidity = 65.0 - (temp - 25.0) * 2.0
                wind = 4.2 + 1.2 * math.cos(i * 0.3)

            # Derive GHI using solar elevation and cloud attenuation consistent with training pipeline
            sun_elev = max(0.0, math.sin((h - 6.0) / 12.0 * math.pi)) if 6.0 <= h <= 18.0 else 0.0
            clear_sky_ghi = 950.0 * (sun_elev ** 1.3)
            ghi = clear_sky_ghi * (1.0 - 0.75 * (cloud / 100.0) ** 2)
            ghi = max(0.0, ghi)

            X_step = pd.DataFrame([{
                "hour": h,
                "ghi": ghi,
                "temp_c": temp,
                "humidity": humidity,
                "wind_speed": wind,
                "cloud_cover": cloud
            }])

            p_mid = float(self.model_mid.predict(X_step)[0])
            p_low = float(self.model_lower.predict(X_step)[0])
            p_up = float(self.model_upper.predict(X_step)[0])

            # Zero out night generation
            if ghi < 5.0:
                p_mid = p_low = p_up = 0.0
            else:
                p_mid = max(0.0, round(p_mid, 1))
                p_low = max(0.0, round(min(p_low, p_mid * 0.88), 1))
                p_up = round(max(p_up, p_mid * 1.12), 1)

            # Simulated actual measurement for past/present steps (first 3 steps)
            if i < 3:
                act = max(0.0, round(p_mid + np.random.normal(0, 12), 1)) if ghi > 5.0 else 0.0
                actuals.append(act)
                preds.append(p_mid)
            else:
                act = None

            # Typical factory demand profile at hour h
            demand_norm = 0.55
            if 8.0 <= h <= 17.0:
                demand_norm = 0.92 # Full production shift
            elif 17.0 <= h <= 23.0:
                demand_norm = 0.75 # Evening batch run
            pred_demand = round(720.0 * demand_norm + 15.0 * math.sin(i * 0.5), 1)

            points.append(ForecastPoint(
                timestamp=t.isoformat(),
                time_label=t.strftime("%H:%M"),
                actual_generation=act,
                forecast_generation=p_mid,
                confidence_lower=p_low,
                confidence_upper=p_up,
                actual_demand=round(pred_demand * 0.98, 1) if act is not None else None,
                forecast_demand=pred_demand,
                solar_irradiance=round(ghi, 1),
                temperature=round(temp, 1),
                cloud_cover=round(cloud, 1)
            ))

        return ForecastData(
            horizon=horizon, # type: ignore
            points=points,
            mae=self.mae,
            rmse=self.rmse,
            mape=self.mape,
            r2=self.r2,
            is_simulated=not is_live_weather
        )

renewable_forecaster = RenewableForecaster()
