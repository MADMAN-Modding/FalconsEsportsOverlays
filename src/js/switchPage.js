/**
 * Switches to a new page by loading its HTML content and setting up page-specific functionalities.
 *
 * @param {string} page - The name of the page to load (e.g., "controls", "server", "config", "main").
 *
 * Fetches the specified page's HTML and inserts it into the document.
 *
 * Calls specific setup functions based on the page being loaded (e.g., `setupControls`, `setupServer`).
 */
async function switchPage(page) {
    // Fetch the HTML content of the specified page.
    await fetch(`pages/${page}.html`)
        .then(response => response.text()) // Convert the response to text.
        .then(html => {
            document.getElementById("page").innerHTML = html; // Insert the page HTML into the "page" element.
        })
        .catch(error => console.error("Error loading page:", error)); // Handle errors if page loading fails.

    // Call the setup function based on the page being loaded.
    if (page == "controls") {
        setupControls(); // Setup the controls page.
    } else if (page == "server") {
        setupServer(); // Setup the server page.
    } else if (page == "config") {
        setupConfig(); // Setup the configuration page.
    } else if (page == "main") {
        setupApp(); // Setup the main app page.
    } else if (page == "files") {
        setupDownloads(); //Setup the downloads page
    }
}

// Call the switchPage function to load the "main" page.
switchPage("main");