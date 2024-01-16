#include <Arduino.h>
#include <assert.h>
#include <IRrecv.h>
#include <IRremoteESP8266.h>
#include <IRac.h>
#include <IRtext.h>
#include <IRutils.h>

#include <M5StickCPlus.h>
#include <M5_EzData.h>

#ifdef ARDUINO_ESP32C3_DEV
const uint16_t kRecvPin = 10;  // 14 on a ESP32-C3 causes a boot loop.
#else  // ARDUINO_ESP32C3_DEV
const uint16_t kRecvPin = 33;
#endif  // ARDUINO_ESP32C3_DEV

const uint32_t kBaudRate = 115200;
const uint16_t kCaptureBufferSize = 1024;

#if DECODE_AC
const uint8_t kTimeout = 50;
#else   // DECODE_AC
const uint8_t kTimeout = 15;
#endif  // DECODE_AC

const uint16_t kMinUnknownSize = 12;
const uint8_t kTolerancePercentage = kTolerance;  // kTolerance is normally 25%

#define LEGACY_TIMING_INFO false

// Use turn on the save buffer feature for more complete capture coverage.
IRrecv irrecv(kRecvPin, kCaptureBufferSize, kTimeout, true);
decode_results results;  // Somewhere to store the results

// Configure the name and password of the connected wifi and your token.
// Wi-Fi（2.4GHz）のSSIDとパスワード
const char* ssid = "WSD-O118";
const char* password = "kariyado";
// EzDataのトークン
const char* token = "qrqP0JDlDZQsU9EU9j3eL6a2UNYTHU4d";

// This section of code runs only once at start-up.
void setup() {
#if defined(ESP8266)
  Serial.begin(kBaudRate, SERIAL_8N1, SERIAL_TX_ONLY);
#else  // ESP8266
  Serial.begin(kBaudRate, SERIAL_8N1);
#endif  // ESP8266
  while (!Serial)  // Wait for the serial connection to be establised.
    delay(50);
  assert(irutils::lowLevelSanityCheck() == 0);

  Serial.printf("\n" D_STR_IRRECVDUMP_STARTUP "\n", kRecvPin);
#if DECODE_HASH
  irrecv.setUnknownThreshold(kMinUnknownSize);
#endif  // DECODE_HASH
  irrecv.setTolerance(kTolerancePercentage);  // Override the default tolerance.
  irrecv.enableIRIn();  // Start the receiver


  M5.begin();   //Initialize M5Stack
  if(setupWifi(ssid,password)){ //Connect to wifi.
    M5.Lcd.printf("Success connecting to %s\n",ssid);
  }else{
    M5.Lcd.printf("Connecting to %s failed\n",ssid);
  }
}

// The repeating section of the code
void loop() {
  // Check if the IR code has been received.
  if (irrecv.decode(&results)) {
    // 的にセンサーがヒットしたとき、その的は無効になる
    irrecv.disableIRIn();

    addPointToEzData();
  }
}

void addPointToEzData() {
  if(addToList(token,"pointList",1)){
    M5.Lcd.printf("Success sending 1 to the list\n");
  }else{
    M5.Lcd.print("Fail to save data\n");
    addPointToEzData();
  }
}
