const $loadButton = $("#on");


/* 
document.getElementById('on').onclick = function() {
    console.log('button clicked');
    ledOn();
}; */

document.getElementById('off').onclick = function() {
    turnOff();
  };


  const ledOn = () => {
    $.ajax({
        url: '/on'
    }).done( (response) => {
        console.log(response);
    }).fail(console.log(response));
}

$loadButton.on('click.load', ledOn);
