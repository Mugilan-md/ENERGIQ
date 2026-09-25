# ENERGIQ Machine Learning & Forecasting Architecture

## 1. Overview
ENERGIQ implements dual time-series forecasting pipelines:
1. **Renewable Generation Forecaster**: Predicts Solar PV / Wind farm output across multi-step horizons (15-min, 30-min, 1-hour, 6-hour, 24-hour).
2. **Industrial Load Forecaster**: Predicts facility-wide and sub-load power demand based on production schedules, shift patterns, and ambient factors.

## 2. Feature Engineering

### Solar PV / Wind Features
- **Temporal**: Hour of day (cyclical sine/cosine), Day of week, Month of year, Day of year.
- **Meteorological**:
  - Global Horizontal Irradiance (GHI) in $W/m^2$
  - Direct Normal Irradiance (DNI) and Diffuse Horizontal Irradiance (DHI)
  - Ambient Temperature (°C) and Cell Temperature estimate
  - Cloud cover index (%)
  - Relative humidity (%)
  - Wind speed ($m/s$) at 10mhub height
- **Lagged & Rolling**:
  - Lags: $t-15m, t-30m, t-1h, t-24h$
  - Rolling mean, standard deviation, and exponential moving averages over 1h, 3h, and 6h windows.

### Industrial Load Features
- **Production & Schedule Features**:
  - Current Shift ID (Shift 1: Morning, Shift 2: Evening, Shift 3: Night)
  - Production batch schedule (units planned/hour)
  - Factory operating mode (Full Production, Ramp-down, Maintenance, Weekend)
- **Machine State Flags**:
  - CNC active spindle count
  - HVAC chiller thermal setpoints and external heat-index
  - Compressed air line pressure gradient

## 3. Modeling Architecture
The baseline ML architecture uses:
- **GradientBoostingRegressor / RandomForestRegressor** (optimized with Scikit-Learn) with Quantile Regression for uncertainty estimation (10th, 50th, 90th percentiles).
- Modular architecture with `BaseForecaster` abstract interface allowing drop-in upgrades to LightGBM, XGBoost, or Temporal Fusion Transformers (TFT).

## 4. Evaluation Metrics
- **Mean Absolute Error (MAE)**: $\frac{1}{N}\sum |y_i - \hat{y}_i|$
- **Root Mean Squared Error (RMSE)**: $\sqrt{\frac{1}{N}\sum (y_i - \hat{y}_i)^2}$
- **Mean Absolute Percentage Error (MAPE)**: $\frac{100\%}{N}\sum \left|\frac{y_i - \hat{y}_i}{y_i}\right|$
- **Pinball Loss** for 10% and 90% confidence uncertainty prediction intervals.
