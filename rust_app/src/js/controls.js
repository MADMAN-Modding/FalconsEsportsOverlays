/** Default value for the overlay */
let currentOverlay = "ssbu";

/** Array of all the different `JSON` keys */
let keys = ["scoreLeft", "scoreRight", "playerNamesLeft", "playerNamesRight", "teamNameLeft", "teamNameRight", "teamColorLeft", "teamColorRight", "week"];

let urls = ["NOT_SET"];

/**
 * Changes which sport's overlay is being displayed
 * @param {String} overlay 
 * @returns {void}
 */
function switchOverlay(overlay) {
  currentOverlay = overlay;

  writeOverlayJSON("overlay", overlay);

  overlays.forEach(overlay => {
    document.getElementById(overlay).style.backgroundColor = "transparent";
  });

  document.getElementById(overlay).style.backgroundColor = "gray";

  let name;
  if (nameMap[overlay] === undefined) {
    name = overlay;
  } else {
    name = nameMap[overlay];
  }

  pushNotification(`Overlay Changed to ${name}`);
}

/**
 * Iterates through the keys 
 * @returns {void}
 */
function updateOverlay() {
  const leftScore = document.getElementById("scoreLeft").value;
  const rightScore = document.getElementById("scoreRight").value;
  const playerNamesLeft = document.getElementById("playerNamesLeft").value;
  const playerNamesRight = document.getElementById("playerNamesRight").value;
  const leftTeamName = document.getElementById("teamNameLeft").value;
  const rightTeamName = document.getElementById("teamNameRight").value;
  const leftTeamColor = document.getElementById("teamColorLeft").value;
  const rightTeamColor = document.getElementById("teamColorRight").value;
  const week = document.getElementById("week").value;

  /** Array of all the values of the inputs */
  let values = [leftScore, rightScore, playerNamesLeft, playerNamesRight, leftTeamName, rightTeamName, leftTeamColor, rightTeamColor, week];

  for (let i = 0; i < keys.length; i++) {
    writeOverlayJSON(keys[i], `${values[i]}`);
  }

  pushNotification("Overlays Updated");
}

/**
 * Swaps the values of the two sides of the overlay
 * @returns {void}
 */
function swapTeams() {
  // Get current values
  const leftScore = document.getElementById("scoreLeft").value;
  const rightScore = document.getElementById("scoreRight").value;
  const playerNamesLeft = document.getElementById("playerNamesLeft").value;
  const playerNamesRight = document.getElementById("playerNamesRight").value;
  const leftTeamName = document.getElementById("teamNameLeft").value;
  const rightTeamName = document.getElementById("teamNameRight").value;
  const leftTeamColor = document.getElementById("teamColorLeft").value;
  const rightTeamColor = document.getElementById("teamColorRight").value;

  // Swap values
  document.getElementById("scoreLeft").value = rightScore;
  document.getElementById("scoreRight").value = leftScore;
  document.getElementById("playerNamesLeft").value = playerNamesRight;
  document.getElementById("playerNamesRight").value = playerNamesLeft;
  document.getElementById("teamNameLeft").value = rightTeamName;
  document.getElementById("teamNameRight").value = leftTeamName;
  document.getElementById("teamColorLeft").value = rightTeamColor;
  document.getElementById("teamColorRight").value = leftTeamColor;

  pushNotification("Teams Swapped");
}

/**
 * Updates the wins for the targeted team
 * @param {String} team - Left or Right Team
 * @param {number} wins - Amount of Wins
 * @returns {void}
 */
function updateWins(team, wins) {
  writeOverlayJSON(`wins${team}`, `${wins}`);

  pushNotification("Wins Updated");
}

/**
 * Calls the `generateImages` function to generate the image html
 * 
 * Waits 200 milliseconds to set the values of the input fields
 * 
 * Sets the `background-color` of the selected overlay to `gray`
 * @async
 * @returns {void}
 */
async function setupControls() {
  document.getElementById("preview-iframe").style.transform = `scale(${window.innerWidth * .8 / 1920})`;
  generateImages();

  // Delay to allow the page to load
  setTimeout(async function () {
    for (let i = 0; i < keys.length; i++) {
      document.getElementById(keys[i]).value = await readOverlayJSON(keys[i]);
    }
  }, 200);

  // Gets the ID of the current overlay
  let overlay = await readOverlayJSON("overlay");

  // Highlights the active overlay
  // document.getElementById(overlay).style.backgroundColor = "gray";
}

/**
 * Iterates through all the overlays and makes images based on the current value
 * 
 * @var nameMap - This is used for the alt text of the images  
 * @returns {void}
 */
async function generateImages() {
  if (urls[0] === "NOT_SET") {
    let paths = [];
    let codeDir = await invoke("get_code_dir");
    overlays.forEach(async overlay => {
      paths.push(`${codeDir}/overlays/images/${overlay}.png`);
    });
  
    urls = await getImageArray(paths);
  }
  
  for (let index = 0; index < overlays.length; index++) {
    let overlay = overlays[index];
    
    let overlayButtons = document.getElementById("overlayButtons");

    let sportEnabled = await readConfigJSON(`${overlay}Checked`);

    if (sportEnabled === "true") {
      let url = urls[index];
      
      overlayButtons.innerHTML += `
      <button id="${overlay}" class="overlay-button" onclick="switchOverlay('${overlay}')">
        <img src="${url}" alt="${nameMap[overlay]}" />
      </button>`
    }
  };
}

/**
 * Toggles the preview visibility
 * @returns {void}
 */
function togglePreview() {
  let preview = document.getElementById("preview");
  let app = document.getElementById("app");

  if (preview.style.display === "block") {
    preview.style.display = "none";
    app.style.display = "block";
  } else {
    preview.style.display = "block";
    app.style.display = "none";
  }
}