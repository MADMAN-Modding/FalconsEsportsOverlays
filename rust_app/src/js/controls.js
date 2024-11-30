// Initialize values
let currentOverlay = "ssbu";



let keys = ["scoreLeft", "scoreRight", "playerNamesLeft", "playerNamesRight", "teamNameLeft", "teamNameRight", "teamColorLeft", "teamColorRight", "week"];

function switchOverlay(overlay) {
  currentOverlay = overlay;

  write_overlay_json("overlay", overlay);

  console.log("Switched to overlay:", overlay);
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
  for (let i = 0; i < keys.length; i++) {
    await invoke('read_overlay_json', { "key" : keys[i] }).then((value) => document.getElementById(keys[i]).innerHTML = Array.from(value).filter(char => char !== "\"").join(''));
  }
}