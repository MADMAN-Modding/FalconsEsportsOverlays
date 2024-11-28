function read_overlay_json(key) {
    // Calls the read_overlay_json function from rust, passes the argument "key" with the value of key
    // Then takes the return value and prints it to the console
    invoke('read_overlay_json', { "key": key }).then((value) => console.log(value));
}