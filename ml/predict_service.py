import json
import os
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
import pandas as pd
import joblib

# Load the trained Isolation Forest model once at startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), "vitalwatch_isolation_forest.joblib")
print(f"Loading Isolation Forest model from {MODEL_PATH}...")
model = joblib.load(MODEL_PATH)
print("Model loaded successfully.")

FEATURES = [
    "heart_rate", "spo2", "systolic_bp", "diastolic_bp", "temperature",
    "hr_change_5m", "spo2_change_5m", "sbp_change_5m"
]

class PredictHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        if self.path == "/health" or self.path == "/api/ml/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "healthy",
                "model": "vitalwatch_isolation_forest",
                "features": FEATURES
            }).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == "/predict" or self.path == "/api/ml/predict":
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            try:
                data = json.loads(body)
                # Expecting readings or single reading dictionary
                # Extract features
                hr = float(data.get("heart_rate", 75))
                spo2 = float(data.get("spo2", 98))
                sbp = float(data.get("systolic_bp", 120))
                dbp = float(data.get("diastolic_bp", 80))
                temp = float(data.get("temperature", 37.0))
                
                hr_change = float(data.get("hr_change_5m", 0.0))
                spo2_change = float(data.get("spo2_change_5m", 0.0))
                sbp_change = float(data.get("sbp_change_5m", 0.0))

                input_df = pd.DataFrame([{
                    "heart_rate": hr,
                    "spo2": spo2,
                    "systolic_bp": sbp,
                    "diastolic_bp": dbp,
                    "temperature": temp,
                    "hr_change_5m": hr_change,
                    "spo2_change_5m": spo2_change,
                    "sbp_change_5m": sbp_change
                }])[FEATURES]

                # scikit-learn: -1 = anomaly, 1 = inlier
                prediction_val = int(model.predict(input_df)[0])
                # decision_function gives signed distance to separating hyperplane (lower = more abnormal)
                raw_decision_score = float(model.decision_function(input_df)[0])
                # score_samples returns opposite of anomaly score defined in original paper
                sample_score = float(model.score_samples(input_df)[0])

                is_anomaly = (prediction_val == -1)
                label = "anomalous" if is_anomaly else "normal"

                response = {
                    "success": True,
                    "prediction": prediction_val,
                    "label": label,
                    "is_anomaly": is_anomaly,
                    "decision_score": round(raw_decision_score, 4),
                    "anomaly_score": round(1.0 - (raw_decision_score + 0.5), 4),
                    "features": {
                        "heart_rate": hr,
                        "spo2": spo2,
                        "systolic_bp": sbp,
                        "diastolic_bp": dbp,
                        "temperature": temp,
                        "hr_change_5m": hr_change,
                        "spo2_change_5m": spo2_change,
                        "sbp_change_5m": sbp_change
                    }
                }

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

def run(port=5001):
    server_address = ('', port)
    httpd = HTTPServer(server_address, PredictHandler)
    print(f"VitalWatch Python Isolation Forest Inference Service running on port {port}...")
    httpd.serve_forever()

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5001
    run(port)
