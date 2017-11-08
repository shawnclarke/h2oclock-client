$(function () {
    
       const $onButton = $("#on");
       const $offButton = $("#off");
    
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
