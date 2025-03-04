
/**
 * Retrieves the bytes of the code directory image.
 * 
 * Creates a `Uint8Array` from the retrieved bytes.
 * 
 * Converts the `Uint8Array` into a `Blob` with the MIME type `image/png`.
 * 
 * Create of an `ObjectURL` of the blob
 * @returns {URL}
 * @async
*/
async function getImage(path) {
    let bytes;
    
    bytes = await invoke('get_image_bytes', {"imagePath" : path})
        .then((value) => bytes = value)
        .catch((error) => {pushNotification("Error Loading Images. Check if the overlay is downloaded"); return null;});

    if (bytes === null) {
        return "images/missing.jpg";
    }

    bytes = new Uint8Array(bytes);

    const blob = new Blob([bytes], { type: "image/png" });
    const imageURL = URL.createObjectURL(blob);

    return imageURL;
}

/**
 * Reads the supplied file as an `ArrayBuffer`
 * @param {File} file 
 * @returns {Promise<ArrayBuffer, Error>} Promise of the file
 */
function readFile(file) {
    return new Promise((resolve, reject) => {
        // Create file reader
        let reader = new FileReader();

        // Register event listeners
        reader.addEventListener("loadend", e => resolve(e.target.result));
        reader.addEventListener("error", reject);

        // Read file
        reader.readAsArrayBuffer(file);
    });
}