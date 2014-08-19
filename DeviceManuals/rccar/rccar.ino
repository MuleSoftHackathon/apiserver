#include <SoftwareSerial.h>

const int 
BT_RX   = 2,
BT_TX   = 4,
// Left Motor
DIR_A   = 12,
PWM_A   = 3,
BRAKE_A = 9,
SNS_A   = A0,
// Right Motor
DIR_B   = 13,
PWM_B   = 11,
BRAKE_B = 8,
SNS_B   = A1;

int curSpeed = 0;

void setup() {
  pinMode(BRAKE_A, OUTPUT);
  pinMode(DIR_A, OUTPUT);
  pinMode(BRAKE_B, OUTPUT);
  pinMode(DIR_B, OUTPUT);

  Serial.begin(9600);
  PRINTREADY();
}

void loop() {
  if (Serial.available()) {
    char toSend = (char)Serial.read();
    if(toSend == 'F') {
      STOP();
      FORWARD();
      PRINTOK();
    }
    else if (toSend == 'B') {
      STOP();
      BACKWARD();
      PRINTOK();
    }
    else if (toSend == 'L') {
      STOP();
      LEFT();
      PRINTOK();
    }
    else if (toSend == 'R') {
      STOP();
      RIGHT();
      PRINTOK();
    }
    else if (toSend == 'G') {
      READY();
      GO();
      PRINTOK();
    }
    else if (toSend == 'S') {
      STOP();
      PRINTOK();
    }
    else if (toSend == 'V') {
      int s = Serial.parseInt();
      POWER(s);
      PRINTPOWER();
    }
    else if (toSend == 's') {
      PRINTSENSING();
    }
    else  {
      PRINTERROR();
    }
  }
}

void READY() {
  if(curSpeed == 0) {
    curSpeed = 191;
  }
}

void POWER(int s) {
  if (s < 127) {
    curSpeed = 127;
  } 
  else if (s > 255) {
    curSpeed = 255;
  } 
  else {
    curSpeed = s;
  }
}

void STOP(){
  digitalWrite(BRAKE_A, HIGH);
  digitalWrite(BRAKE_B, HIGH);
  analogWrite(PWM_A, 0);
  analogWrite(PWM_B, 0);
}

void GO() {
  digitalWrite(BRAKE_A, LOW);
  digitalWrite(BRAKE_B, LOW);
  analogWrite(PWM_A, curSpeed);
  analogWrite(PWM_B, curSpeed);
}

void FORWARD() {
  digitalWrite(DIR_A, HIGH);
  digitalWrite(DIR_B, HIGH);
}

void BACKWARD() {
  digitalWrite(DIR_A, LOW);
  digitalWrite(DIR_B, LOW); 
}

void LEFT() {
  digitalWrite(DIR_A, LOW);
  digitalWrite(DIR_B, HIGH);
}

void RIGHT() {
  digitalWrite(DIR_A, HIGH);
  digitalWrite(DIR_B, LOW);
}

void PRINTOK() {
  Serial.println("{\"status\":\"ok\"}");
}

void PRINTERROR() {
  Serial.println("{\"status\":\"error\"}");
}

void PRINTREADY() {
  Serial.println("{\"status\":\"ready\"}");
}

void PRINTPOWER() {
  Serial.print("{\"status\":\"ok\",\"power\":");
  Serial.print(curSpeed);
  Serial.println("}");
}

void PRINTSENSING() {
  int a = analogRead(SNS_A);
  int b = analogRead(SNS_B);
  Serial.print("{\"status\":\"ok\",\"left\":");
  Serial.print(a);
  Serial.print(",\"right\":");
  Serial.print(b);
  Serial.println("}");
}









