
/**
 * Retrieves the bytes of the code directory image.
 * 
 * Creates a `Uint8Array` from the retrieved bytes.
 * 
 * Converts the `Uint8Array` into a `Blob` with the MIME type `image/png`.
 * 
 * Create of an `ObjectURL` of the blob
 * @returns {Promise<URL>}
 * @async
*/
async function getImage(path) {
    let bytes;
    
    bytes = await invoke('get_image_bytes', {"imagePath" : path})
        .then((value) => bytes = value)
        .catch(() => {pushNotification("Error Loading Images. Check if the overlay is downloaded"); return null;});

    if (bytes === null) {
        return "images/missing.jpg";
    }

    bytes = new Uint8Array(bytes);

    const blob = new Blob([bytes], { type: "image/png" });
    const imageURL = URL.createObjectURL(blob);

    return imageURL;
}

/**
 * Retrieves the bytes of the code directory image.
 * 
 * Creates a `Uint8Array` from the retrieved bytes.
 * 
 * Converts the `Uint8Array` into a `Blob` with the MIME type `image/png`.
 * 
 * Create of an `ObjectURL` of the blob
 * 
 * @param {Array<String>} paths
 * 
 * @async 
 * @returns {Promise<Array<URL>, Error>} Promise of the images
 */
async function getImageArray(paths) {
    let bytes = [];
    let urls = [];

    // invoke('get_image_vec_bytes', {"imagePaths" : paths})
    //     .then((value) => bytes = value)
    //     .catch(() => {pushNotification("Error Loading Images. Check if the overlay is downloaded"); bytes.push(null);}
    // );
    
    bytes = await invoke('get_image_vec_bytes', {"imagePaths" : paths});

    // Check for null values
    for (let i = 0; i < bytes.length; i++) {
        if (bytes[i] === null) {
            bytes[i] = "images/missing.jpg";
        } else {
            bytes[i] = new Uint8Array(bytes[i]);

            const blob = new Blob([bytes[i]], { type: "image/png" });
            urls.push(URL.createObjectURL(blob));
        }
    }

    return urls;
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