async function start_server() {
    invoke('run_server')
        .then((message) => console.log(message))
        .catch((error) => console.log(error));
}