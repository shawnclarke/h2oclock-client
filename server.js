var express = require('express');
var app = express();
var path = require('path');
var rpio = require('rpio');
var schedule = require('node-schedule');
var request = require('request');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

var openWeatherMaps = 'https://api.openweathermap.org/data/2.5/forecast?id=2634838&APPID=b7b73e00a4e940f2319cad207b3682f3';
var darkSkys = 'https://api.darksky.net/forecast/5ca5b0037be5109d0159838b86bd83e1/51.588124,-0.037381?exclude=currently,minutely,hourly,alerts,flags&units=uk2'
var weatherObj = {};
var typeOfDay = "";
var scheduledJobsArr = [];

//DB server
mongoose.Promise = global.Promise;
var promise = mongoose.connect('mongodb://localhost/client_config', {
  useMongoClient: true
});

promise.then(function (db) {
  console.log('DATABASE CONNECTED!!');
}).catch(function (err) {
  console.log('CONNECTION ERROR', err);
});

var Schema = mongoose.Schema;

var weatherSchema = new Schema({
  time: Date,
  summary: String,
  icon: String,
  temperatureHigh: Number,
  precipIntensity: Number,
  typeOfDay: String
});

var weather = mongoose.model('weather', weatherSchema);

var timeSlotSchema = new Schema({
  typeOfDay: String,
  hour: String,
  minute: String,
  duration: Number
});

var timeSlot = mongoose.model('timeSlot', timeSlotSchema);

//web server
app.use(express.static(__dirname + '/public'));

//Raspberry Pi on/off api
app.get('/on', function (req, res) {
  startWatering();
});

app.get('/off', function (req, res) {
  stopWatering()
});

//Time slots api
app.get('/timeslots/high', function (req, res) {
  timeSlot.find({
    typeOfDay: "high"
  }).exec(function (err, timeSlots) {
    if (err) {
      return res.status(500).send(err);
    }
    console.log(req.query);
    return res.json(timeSlots);
  });
});

app.get('/timeslots/med', function (req, res) {
  timeSlot.find({
    typeOfDay: "med"
  }).exec(function (err, timeSlots) {
    if (err) {
      return res.status(500).send(err);
    }
    console.log(req.query);
    return res.json(timeSlots);
  });
});

app.get('/timeslots/low', function (req, res) {
  timeSlot.find({
    typeOfDay: "low"
  }).exec(function (err, timeSlots) {
    if (err) {
      return res.status(500).send(err);
    }
    console.log(req.query);
    return res.json(timeSlots);
  });
});

app.post('/timeslots', function (req, res) {

  var newTimeSlot = new timeSlot(req.body);
  newTimeSlot.save(function (err, timeSlot) {
    if (err) {
      return res.status(500).send(err);
    }
    console.log('new time slot added');
    killScheduledJobs(typeOfDay);
    return res.status(201).json(timeSlot);
  })
});

app.delete('/timeslots/:id', function (req, res) {
  var timeSlotToBeDeleted = req.params.id;
  timeSlot.remove({
    _id: timeSlotToBeDeleted
  }, function (err, timeSlots, result) {
    if (err) {
      return res.status(500).send(err);
    }
    console.log('Time slot deleted');
    killScheduledJobs(typeOfDay);
    return res.status(202).send('DONE');
  });
});

app.put('/timeslots/:id', function (req, res) {
  var timeSlotToBeUpdated = req.params.id;
  var updates = req.body;
  timeSlot.findOneAndUpdate({
    _id: timeSlotToBeUpdated
  }, updates, function (err, timeSlots, result) {
    if (err) {
      return res.status(500).send(err);
    }
    console.log('Time slot amended');
    killScheduledJobs(typeOfDay);
    return res.status(202).send('DONE')
  });
})

//Type of day api
app.get('/typeofday', function (request, response) {
  return response.json(weatherObj);
});

app.listen(3333, function () {
  console.log('server is listening on port 3333');
});

//get the weather data

function getApiDataCallback(err, res, body) {
  if (err) {
    throw err;
  }
  var jsonObj = JSON.parse(body);
  setWeatherObj(jsonObj);
}

function getApiData(url, callback) {
  request(url, callback);
}

function setWeatherObj(body) {
  weatherObj.time = body.daily.data[0].time;
  weatherObj.summary = body.daily.data[0].summary;
  weatherObj.icon = body.daily.data[0].icon;
  weatherObj.temperatureHigh = body.daily.data[0].temperatureHigh;
  weatherObj.precipIntensity = body.daily.data[0].precipIntensity;
  setTypeOfDay();
}

function setTypeOfDay() {
  if ((weatherObj.temperatureHigh >= 30 && weatherObj.precipIntensity < 2) || (weatherObj.temperatureHigh >= 25 && weatherObj.precipIntensity < 1)) {
    typeOfDay = "high";
  } else if (weatherObj.temperatureHigh < 18 && weatherObj.precipIntensity > 1) {
    typeOfDay = "low";
  } else {
    typeOfDay = "med";
  }
  console.log(typeOfDay);
  weatherObj.typeOfDay = typeOfDay;
  writeWeatherToDb(weatherObj);
  killScheduledJobs(typeOfDay);
}

function writeWeatherToDb(weatherObj) {
  var todayWeather = new weather(weatherObj);
  todayWeather.save(function (err, weather) {
    if (err) {
      console.log(err);
    }
  })
}

//get timeslots for schedule and add to scheduleArr

function killScheduledJobs(typeOfDay) {
  if (scheduledJobsArr.length > 0) {
    scheduledJobsArr.forEach(function (element) {
      console.log('job is being killed', element);
      element.cancel();
      scheduledJobsArr = [];
    });
    getTimeSlots(typeOfDay);
  } else {
    getTimeSlots(typeOfDay);
  }
}

function getTimeSlots(typeOfDay) {
  switch (typeOfDay) {
    case 'high':
      getHighSlots();
      break;
    case 'med':
      getMedSlots();
      break;
    case 'low':
      getLowSlots();
      break;
  }
}

function getHighSlots() {
  timeSlot.find({
    typeOfDay: "high"
  }).exec(function (err, timeSlots) {
    if (err) {
      return res.status(500).send(err);
    }
    createJobSchedules(timeSlots);
  });
}

function getMedSlots() {
  timeSlot.find({
    typeOfDay: "med"
  }).exec(function (err, timeSlots) {
    if (err) {
      return res.status(500).send(err);
    }
    createJobSchedules(timeSlots);
  });
}

function getLowSlots() {
  timeSlot.find({
    typeOfDay: "low"
  }).exec(function (err, timeSlots) {
    if (err) {
      return res.status(500).send(err);
    }
    createJobSchedules(timeSlots);
  });
}

function createJobSchedules(timeSlots) {
  timeSlots.forEach(function (element) {
    scheduledJobsArr.push(
      schedule.scheduleJob({ hour: element.hour, minute: element.minute }, function () {
        console.log('Watering started!');
        setTimeout(function () {
          console.log('Watering stopped!');
        }, element.duration * 60000);
      }));
  });
}

//Do the watering - GPIO control

rpio.open(12, rpio.OUTPUT, rpio.LOW);

function startWatering() {
  rpio.write(12,  rpio.HIGH);
  console.log('Start watering!');
}

function stopWatering() {
  rpio.write(12,  rpio.Low);
  console.log('Stop watering!');
}
getApiData(darkSkys, getApiDataCallback);