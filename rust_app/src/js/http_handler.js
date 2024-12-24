async function start_server() {
    invoke('run_server')
        .then((message) => push_notification(message))
        .catch((error) => push_notification(error));
}

function stop_server() {
    invoke('stop_server')
        .then((message) => push_notification(message))
        .catch((error) => push_notification(error));
}