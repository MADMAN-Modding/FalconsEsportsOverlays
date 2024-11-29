function buildButton(id, text, onclick) {
    console.log(id);
    let button = document.getElementById(id);
    button.innerHTML = text;
    button.onclick = onclick;
}

function buildTeamColumn(teamSide, id) {
    let column = document.getElementById(id);

    // Start fresh
    column.innerHTML = `<h3>${teamSide} Team</h3>`;
    column.innerHTML += `<h4>${teamSide} Wins</h4>`;

    for (let i = 0; i < 2; i++) {
        // Create a new row for buttons
        let rowId = `${teamSide.toLowerCase()}ButtonsRow${i}`;
        column.innerHTML += `<div class='row' id='${rowId}'></div>`;

        let buttonRow = document.getElementById(rowId);

        for (let j = 0; j < 3; j++) {
            // Create a unique button ID
            let buttonId = `${teamSide.toLowerCase()}Button${i}${j}`;
            buttonRow.innerHTML += `<div class='col button' id='${buttonId}'>Button ${j}</div>`;
        }
    }

    // Attach event listeners after making buttons
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 3; j++) {
            let buttonId = `${teamSide.toLowerCase()}Button${i}${j}`;
            let button = document.getElementById(buttonId);

            button.onclick = () => {
                write_overlay_json(`wins${teamSide}`, `${j}`);
            };
            
        }
    }
}
