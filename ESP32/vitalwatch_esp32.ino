#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>   // requires ArduinoJson 7.x (JsonDocument)
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// ==================== WIFI ====================

const char* WIFI_SSID = "Wokwi-GUEST";
const char* WIFI_PASSWORD = "";

// ==================== VITALWATCH BACKEND ====================

// Replace this URL if Cloudflare is restarted and gives a new Quick Tunnel URL.
const char* API_URL =
  "https://latin-outside-cemetery-switching.trycloudflare.com/api/telemetry";

// Demo token only. Do not commit real tokens to GitHub.
const char* DEVICE_TOKEN = "123token";
const char* DEVICE_ID = "ESP32-DEMO-01";

// Send readings every 10 seconds for the demo
const unsigned long SEND_INTERVAL = 10000UL;
unsigned long lastSendTime = 0;

// ==================== OLED ====================

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_ADDRESS 0x3C

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// ==================== TEMPERATURE SENSOR ====================

#define TEMP_PIN 4

OneWire oneWire(TEMP_PIN);
DallasTemperature tempSensor(&oneWire);

// Value that is displayed AND sent to the backend.
float temperature = 36.8;

// True only when the DS18B20 gives a plausible human body temperature.
bool sensorIsPlausible = false;

unsigned long lastTempRead = 0;
const unsigned long TEMP_INTERVAL = 2000UL;

// The backend rejects temperatures outside 25-45 C. Wokwi's DS18B20
// defaults to 22 C, so we only trust the sensor in a realistic body range.
const float BODY_TEMP_MIN = 34.0;
const float BODY_TEMP_MAX = 42.0;

// ==================== SIMULATED VITALS ====================

// These values are simulated, not actual patient measurements.
int heartRate = 78;
int spo2 = 98;
int systolicBp = 120;
int diastolicBp = 80;

// ==================== OLED DISPLAY ====================

void showDisplay(String status) {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);

  display.setTextSize(1);
  display.setCursor(0, 0);
  display.println("VitalWatch SIM");

  display.setCursor(0, 12);
  display.print("HR: ");
  display.print(heartRate);
  display.println(" bpm");

  display.setCursor(0, 22);
  display.print("SpO2: ");
  display.print(spo2);
  display.println("%");

  display.setCursor(0, 32);
  display.print("BP: ");
  display.print(systolicBp);
  display.print("/");
  display.println(diastolicBp);

  display.setCursor(0, 42);
  display.print("Temp: ");
  display.print(temperature, 1);
  display.println(" C");

  display.setCursor(0, 54);
  display.print(status);

  display.display();
}

// ==================== TEMPERATURE READING ====================

void readTemperature() {
  tempSensor.requestTemperatures();

  float value = tempSensor.getTempCByIndex(0);

  if (value != DEVICE_DISCONNECTED_C &&
      value >= BODY_TEMP_MIN &&
      value <= BODY_TEMP_MAX) {
    // Real sensor value is a believable body temperature: use it.
    temperature = value;
    sensorIsPlausible = true;
  } else {
    // Sensor missing, or reading (e.g. Wokwi default 22 C) is not a body
    // temperature. A simulated value is generated at send time instead.
    sensorIsPlausible = false;
  }
}

// ==================== WIFI CONNECTION ====================

void connectWiFi() {
  Serial.print("Connecting to WiFi");

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi connected!");
  Serial.print("ESP32 IP: ");
  Serial.println(WiFi.localIP());
}

// ==================== SEND DATA TO BACKEND ====================

void sendTelemetry() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected. Reconnecting...");
    WiFi.reconnect();
    showDisplay("WiFi disconnected");
    return;
  }

  // Synthetic HR and SpO2 values for the simulation.
  heartRate = random(68, 91);
  spo2 = random(95, 100);

  // BP is fixed simulated data; no BP sensor is connected.
  systolicBp = 120;
  diastolicBp = 80;

  // If the sensor value is not a plausible body temperature,
  // simulate one between 36.5 and 37.5 C.
  if (!sensorIsPlausible) {
    temperature = 36.5 + (random(0, 11) / 10.0);
  }
  temperature = round(temperature * 10.0) / 10.0;  // 1 decimal place

  WiFiClientSecure client;

  // Development testing only. This disables certificate validation.
  // Production deployments must validate the HTTPS certificate.
  client.setInsecure();

  HTTPClient http;
  http.setTimeout(10000);

  Serial.println();
  Serial.println("Connecting to VitalWatch backend...");

  if (!http.begin(client, API_URL)) {
    Serial.println("Failed to initialize HTTP");
    showDisplay("HTTP init failed");
    return;
  }

  // Required headers
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-Device-Token", DEVICE_TOKEN);

  // Build the exact backend JSON structure. Do not include patientId.
  JsonDocument doc;

  doc["deviceId"] = DEVICE_ID;
  doc["heartRate"] = heartRate;
  doc["spo2"] = spo2;
  doc["systolicBp"] = systolicBp;
  doc["diastolicBp"] = diastolicBp;
  doc["temperature"] = temperature;
  doc["signalQuality"] = "Simulated";

  String payload;
  serializeJson(doc, payload);

  Serial.println("Sending JSON:");
  Serial.println(payload);

  // Send POST request
  int statusCode = http.POST(payload);

  Serial.print("HTTP status: ");
  Serial.println(statusCode);

  if (statusCode > 0) {
    String response = http.getString();

    Serial.println("Backend response:");
    Serial.println(response);

    if (statusCode >= 200 && statusCode < 300) {
      Serial.println("Telemetry accepted!");
      showDisplay("API OK " + String(statusCode));
    } else {
      Serial.println("Backend rejected telemetry");
      showDisplay("API ERR " + String(statusCode));
    }
  } else {
    Serial.print("Request failed: ");
    Serial.println(http.errorToString(statusCode));
    showDisplay("API: conn fail");
  }

  http.end();
}

// ==================== SETUP ====================

void setup() {
  Serial.begin(115200);
  delay(500);

  randomSeed(micros());

  // Start I2C for the OLED.
  Wire.begin(21, 22);

  if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDRESS)) {
    Serial.println("OLED initialization failed");
  } else {
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);
    display.println("VitalWatch");
    display.println("Starting...");
    display.display();
  }

  // Start DS18B20 temperature sensor.
  tempSensor.begin();
  tempSensor.setWaitForConversion(true);

  readTemperature();

  // Connect to Wokwi's simulated WiFi.
  connectWiFi();

  showDisplay("WiFi connected");

  Serial.println();
  Serial.println("VitalWatch ESP32 ready");
  Serial.println("Backend: POST /api/telemetry");
  Serial.println("Device: ESP32-DEMO-01");
  Serial.println("Interval: 10 seconds");
}

// ==================== MAIN LOOP ====================

void loop() {
  unsigned long now = millis();

  // Refresh temperature periodically.
  if (now - lastTempRead >= TEMP_INTERVAL) {
    lastTempRead = now;
    readTemperature();
  }

  // Send immediately on the first loop, then every 10 seconds.
  if (lastSendTime == 0 || now - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = now;
    sendTelemetry();
  }

  delay(50);
}
