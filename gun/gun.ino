#include <Arduino.h>
#include <IRremoteESP8266.h>
#include <IRsend.h>
#include <M5StickCPlus.h>

const uint16_t kIrLed = 9; // M5StickC内蔵LED

IRsend irsend(kIrLed);  // Set the GPIO to be used to sending the message.

void setup() {
  irsend.begin();
  M5.begin();
  M5.Lcd.printf("complete set up");
}

void loop() {
  M5.update();
  if ( M5.BtnA.wasReleased() ) {
    irsend.sendNEC(0x15748B7);
  }
  delay(1);
}
