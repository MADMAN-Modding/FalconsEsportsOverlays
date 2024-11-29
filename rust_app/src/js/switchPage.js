async function switchPage(page) {
    await fetch(`pages/${page}.html`)
    .then(response => response.text())
    .then(html => {
        document.getElementById("page").innerHTML = html;
    })
    .catch(error => console.error("Error loading page:", error));

    if (page == "controls") {
        console.log("Hi from Controls")
        buildTeamColumn("Left", "leftTeamColumn")
    }
}

switchPage("main");