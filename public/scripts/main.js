$(function () {
    let weatherObj = {};
    //Page elements
    const $onButton = $("#on");
    const $offButton = $("#off");
    const $weatherData = $("#weatherData");
    const $waterAmount = $("#waterAmount");

    //skyicons
    var skycons = new Skycons({ "color": "lightblue" });

    //Get weather summary
    const getWeather = (function () {
        $.ajax({
            url: '/typeofday'
        }).done((response) => {
            writeWeather(response);
        });
    })();

    const writeWeather = (weatherObj) => {
        skycons.add("icon1", weatherObj.icon);
        skycons.play();
        $weatherData.append(`<p><strong>Weather summary:</strong> ${weatherObj.summary}</p>`);
        $weatherData.append(`<p><strong>High temperature:</strong> ${weatherObj.temperatureHigh}</p>`);
        $weatherData.append(`<p><strong>Max precipitation intensity:</strong> ${weatherObj.precipIntensity}</p>`);
        $waterAmount.append(`<h1 style="color: #2196F3"> ${weatherObj.typeOfDay}</h1>`);
    }


    //Pi control on/off

    const ledOn = () => {
        $.ajax({
            url: '/on'
        }).done((response) => {
            console.log(response);
        });
    }

    const ledOff = () => {
        $.ajax({
            url: '/off'
        }).done((response) => {
            console.log(response);
        });
    }

    $onButton.on('click', ledOn);
    $offButton.on('click', ledOff);




});
