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
    const $timeSlotInputTypeOfDay = $('#typeOfDay');
    const $timeSlotInputHour = $('#hour');
    const $timeSlotInputMinute = $('#minute');
    const $timeSlotInputDuration = $('#duration');
    const $addUpdate = $('#addUpdate');
    let timeSlotToBeUpdatedId = '';


    $updateBtn.hide();

    const errorHandler = (error) => {
        console.error(error);
    }

    //Get high time slots

    const getHighTimeSlots = () => {
        $.ajax({
            url: '/timeslots/high'
        }).done((response) => {
            console.log(response);
            writeTimeSlots(response);
        }).fail(errorHandler);
    }

    const getMedTimeSlots = () => {
        $.ajax({
            url: '/timeslots/med'
        }).done((response) => {
            console.log(response);
            writeTimeSlots(response);
        }).fail(errorHandler);
    }

    const getLowTimeSlots = () => {
        $.ajax({
            url: '/timeslots/low'
        }).done((response) => {
            console.log(response);
            writeTimeSlots(response);
        }).fail(errorHandler);
    }

    const writeTimeSlots = (timeSlots) => {
        $timeSlotsList.html('');
        timeSlots.forEach((timeSlot) => {
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
        }).done((response) => {
            switch (timeSlot.typeOfDay) {
                case 'high':
                    getHighTimeSlots();
                    break;
                case 'med':
                    getMedTimeSlots();
                    break;
                case 'low':
                    getLowTimeSlots();
                    break;
            }
            $timeSlotInputTypeOfDay.val('')
            $timeSlotInputHour.val('')
            $timeSlotInputMinute.val('')
            $timeSlotInputDuration.val('')
        }).fail(errorHandler);
    }

    const deleteTimeSlot = (idToDelete) => {
        $.ajax({
            method: 'DELETE',
            url: '/timeslots/' + idToDelete
        }).done((response) => {
        }).fail(errorHandler);
    }

    const timeSlotUpdate = (timeSlot) => {
        $.ajax({
            method: 'PUT',
            url: '/timeslots/' + timeSlotToBeUpdatedId,
            data: timeSlot
        }).done((response) => {
            switch (timeSlot.typeOfDay) {
                case 'high':
                    getHighTimeSlots();
                    break;
                case 'med':
                    getMedTimeSlots();
                    break;
                case 'low':
                    getLowTimeSlots();
                    break;
            }
            $timeSlotInputTypeOfDay.val('')
            $timeSlotInputHour.val('')
            $timeSlotInputMinute.val('')
            $timeSlotInputDuration.val('')
        }).fail(errorHandler);
    }

    //Event Bindings

    //Get time slots
    $loadHigh.on('click.load', getHighTimeSlots);
    $loadMed.on('click.load', getMedTimeSlots);
    $loadLow.on('click.load', getLowTimeSlots);

    //Add time slot
    $submitBtn.on('click', () => {
        const newTimeSlot = {
            typeOfDay: $timeSlotInputTypeOfDay.val(),
            hour: $timeSlotInputHour.val(),
            minute: $timeSlotInputMinute.val(),
            duration: $timeSlotInputDuration.val() * 1
        }
        console.log('newTimeSlot: ', newTimeSlot);
        addTimeSlot(newTimeSlot);
        return false;
    });

    //Delete time slot
    $($timeSlotsList).on('click.delete', '#delete', function () {
        const $buttonD = $(this);
        const timeSlotToBeDeletedId = $buttonD.data('id');
        console.log('deleting: ', timeSlotToBeDeletedId);
        deleteTimeSlot(timeSlotToBeDeletedId);
        $buttonD.closest('tr').remove();
    });

    //Update time slot - load values in form
    $($timeSlotsList).on('click.update', '#update', function () {
        const $buttonU = $(this);
        timeSlotToBeUpdatedId = $buttonU.data('id');
        const typeofDayVal = $buttonU.parent().prev().prev().prev().text();
        const hourVal = $buttonU.parent().prev().prev().text().substr(0, 2);
        const minuteVal = $buttonU.parent().prev().prev().text().substr(5, 7);
        const durationVal = $buttonU.parent().prev().text();
        console.log('Updating: ', timeSlotToBeUpdatedId);
        $submitBtn.hide();
        $updateBtn.show();
        $addUpdate.text('Update a time slot');
        $timeSlotInputTypeOfDay.val(typeofDayVal);
        $timeSlotInputTypeOfDay.next().addClass('active');
        $timeSlotInputHour.val(hourVal);
        $timeSlotInputHour.next().addClass('active');
        $timeSlotInputMinute.val(minuteVal);
        $timeSlotInputMinute.next().addClass('active');
        $timeSlotInputDuration.val(durationVal);
        $timeSlotInputDuration.next().addClass('active');
    });

        //Submit update time slot
        $updateBtn.on('click', ($e) => {
            const updateTimeSlot = {
                _id: timeSlotToBeUpdatedId,
                typeOfDay: $timeSlotInputTypeOfDay.val(),
                hour: $timeSlotInputHour.val(),
                minute: $timeSlotInputMinute.val(),
                duration: $timeSlotInputDuration.val() * 1
            }
            console.log('starting to update');
            timeSlotUpdate(updateTimeSlot);
            console.log('update: ' + updateTimeSlot);
           return false;
       });



});
