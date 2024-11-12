function switchPage(page) {
    fetch(`pages/${page}.html`)
    .then(response => response.text())
    .then(html => {
        document.getElementById("page").innerHTML = html;
    })
    .catch(error => console.error("Error loading page:", error));
}

switchPage("main");