// Initialize values
let currentOverlay = "ssbu";

let keys = ["scoreLeft", "scoreRight", "playerNamesLeft", "playerNamesRight", "teamNameLeft", "teamNameRight", "teamColorLeft", "teamColorRight", "week"];

function switchOverlay(overlay) {
  currentOverlay = overlay;

  write_overlay_json("overlay", overlay);

  overlays.forEach(overlay => {
    document.getElementById(overlay).style.backgroundColor = "transparent";
  });

  document.getElementById(overlay).style.backgroundColor = "gray";

  push_notification("Overlay Changed");
}

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

  console.log("Overlay updated with the following values:");
  console.log({
    leftScore,
    rightScore,
    playerNamesLeft,
    playerNamesRight,
    leftTeamName,
    rightTeamName,
    leftTeamColor,
    rightTeamColor,
    week
  });

  let values = [leftScore, rightScore, playerNamesLeft, playerNamesRight, leftTeamName, rightTeamName, leftTeamColor, rightTeamColor, week];

  for (let i = 0; i < keys.length; i++) {
    write_overlay_json(keys[i], `${values[i]}`);
  }

  push_notification("Overlays Updated");
}

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

  console.log("Teams swapped!");
}

function updateWins(team, wins) {
  console.log(`${team} team has ${wins} wins`);

  write_overlay_json(`wins${team}`, `${wins}`);
}


async function setupControls() {
  generateImages();

  // Delay to allow the page to load
  setTimeout(function () {
    for (let i = 0; i < keys.length; i++) {
      invoke('read_overlay_json', { "key": keys[i] }).then((value) => document.getElementById(keys[i]).value = Array.from(value).filter(char => char !== "\"").join(''));
    }
  }, 200);

  // Highlights the active overlay
  let overlay;

  await invoke('read_overlay_json', { "key": "overlay" }).then((value) => overlay = Array.from(value).filter(char => char !== "\"").join(''));

  document.getElementById(overlay).style.backgroundColor = "gray";
}

function generateImages() {
  overlays.forEach(async overlay => {
    let overlayButtons = document.getElementById("overlayButtons");

    let sportEnabled = await read_config_json(`${overlay}Checked`);

    console.log(sportEnabled);

    if (sportEnabled === "true") {
      overlayButtons.innerHTML += `
      <button id="${overlay}" class="overlay-button" onclick="switchOverlay('${overlay}')">
        <img src="images/${overlay}.png" alt="${nameMap[overlay]}" />
      </button>`
    }
  });

}