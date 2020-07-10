$(() => {
    const startButton = $('#start');
    const stopButton = $('#stop');
    const setStartable = () => {
        stopButton.attr('disabled', 'disabled');
        startButton.attr('disabled', null);
    }
    const setStoppable = () => {
        startButton.attr('disabled', 'disabled');
        stopButton.attr('disabled', null);
    }
    $.ajax({
        type: 'GET',
        url: '/play',
        success: setStoppable,
        error: setStartable,
    });
    startButton.click(() => {
        console.log('start clicked!');
        $.ajax({
            type: 'POST',
            url: '/play',
            beforeSend: () => startButton.attr('disabled', 'disabled'),
            success: setStoppable,
            error: setStartable
        });
    });
    stopButton.click(() => {
        $.ajax({
            type: 'DELETE',
            url: '/play',
            beforeSend: () => stopButton.attr('disabled', 'disabled'),
            success: setStartable,
            error: setStoppable
        });
    });
})
