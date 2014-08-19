Instructions on Assembling the rccar
====================================

Board
-----
0. (optional) Cut the VIN connect on the back of Arduino UNO board to seperate the power source for the controller and motors.
1. Mount motor shield on top of Arduino UNO board
2. Programming the controller
	1. Connect the arduino to a laptop via USB
	2. Open rccar.ino with Arduino IDE
	3. Choose Tools -> Serial Port -> /dev/tty.usbmodemXXXX
	4. upload the program to the controller.
3. Connect Bluetooth chip on to the motor shield
	pin connection

	| Bluetooth Reciever | Arduino |
	| ------------- | ----------- |
	| tx | rx |
	| rx | tx |
	| vin | 3.3v |
	| gnd | gnd |

4. Connect AA battery pack to the Arduino board, soldering pins on the wires if necessary

	| Battery Pack | Arduino |
	| ------------- | ----------- |
	| Red | vin |
	| Black | gnd |

5. Solder wires on to the motors, connect the motors parallelly for each side
and connect one side to Motor A, and the other side to Motor B
6. Connect 9v battery to the motor power
7. Make sure the motors move as wanted, using Arduino IDE -> Serial Monitor to test with simple commands

	| Serial Port Command | Description |
	| ------------- | ----------- |
	| F | Prepare motors for moving forwards |
	| B | Prepare motors for moving backwards |
	| L | Prepare motors for rotating left (left go backwards, and right go forwards) |
	| R | Prepare motors for rotating right (left go forwards, and right go backwards) |
	| G | Move |
	| V{Integer} | Set the motor power to {Integer} (between 191 and 255) |
	| s | Print sensing |

8. Assemble the car chassi, and fix the board on top (mark forward position for motor aligning)
