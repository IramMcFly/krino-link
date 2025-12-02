/*
 * ============================================
 * KRINO-LINK - Módulo Inmovilizador ESP32
 * ============================================
 * 
 * Este código permite a la ESP32 comunicarse con la app Krino-Link
 * para el sistema de programación de llaves NFC (Inmovilizador/IMO).
 * 
 * Hardware:
 * - ESP32 DevKit
 * - PN532 NFC Module V3 (modo I2C)
 * 
 * Conexiones:
 * - ESP32 GPIO21 (SDA) → PN532 SDA
 * - ESP32 GPIO22 (SCL) → PN532 SCL
 * - ESP32 3.3V → PN532 VCC
 * - ESP32 GND → PN532 GND
 * 
 * Autor: Krino-Link Team
 * Fecha: Diciembre 2024
 */

#include <WiFi.h>
#include <WebServer.h>
#include <Wire.h>
#include <Adafruit_PN532.h>
#include <ArduinoJson.h>

// ===== CONFIGURACIÓN WiFi =====
// ¡IMPORTANTE! Cambiar estos valores por los de tu red
const char* ssid = "TU_NOMBRE_WIFI";
const char* password = "TU_CONTRASEÑA_WIFI";    

// ===== CONFIGURACIÓN I2C para PN532 =====
#define SDA_PIN 21
#define SCL_PIN 22

// Crear instancia del PN532 en modo I2C
Adafruit_PN532 nfc(SDA_PIN, SCL_PIN);

// Servidor HTTP en puerto 80
WebServer server(80);

// Variables globales
bool nfcConectado = false;
String ultimaLlaveLeida = "";
unsigned long ultimaLectura = 0;

// ===== FUNCIONES DE UTILIDAD =====

// Convierte el UID de la tarjeta a formato XX:XX:XX:XX
String uidToString(uint8_t* uid, uint8_t uidLength) {
  String result = "";
  for (uint8_t i = 0; i < uidLength; i++) {
    if (i > 0) result += ":";
    if (uid[i] < 0x10) result += "0";
    result += String(uid[i], HEX);
  }
  result.toUpperCase();
  return result;
}

// Agregar headers CORS a todas las respuestas
void setCorsHeaders() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}

// ===== ENDPOINTS HTTP =====

