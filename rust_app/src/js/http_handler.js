async function start_server() {
    invoke('run_server')
        .then((message) => console.log("Message"))
        .catch((error) => console.log(error));
}