/** Default value for the overlay */
let currentOverlay = "ssbu";

/** Array of all the different `JSON` keys */
let keys = ["scoreLeft", "scoreRight", "playerNamesLeft", "playerNamesRight", "teamNameLeft", "teamNameRight", "teamColorLeft", "teamColorRight", "week"];

/**
 * Changes which sport's overlay is being displayed
 * @param {String} overlay 
 * @returns {void}
 */
function switchOverlay(overlay) {
  currentOverlay = overlay;

  write_overlay_json("overlay", overlay);

  overlays.forEach(overlay => {
    document.getElementById(overlay).style.backgroundColor = "transparent";
  });

  document.getElementById(overlay).style.backgroundColor = "gray";

  push_notification("Overlay Changed");
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
    write_overlay_json(keys[i], `${values[i]}`);
  }

  push_notification("Overlays Updated");
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
}

/**
 * Updates the wins for the targeted team
 * @param {String} team - Left or Right Team
 * @param {number} wins - Amount of Wins
 * @returns {void}
 */
function updateWins(team, wins) {
  write_overlay_json(`wins${team}`, `${wins}`);

  push_notification("Wins Updated");
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
  generateImages();

  // Delay to allow the page to load
  setTimeout(async function () {
    for (let i = 0; i < keys.length; i++) {
      document.getElementById(keys[i]).value = await read_overlay_json(keys[i]);
    }
  }, 200);

  // Gets the ID of the current overlay
  let overlay = await read_overlay_json("overlay");

  // Highlights the active overlay
  document.getElementById(overlay).style.backgroundColor = "gray";
}

/**
 * Iterates through all the overlays and makes images based on the current value
 * 
 * @var nameMap - This is used for the alt text of the images  
 * @returns {void}
 */
function generateImages() {
  overlays.forEach(async overlay => {
    let overlayButtons = document.getElementById("overlayButtons");

    let sportEnabled = await read_config_json(`${overlay}Checked`);

    if (sportEnabled === "true") {
      overlayButtons.innerHTML += `
      <button id="${overlay}" class="overlay-button" onclick="switchOverlay('${overlay}')">
        <img src="images/${overlay}.png" alt="${nameMap[overlay]}" />
      </button>`
    }
  });

}