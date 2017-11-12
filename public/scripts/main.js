$(function () {
    let weatherObj = {};
    //Page elements
    const $onButton = $("#on");
    const $offButton = $("#off");

    //skyicons
    var skycons = new Skycons({"color": "blue"});

  //Get weather summary
  const getWeather = (function () {
    $.ajax({
        url: '/typeofday'
    }).done((response) => {
        writeWeather(response);
    });
})();

const writeWeather = (weatherObj) => {
    console.log(weatherObj.icon);
    skycons.add("icon1", Skycons.partly-cloudy-day);
    skycons.play();
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
