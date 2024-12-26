let server = false;

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
    server = true;
    document.getElementById("serverImage").src = "../images/ServerOn.png";
}

function serverOff() {
    server = false;
    document.getElementById("serverImage").src = "../images/ServerOff.png";
}

function setupServer() {
    document.getElementById("serverImage").src = ("../images/Server" + (server ? "On.png" : "Off.png"));
}