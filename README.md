apiserver
=========

Central server for Rest API


URL Scheme
==========

Url Pattern
-----------
http://host/{deviceName}/{deviceId}/{action}

Devices
-------
The available device names are

1. rccar
2. sphero
3. pi

Please see RAML about the specification of the APIs.

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

0. Install node, and package
	cd apiserver
	npm install
1. Config the key.config
2. Start the server 
	node app




