async function switchPage(page) {
    await fetch(`pages/${page}.html`)
    .then(response => response.text())
    .then(html => {
        document.getElementById("page").innerHTML = html;
    })
    .catch(error => console.error("Error loading page:", error));

    if (page == "controls") {
        setupControls();
    } else if (page == "server") {
        setupServer();
    } else if (page == "config") {
        setupConfig();
    }
}

switchPage("main");