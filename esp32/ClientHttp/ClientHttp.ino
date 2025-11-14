#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>


//wifi config
#define ssid "IZZI-0EA1"
#define password "escorpion123"

//leds pins
#define led_temperatura 19
#define led_error1 21
#define led_error2 22
#define led_error3 23


WebServer server(80);

void handleLedControl() {
  // Cabeceras CORS
  //allow all origins
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");


  if (!server.hasArg("temp")) {
    server.send(400, "text/plain", "Falta parametro de temperatura");
    return;
  }

  int temperatura = server.arg("temp").toInt();
  int temperatura_limite = 200;
  if (temperatura >= temperatura_limite) {
    digitalWrite(led_temperatura, HIGH);
  } else {
    digitalWrite(led_temperatura, LOW);
  }
  server.send(200, "text/plain", "TEMPERATURA RECIBIDA");
}

void handleErrores() {
  // Cabeceras CORS
  //allow all origins
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");

  // Manejar preflight OPTIONS request
  if (server.method() == HTTP_OPTIONS) {
    server.send(200, "text/plain", "");
    return;
  }

  //verificar metodo correcto
  if (server.method() != HTTP_POST) {
    server.send(400, "text/plain", "HTTP equivocado");
    return;
  }

  String body = server.arg("plain");
  StaticJsonDocument<200> doc;
  //verificar buen parse json
  DeserializationError error = deserializeJson(doc, body);
  if (error) {
    server.send(400, "application/json", "{\"error\":\"JSON inválido\"}");
    return;
  }

  //recibir errores
  bool error1 = doc["error1"];
  bool error2 = doc["error2"];
  bool error3 = doc["error3"];

  //encender o apagar leds
  digitalWrite(led_error1, error1 ? HIGH : LOW);
  digitalWrite(led_error2, error2 ? HIGH : LOW);
  digitalWrite(led_error3, error3 ? HIGH : LOW);


  server.send(200, "text/plain", "ok");
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  pinMode(led_temperatura, OUTPUT);
  pinMode(led_error1, OUTPUT);
  pinMode(led_error2, OUTPUT);
  pinMode(led_error3, OUTPUT);


  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Conectado a WiFi");
  Serial.println(WiFi.localIP());
  Serial.print("Gateway: ");
  Serial.println(WiFi.gatewayIP());

  //handle for temperatura
  server.on("/temperatura", HTTP_GET, handleLedControl);

  //handle for errores
  server.on("/errores", HTTP_POST, handleErrores);
  server.on("/errores", HTTP_OPTIONS, handleErrores);


  server.begin();
}

void loop() {
  server.handleClient();
}
