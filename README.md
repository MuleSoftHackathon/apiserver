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
	"BTServerKeys": {
		"somecomplexaccesskey": "team1"
		"anothercomplexaccesskey": "team2"
	},
	"BTDeviceMap":  {
	    "someidforsphero1": "team1",
	    "someidforsphero2": "team2"
	    "someidforrccar1": "team1",
	    "someidforrccar2": "team2"
  }
}
```
Set the access key for each team in BluetoothServerKeys
Set the device Id and their assignment in BtDeviceMap

User Interactions
=================

![alt text](http://i.imgur.com/CpXXlxq.png "Logo Title Text 1")

Instructions
============
This server should be hosted by Mulesoft, and give each team their access keys and device ids.

0. Install all the node dependencies
```
npm install
```
1. Edit the key.config if needed
```
vim key.config
```
2. Start the server
```
node app
```

Setting up api-server at the event
=========================
1. Prepare the key.confg, give each team their access key, and their assigned deviced ids
2. Start the server, and give the host of the sever to the students
3. Let each team run their own setup
