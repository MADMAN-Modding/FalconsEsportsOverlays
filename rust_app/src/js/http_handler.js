async function start_server() {
    invoke('run_server')
        .then((message) => {push_notification(message); serverOn();})
        .catch((error) => push_notification(error));
}

async function stop_server() {
    invoke('stop_server')
        .then((message) => {push_notification(message); serverOff();})
        .catch((error) => push_notification(error));
}

function serverOn() {
    document.getElementById("serverImage").src = "../images/ServerOn.png";
}

function serverOff() {
    document.getElementById("serverImage").src = "../images/ServerOff.png";
}