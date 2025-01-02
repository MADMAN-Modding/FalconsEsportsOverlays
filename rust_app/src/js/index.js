const invoke = window.__TAURI__.core.invoke;

let overlays = ["ssbu", "kart", "overwatch", "rocketLeague", "splat", "val", "hearth", "lol", "chess", "madden", "nba2K"];

let nameMap = {
    "ssbu"         : "Super Smash Bros. Ultimate",
    "kart"         : "Mario Kart 8 Deluxe",
    "overwatch"    : "Overwatch",
    "rocketLeague" : "Rocket League",
    "splat"        : "Splatoon",
    "val"          : "Valorant",
    "hearth"       : "Hearth Stone",
    "lol"          : "League of Legends",
    "chess"        : "Chess",
    "madden"       : "Madden",
    "nba2K"        : "NBA 2K"
};

async function setupApp() {
    let color = await invoke('read_config_json', { "key" : "appTheme" }).then((value) => overlay = Array.from(value).filter(char => char !== "\"").join(''));
    
    setColor(color, true);
}