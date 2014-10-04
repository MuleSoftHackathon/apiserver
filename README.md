apiserver
=========

Central server which will be providing APIs for the remote control car, sphero,
and raspberry pi at the MuleSoftHackathon event.

URL Scheme
==========

Url Pattern
-----------
```
http://host/{deviceName}/{deviceId}/{action}
```

Devices
-------
The available device names are

1. rccar
2. sphero
3. pi

See files in the `/RAML` folder to learn more about the specification of the APIs.

Configuration
=============

key.config is the configuration for the device assignment and map

Example
------
```
{
  "accessKeys": {
    "MuleSoftHackathonTeam1": "team1",
    "MuleSoftHackathonTeam2": "team2",
    "MuleSoftHackathonTeam3": "team3",
    "MuleSoftHackathonTeam4": "team4",
    "MuleSoftHackathonTeam5": "team5",
    "MuleSoftHackathonTeam6": "team6",
    "MuleSoftHackathonTeam7": "team7",
    "MuleSoftHackathonTeam8": "team8",
    "MuleSoftHackathonTeam9": "team9",
    "MuleSoftHackathonTeam10": "team10"
  }
}

```
Set the access key for each team

User Interactions
=================

![alt text](http://i.imgur.com/CpXXlxq.png "Logo Title Text 1")

Instructions
============
This server should be hosted by Mulesoft, and give each team their access keys and device ids.

1. Install all the node dependencies
	```
	npm install
	```
2. Edit the key.config if needed
	```
	vim key.config
	```
3. Start the server
	```
	cd app
	node app
	```
Others
======
BluetoothServer and PiServer should be started after apiserver is started, otherwise, BluetoothServer and PiServer will run locally.

If BluetoothServer or PiServer is not registered to central apiserver (or you want to register them to another machine), there are REST apis to do that.

1. List the current server, for example
	```
	GET
		/deviceserver/pi?accessKey=MuleSoftHackathonTeam1
		/deviceserver/bluetooth?accessKey=MuleSoftHackathonTeam1
	```
2. Register a new server, for example
	```
	POST
		/deviceserver/register
	```
	in the request body, pass a json like the following
	```
	{
		"accessKey" : "xxxxxx",
		"type" : "pi or bluetooth",
		"host" : "new host for the server",
		"port" : "new port for the server"
	}
	```

If you want to do a POST request by browser, you can use a plug-in such as postman, post client, etc.

Setting up api-server at the event
=========================
1. Prepare the key.confg, and give each team their access key and their assigned deviced ids
2. Start the server, and give the host of the sever to the students
3. Let each team run their own setup
