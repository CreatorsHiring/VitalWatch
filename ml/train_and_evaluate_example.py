import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import GroupShuffleSplit
import joblib

df = pd.read_csv("vitalwatch_model_features.csv")

FEATURES = [
    "heart_rate", "spo2", "systolic_bp", "diastolic_bp", "temperature",
    "hr_change_5m", "spo2_change_5m", "sbp_change_5m"
]

# Split by patient, not by random row, to reduce leakage.
splitter = GroupShuffleSplit(n_splits=1, test_size=0.25, random_state=42)
train_idx, test_idx = next(splitter.split(df, groups=df["patient_id"]))
train = df.iloc[train_idx].copy()
test = df.iloc[test_idx].copy()

# Unsupervised fit: labels are deliberately NOT passed to fit().
model = IsolationForest(
    n_estimators=200,
    contamination=0.05,  # rough starting point; tune using held-out evaluation
    random_state=42
)
model.fit(train[FEATURES])

# scikit-learn: -1 = anomaly, 1 = inlier
test["prediction"] = model.predict(test[FEATURES])
test["predicted_label"] = test["prediction"].map({-1: "anomalous", 1: "normal"})

print("Confusion matrix (rows=true, columns=predicted; order normal, anomalous):")
print(confusion_matrix(test["label"], test["predicted_label"],
                       labels=["normal", "anomalous"]))
print(classification_report(test["label"], test["predicted_label"],
                            labels=["normal", "anomalous"], zero_division=0))

joblib.dump(model, "vitalwatch_isolation_forest.joblib")
test.to_csv("vitalwatch_test_predictions.csv", index=False)
