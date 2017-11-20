# h2oclock-client
**Current status of project:**  
settings.html still need further work  
Scheduling in server.js needs to be implemented  
  
**Introduction**  
This project is an inteligent control for garden irrigation.  
An Internet connected Raspberry Pi is also connected (via GPIO header) to a relay which connects to a solinoid operated valve on an irrigation system.  
A nodeJs server runs on the Pi and it checks for the weather forecast each morning for the upcoming day, works out which level of watering is required (high, med or low) and refers to a DB where watering time slot information is held for that level of watering.  A scheduler operates the solinoid valve via the GPIO header based on the time slots.  
There is a web interface to setup the watering time slots and to override the wattering control.  
  
**Installation**  
Mongo DB needs to be installed  
npm install will install all required node modules except for rpio - this module will not work on a Windows machine and maybe not a Mac?  So if testing or doing dev work on a machine other than a Raspberry Pi things will be fine, if installing on a Pi, also run: npm install rpio  
  
**Running**  
First, start mongod   
There are two serverJs files, again this is so dev/testing work can be completed on a machine which isn't a Raspberry Pi.  server.js is the file to run on a Rpi (node server.js) and serverDev.js is a copy of server.js but it has any rpio module references commented out so please run this if not on a Rpi - obviously there will not be any rpio functionality.  
Web ui can be access from http://localhost:3333
  
**Technologies used**  
Server:  
Raspberry Pi hardware runs Express, MongoDB, cron like scheduler, Dark Sky weather api and a rpio module to allow nodeJs access to the GPIO headers on the Raspberry Pi  
Web ui:  
Fairly standard web ui, using Materializecss, Ajax requests to DB  
