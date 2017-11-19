$(function () {
    $('select').material_select();
    let weatherObj = {};
    //Page elements
    const $loadHigh = $("#loadHigh");
    const $loadMed = $("#loadMed");
    const $loadLow = $("#loadLow");
    const $timeSlotsList = $("#timeSlots-list");
    const $submitBtn = $('#submit');
    const $updateBtn = $('#update');
    const $timeSlotInputType = $('#typeOfDay');
    const $timeSlotInputHour = $('#hour');
    const $timeSlotInputMinute = $('#minute');
    const $timeSlotInputDuration = $('#duration');


    $updateBtn.hide();

    const errorHandler = (error) => {
        console.error(error);
    }

    //Get high time slots

    const getHighTimeSlots = () => {
        $.ajax({
            url: '/timeslots/high'
        }).done( (response) => {
            console.log(response);
            writeTimeSlots(response);
        }).fail(errorHandler);
    }

    const getMedTimeSlots = () => {
        $.ajax({
            url: '/timeslots/med'
        }).done( (response) => {
            console.log(response);
            writeTimeSlots(response);
        }).fail(errorHandler);
    }

    const writeTimeSlots = (timeSlots) => {
        $timeSlotsList.html('');
        timeSlots.forEach( (timeSlot) => {
            let btnUpdate = `<a id="update" class="btn-floating btn-small waves-effect waves-light green" data-id='${timeSlot._id}'><i class="material-icons">edit</i></a>`
            let btnDelete = `<a id="delete" class="btn-floating btn-small waves-effect waves-light red" data-id="${timeSlot._id}"><i class="material-icons">delete</i></a>`
            $timeSlotsList.append(`<tr><td>${timeSlot.typeOfDay}</td><td>${timeSlot.hour} : ${timeSlot.minute}</td><td>${timeSlot.duration}</td><td>${btnUpdate}</td><td>${btnDelete}</td></tr>`)
        });
    }

    const addTimeSlot = (timeSlot) => {
        $.ajax({
            method: 'POST',
            url: '/timeslots',
            data: timeSlot
        }).done( (response) => {
            getMedTimeSlots();
            $timeSlotInputType.val('');
            $timeSlotInputHour.val('');
            $timeSlotInputMinute.val('');
            $timeSlotInputDuration.val('');

        }).fail(errorHandler);
    }
    //Event Bindings

    //Get time slots
    $loadHigh.on('click.load', getHighTimeSlots);
    $loadMed.on('click.load', getMedTimeSlots);

        //Add time slot
        $submitBtn.on('click', () => {
            const newTimeSlot = {
                typeOfDay: $timeSlotInputType.val(),
                hour: $timeSlotInputHour.val(),
                minute: $timeSlotInputMinute.val(),
                duration: $timeSlotInputDurations.val() *1
            }
            console.log('newTimeSlot', newTimeSlot);
            //addTimeSlot(newTimeSlot);
            return false;
        });

});
