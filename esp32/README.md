# ESP32 + PN532 NFC - Módulo Inmovilizador

Este directorio contiene el código y documentación para el módulo ESP32 que se comunica con la aplicación Krino-Link para el sistema de Inmovilizador (IMO).

## 📋 Componentes Necesarios

| Componente | Cantidad | Descripción |
|------------|----------|-------------|
| ESP32 DevKit | 1 | Cualquier variante (WROOM, WROVER, etc.) |
| PN532 NFC Module V3 | 1 | Módulo NFC con soporte I2C |
| Cables Dupont | 4 | Hembra-Hembra para conexión I2C |
| Protoboard | 1 | Opcional, para pruebas |

## 🔌 Diagrama de Conexión (I2C)

```
ESP32                    PN532 NFC V3
┌─────────┐              ┌─────────────┐
│         │              │             │
│    3.3V ├──────────────┤ VCC         │
│         │              │             │
│     GND ├──────────────┤ GND         │
│         │              │             │
│  GPIO21 ├──────────────┤ SDA         │
│   (SDA) │              │             │
│         │              │             │
│  GPIO22 ├──────────────┤ SCL         │
│   (SCL) │              │             │
│         │              │             │
└─────────┘              └─────────────┘
```

### ⚠️ IMPORTANTE: Configurar PN532 en modo I2C

El módulo PN532 tiene dos switches DIP o jumpers para seleccionar el modo de comunicación:

| Switch 1 | Switch 2 | Modo |
|----------|----------|------|
| OFF | ON | **I2C** ← Usar este |
| ON | OFF | SPI |
| OFF | OFF | UART |

## 📦 Instalación

### 1. Instalar Arduino IDE
Descarga desde: https://www.arduino.cc/en/software

### 2. Configurar ESP32 en Arduino IDE

1. Ve a **Archivo → Preferencias**
2. En "URLs adicionales de gestor de placas" agrega:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
3. Ve a **Herramientas → Placa → Gestor de placas**
4. Busca "ESP32" e instala **esp32 by Espressif Systems**

### 3. Instalar Librerías Necesarias

Ve a **Herramientas → Administrar bibliotecas** e instala:

- **Adafruit PN532** (por Adafruit)
- **ArduinoJson** (por Benoit Blanchon)

O desde el gestor de librerías:
```
Adafruit PN532
ArduinoJson
```

### 4. Configurar el Código

Abre `inmovilizador_esp32.ino` y modifica:

```cpp
// ===== CONFIGURACIÓN WiFi =====
const char* ssid = "TU_NOMBRE_WIFI";        // ← Cambiar
const char* password = "TU_CONTRASEÑA";      // ← Cambiar
```

### 5. Subir el Código

1. Conecta el ESP32 por USB
2. Selecciona la placa: **Herramientas → Placa → ESP32 Dev Module**
3. Selecciona el puerto: **Herramientas → Puerto → COMx** (Windows) o `/dev/ttyUSB0` (Linux)
4. Haz clic en **Subir (→)**

## 🌐 Conectar la App con ESP32

### 1. Obtener la IP del ESP32

Después de subir el código, abre el **Monitor Serial** (115200 baudios).
Verás algo como:

```
Conectando a WiFi...
Conectado! IP: 192.168.1.105
Servidor HTTP iniciado en puerto 80
```

### 2. Configurar Variable de Entorno en la App

Crea o edita el archivo `.env.local` en la raíz del proyecto:

```bash
# En c:\Users\iramb\Desktop\krino-link\.env.local
NEXT_PUBLIC_API_ESP32=http://192.168.1.105
```

**Nota:** Cambia `192.168.1.105` por la IP que muestre tu ESP32.

### 3. Reiniciar la App

```bash
npm run dev
```

## 🔗 Endpoints API

El ESP32 expone los siguientes endpoints:

| Endpoint | Método | Descripción | Respuesta |
|----------|--------|-------------|-----------|
| `/` | GET | Estado del sistema | `{"status":"ok","nfc":"connected"}` |
| `/nfc/status` | GET | Estado del módulo NFC | `{"ok":true,"module":"PN532"}` |
| `/nfc/read` | GET | Leer tarjeta NFC (espera 10s) | `{"ok":true,"id":"XX:XX:XX:XX"}` |
| `/nfc/program` | GET | Confirmar programación | `{"ok":true,"programmed":true}` |

### Probar con el navegador:

1. Abre: `http://192.168.1.105/` → Debe mostrar JSON de estado
2. Abre: `http://192.168.1.105/nfc/status` → Estado del PN532
3. Abre: `http://192.168.1.105/nfc/read` → Acerca una tarjeta NFC

## 🐛 Solución de Problemas

### El ESP32 no se conecta al WiFi
- Verifica que el SSID y contraseña sean correctos
- Asegúrate de que el router esté en 2.4GHz (ESP32 no soporta 5GHz)

### El PN532 no es detectado
- Verifica los switches I2C (ver tabla arriba)
- Revisa las conexiones SDA (GPIO21) y SCL (GPIO22)
- Prueba con cables más cortos

### La app no se conecta al ESP32
- Verifica que ambos estén en la misma red WiFi
- Comprueba que el firewall no bloquee el puerto 80
- Prueba accediendo directamente desde el navegador

### Error CORS
El código ya incluye headers CORS, pero si hay problemas:
- Usa el navegador Chrome con la extensión "CORS Unblock" (solo desarrollo)
- O configura un proxy en Next.js

## 📁 Estructura de Archivos

```
esp32/
├── README.md                    # Esta documentación
├── inmovilizador_esp32.ino      # Código principal
└── esquematico.png              # Diagrama de conexión (opcional)
```

## 🔒 Seguridad

Este es un proyecto de demostración. Para producción:
- Implementar HTTPS
- Agregar autenticación
- Encriptar comunicaciones NFC
- No exponer el ESP32 a internet

---

**Desarrollado para Krino-Link** | Módulo de Inmovilizador (IMO)
