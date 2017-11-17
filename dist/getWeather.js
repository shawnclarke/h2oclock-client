"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApiDataCallback = exports.getApiData = undefined;

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var weatherObj = {}; //var request = require('request');

var typeOfDay = "";

function getApiDataCallback(err, res, body) {
  if (err) {
    throw err;
  }
  var jsonObj = JSON.parse(body);
  setWeatherObj(jsonObj);
}

function getApiData(url, callback) {
  (0, _request2.default)(url, callback);
}

function setWeatherObj(body) {
  weatherObj.summary = body.daily.data[0].summary;
  weatherObj.icon = body.daily.data[0].icon;
  weatherObj.temperatureHigh = body.daily.data[0].temperatureHigh;
  weatherObj.precipIntensity = body.daily.data[0].precipIntensity;
  setTypeOfDay();
}

function setTypeOfDay() {
  if (weatherObj.temperatureHigh >= 30 && weatherObj.precipIntensity < 2 || weatherObj.temperatureHigh >= 25 && weatherObj.precipIntensity < 1) {
    typeOfDay = "high";
  } else if (weatherObj.temperatureHigh < 18 && weatherObj.precipIntensity > 1) {
    typeOfDay = "low";
  } else {
    typeOfDay = "med";
  }
  console.log(typeOfDay);
  weatherObj.typeOfDay = typeOfDay;
  console.log(weatherObj.temperatureHigh);
  console.log(weatherObj.precipIntensity);
}

exports.getApiData = getApiData;
exports.getApiDataCallback = getApiDataCallback;