// GET / - Estado general del sistema
void handleRoot() {
  setCorsHeaders();
  
  StaticJsonDocument<256> doc;
  doc["status"] = "ok";
  doc["device"] = "ESP32-Krino-IMO";
  doc["nfc"] = nfcConectado ? "connected" : "disconnected";
  doc["uptime"] = millis() / 1000;
  doc["ip"] = WiFi.localIP().toString();
  
  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

// GET /nfc/status - Estado del módulo NFC
void handleNfcStatus() {
  setCorsHeaders();
  
  StaticJsonDocument<128> doc;
  doc["ok"] = nfcConectado;
  doc["module"] = "PN532";
  doc["protocol"] = "I2C";
  
  if (nfcConectado) {
    doc["message"] = "Módulo NFC listo";
  } else {
    doc["message"] = "Módulo NFC no detectado";
  }
  
  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

// GET /nfc/read - Leer tarjeta NFC (espera hasta 10 segundos)
void handleNfcRead() {
  setCorsHeaders();
  
  StaticJsonDocument<256> doc;
  
  if (!nfcConectado) {
    doc["ok"] = false;
    doc["error"] = "Módulo NFC no conectado";
    String response;
    serializeJson(doc, response);
    server.send(503, "application/json", response);
    return;
  }
  
  Serial.println("📡 Esperando tarjeta NFC...");
  
  uint8_t uid[7];
  uint8_t uidLength;
  
  // Esperar hasta 10 segundos por una tarjeta
  // timeout en milisegundos: 10000ms = 10s
  bool success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength, 10000);
  
  if (success) {
    String uidStr = uidToString(uid, uidLength);
    ultimaLlaveLeida = uidStr;
    ultimaLectura = millis();
    
    Serial.print("✅ Tarjeta detectada! UID: ");
    Serial.println(uidStr);
    
    doc["ok"] = true;
    doc["id"] = uidStr;
    doc["type"] = (uidLength == 4) ? "MIFARE Classic" : "MIFARE Ultralight";
    doc["length"] = uidLength;
    
    String response;
    serializeJson(doc, response);
    server.send(200, "application/json", response);
  } else {
    Serial.println("⏱️ Timeout - No se detectó tarjeta");
    
    doc["ok"] = false;
    doc["error"] = "Timeout - No se detectó tarjeta";
    doc["timeout"] = 10;
    
    String response;
    serializeJson(doc, response);
    server.send(408, "application/json", response);
  }
}

// GET /nfc/program - Confirmar programación de llave
void handleNfcProgram() {
  setCorsHeaders();
  
  String idLlave = server.arg("id");
  String vehiculo = server.arg("vehiculo");
  
  StaticJsonDocument<256> doc;
  
  if (idLlave.length() == 0) {
    doc["ok"] = false;
    doc["error"] = "Falta parámetro 'id'";
    String response;
    serializeJson(doc, response);
    server.send(400, "application/json", response);
    return;
  }
  
  // En un sistema real, aquí se escribiría en la EEPROM o memoria
  Serial.println("🔐 Programando llave...");
  Serial.print("   ID: ");
  Serial.println(idLlave);
  Serial.print("   Vehículo: ");
  Serial.println(vehiculo);
  
  // Simular tiempo de programación
  delay(500);
  
  doc["ok"] = true;
  doc["programmed"] = true;
  doc["id"] = idLlave;
  doc["vehiculo"] = vehiculo;
  doc["timestamp"] = millis();
  
  Serial.println("✅ Llave programada exitosamente");
  
  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

// GET /nfc/last - Obtener última llave leída
void handleNfcLast() {
  setCorsHeaders();
  
  StaticJsonDocument<128> doc;
  
  if (ultimaLlaveLeida.length() > 0) {
    doc["ok"] = true;
    doc["id"] = ultimaLlaveLeida;
    doc["timestamp"] = ultimaLectura;
    doc["age"] = (millis() - ultimaLectura) / 1000;
  } else {
    doc["ok"] = false;
    doc["message"] = "No hay lecturas recientes";
  }
  
  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

// Manejar preflight CORS (OPTIONS)
void handleCors() {
  setCorsHeaders();
  server.send(204);
}

// Manejar rutas no encontradas
void handleNotFound() {
  setCorsHeaders();
  
  StaticJsonDocument<128> doc;
  doc["ok"] = false;
  doc["error"] = "Endpoint no encontrado";
  doc["path"] = server.uri();
  
  String response;
  serializeJson(doc, response);
  server.send(404, "application/json", response);
}

// ===== ENDPOINTS ADICIONALES PARA DTCs (compatibilidad) =====

// GET /DTC - Control de LEDs de DTCs
void handleDTC() {
  setCorsHeaders();
  
  String modulo = server.arg("modulo");
  String state = server.arg("state");
  
  StaticJsonDocument<128> doc;
  doc["ok"] = true;
  doc["modulo"] = modulo;
  doc["state"] = state;
  
  Serial.print("🚗 DTC - Módulo: ");
  Serial.print(modulo);
  Serial.print(" | Estado: ");
  Serial.println(state);
  
  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

// GET /deleteDTC - Eliminar DTCs
void handleDeleteDTC() {
  setCorsHeaders();
  
  StaticJsonDocument<64> doc;
  doc["ok"] = true;
  doc["deleted"] = true;
  
  Serial.println("🗑️ DTCs eliminados");
  
  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

// GET /moduloDiag - Diagnóstico de módulo
void handleModuloDiag() {
  setCorsHeaders();
  
  String modulo = server.arg("modulo");
  
  StaticJsonDocument<128> doc;
  doc["ok"] = true;
  doc["modulo"] = modulo;
  doc["status"] = "active";
  
  Serial.print("🔧 Diagnóstico - Módulo: ");
  Serial.println(modulo);
  
  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

// ===== SETUP =====
void setup() {
  // Iniciar Serial para debug
  Serial.begin(115200);
  delay(1000);
  
  Serial.println();
  Serial.println("╔════════════════════════════════════════╗");
  Serial.println("║   KRINO-LINK - Módulo Inmovilizador    ║");
  Serial.println("║         ESP32 + PN532 NFC              ║");
  Serial.println("╚════════════════════════════════════════╝");
  Serial.println();
  
  // Inicializar I2C
  Wire.begin(SDA_PIN, SCL_PIN);
  
  // Inicializar PN532
  Serial.println("🔌 Inicializando módulo NFC PN532...");
  nfc.begin();
  
  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.println("❌ No se encontró el módulo PN532");
    Serial.println("   Verifica las conexiones I2C:");
    Serial.println("   - SDA → GPIO21");
    Serial.println("   - SCL → GPIO22");
    Serial.println("   - VCC → 3.3V");
    Serial.println("   - GND → GND");
    Serial.println("   - Switches en modo I2C (OFF-ON)");
    nfcConectado = false;
  } else {
    Serial.print("✅ PN532 encontrado! Firmware v");
    Serial.print((versiondata >> 24) & 0xFF, DEC);
    Serial.print(".");
    Serial.println((versiondata >> 16) & 0xFF, DEC);
    
    // Configurar PN532 para leer tarjetas RFID
    nfc.SAMConfig();
    nfcConectado = true;
  }
  
  Serial.println();
  
  // Conectar a WiFi
  Serial.print("📶 Conectando a WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  int intentos = 0;
  while (WiFi.status() != WL_CONNECTED && intentos < 30) {
    delay(500);
    Serial.print(".");
    intentos++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("✅ WiFi conectado!");
    Serial.print("   IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println();
    Serial.println("❌ No se pudo conectar al WiFi");
    Serial.println("   Verifica SSID y contraseña");
  }
  
  Serial.println();
  
  // Configurar rutas del servidor HTTP
  server.on("/", HTTP_GET, handleRoot);
  server.on("/", HTTP_OPTIONS, handleCors);
  
  // Endpoints NFC
  server.on("/nfc/status", HTTP_GET, handleNfcStatus);
  server.on("/nfc/status", HTTP_OPTIONS, handleCors);
  server.on("/nfc/read", HTTP_GET, handleNfcRead);
  server.on("/nfc/read", HTTP_OPTIONS, handleCors);
  server.on("/nfc/program", HTTP_GET, handleNfcProgram);
  server.on("/nfc/program", HTTP_OPTIONS, handleCors);
  server.on("/nfc/last", HTTP_GET, handleNfcLast);
  server.on("/nfc/last", HTTP_OPTIONS, handleCors);
  
  // Endpoints de compatibilidad con otros módulos
  server.on("/DTC", HTTP_GET, handleDTC);
  server.on("/DTC", HTTP_OPTIONS, handleCors);
  server.on("/deleteDTC", HTTP_GET, handleDeleteDTC);
  server.on("/deleteDTC", HTTP_OPTIONS, handleCors);
  server.on("/moduloDiag", HTTP_GET, handleModuloDiag);
  server.on("/moduloDiag", HTTP_OPTIONS, handleCors);
  
  server.onNotFound(handleNotFound);
  
  // Iniciar servidor
  server.begin();
  Serial.println("🌐 Servidor HTTP iniciado en puerto 80");
  Serial.println();
  Serial.println("═══════════════════════════════════════════");
  Serial.println("  Endpoints disponibles:");
  Serial.println("  • GET /              → Estado del sistema");
  Serial.println("  • GET /nfc/status    → Estado del NFC");
  Serial.println("  • GET /nfc/read      → Leer tarjeta NFC");
  Serial.println("  • GET /nfc/program   → Programar llave");
  Serial.println("  • GET /nfc/last      → Última lectura");
  Serial.println("═══════════════════════════════════════════");
  Serial.println();
  Serial.println("🟢 Sistema listo!");
  Serial.println();
}

// ===== LOOP =====
void loop() {
  // Manejar peticiones HTTP
  server.handleClient();
  
  // Pequeño delay para estabilidad
  delay(10);
}
