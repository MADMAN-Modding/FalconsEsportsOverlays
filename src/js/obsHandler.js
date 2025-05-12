let socket;
let pendingResponses = new Map(); // For awaiting responses by requestId

/**
 * Calls the Rust function `get_scene_collection` to get the list of OBS scenes
 * 
 * @async
 */
async function getSceneCollectionList() {
    return await invoke("get_scene_collection");
}

/** Injects the desired scene with the overlay browser
 * 
 * @returns {Promise<void>}
 * @async
 */
async function injectOBSScene() {
    const sceneCollection = document.getElementById("sceneCollections").value;

    await invoke("inject");

    if (sceneCollection === "Select a Scene Collection") {
        pushNotification("Invalid Selection");
        return;
    }

    await setTimeout(async () => {
        await connectWS();
    }, 5000)

    await setTimeout(async () => {
        await makeBrowser();
    }, 10000)

    pushNotification("Scene Injected");
}

async function genScenes() {
    const sceneCollection = document.getElementById("sceneCollections").value;

    document.getElementById("scenes").innerHTML = '<option value="Select a Scene">Select a Scene</option>';
    if (sceneCollection === "Select a Scene Collection") return;

    const scenes = await invoke("get_scenes", { collection: sceneCollection });

    scenes.forEach(scene => {
        document.getElementById("scenes").innerHTML += `<option value="${scene}">${scene}</option>`;
    });
}

async function connectWS() {
    const password = await invoke("get_ws_password");

    socket = new WebSocket("ws://localhost:4455");

    await new Promise((resolve, reject) => {
        socket.addEventListener("open", () => console.log("WebSocket opened."));
        
        socket.addEventListener("message", async (event) => {
            const msg = JSON.parse(event.data);

            if (msg.op === 0) {
                const auth = await computeAuth(
                    password,
                    msg.d.authentication.salt,
                    msg.d.authentication.challenge
                );

                socket.send(JSON.stringify({
                    op: 1,
                    d: {
                        rpcVersion: 1,
                        authentication: auth
                    }
                }));
            }

            if (msg.op === 2) {
                console.log("Successfully identified with OBS WebSocket.");
                connected = true;
                resolve();
            }

            if (msg.op === 7) {
                const { requestId, requestStatus } = msg.d;
                const handler = pendingResponses.get(requestId);
                if (handler) {
                    handler(requestStatus);
                    pendingResponses.delete(requestId);
                }
            }
        });

        socket.addEventListener("error", (err) => {
            reject(new Error("WebSocket connection failed."));
        });
    });
}

async function makeBrowser() {
    const scene = document.getElementById("scenes").value;
    const inputName = "Falcons Esports Overlays Browser";

    try {
        // Create new browser source
        await sendRequest("CreateInput", {
            sceneName: scene,
            inputName,
            inputKind: "browser_source",
            inputSettings: {
                url: "http://localhost:8080", // Corrected URL schema
                width: 1920,
                height: 1080
            }
        });
    } catch(err) {
        if (err.message.includes("exists")) {
            pushNotification("Source Already Exists");
        } else {
            pushNotification("Error Adding Source: " + err.message);
        }
    }
}

// Utility: send OBS WebSocket request and await result
function sendRequest(type, data) {
    return new Promise((resolve, reject) => {
        const id = crypto.randomUUID();
        pendingResponses.set(id, (status) => {
            if (status.result) resolve(status.responseData ?? {});
            else reject(new Error(`${type} failed: ${status.comment}`));
        });

        socket.send(JSON.stringify({
            op: 6,
            d: {
                requestType: type,
                requestId: id,
                requestData: data
            }
        }));
    });
}

// Compute base64 SHA256
async function sha256Base64(str) {
    const data = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

async function computeAuth(password, salt, challenge) {
    const secret = await sha256Base64(password + salt);
    const auth = await sha256Base64(secret + challenge);
    return auth;
}
