# VitalWatch Synthetic Patient Monitoring Dataset

## Files
- `vitalwatch_raw_readings.csv`: raw timestamped readings with patient ID and synthetic evaluation labels.
- `vitalwatch_model_features.csv`: same observations plus per-patient changes from the previous 5-minute reading.

## Dataset summary
- Synthetic records only; no real patient data.
- 80 synthetic patient IDs.
- 144 readings per patient at 5-minute intervals (12 hours per patient).
- Values and anomaly episodes are generated for software development and ML-pipeline testing.
- `label` is `normal` or `anomalous`.
- `anomaly_type` is `none`, `tachycardia_desaturation`, `hypotension`, `fever`, `bradycardia`, or `combined_change`.

## Important usage guidance
- Treat `label` and `anomaly_type` as evaluation metadata. Do NOT include them as Isolation Forest input features.
- Do not use `patient_id` or raw `timestamp` as numerical model inputs.
- Recommended initial Isolation Forest features:
  `heart_rate`, `spo2`, `systolic_bp`, `diastolic_bp`, `temperature`,
  `hr_change_5m`, `spo2_change_5m`, `sbp_change_5m`.
- The derived `*_change_5m` columns are differences from the previous observation. Rows are 5 minutes apart in this synthetic dataset. The first reading for each patient is excluded from the model-features CSV because no prior reading exists.
- `minutes_since_previous` is included for future handling of irregular observations.
- Fit Isolation Forest without labels, then compare its predictions with `label` on a held-out test set. Split by patient ID to reduce patient-level leakage.
- This dataset is intentionally synthetic and may contain unrealistic combinations. It is not suitable for clinical validation, diagnosis, treatment decisions, or performance claims.
