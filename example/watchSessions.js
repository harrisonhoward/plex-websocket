const LOGININFO = {
    hostname: "255.255.255.255",
    username: "example@gmail.com",
    token: "app.plex.tv/desktop => Inspect => Application => Local Storage => myPlexAccessToken"
};
const PlexAPI = require("plex-api");
const PlexLogin = new PlexAPI(LOGININFO);

const PlexWebsocket = require("../src/index");

/**
 * @typedef {"update.statechange" | "playing" | "backgroundProcessingQueue" | "progress" | "activity" | "unknown"} types
 */
/**
 * @type {(type: types, data: object) => void}
 */
function onPacket(type, data) {
    if (type === PlexWebsocket.WebsocketClient.PACKETTYPES.PLAYING) {
        console.log("\nPlaying State Change");
        console.log("Session IDs: ", data.PlaySessionStateNotification.map(session => session.sessionKey).join(", "));
        console.log("Rating Keys: ", data.PlaySessionStateNotification.map(session => session.ratingKey).join(", "));
        console.log("States: ", data.PlaySessionStateNotification.map(session => session.state).join(", "));
    }
}

const WSClient = new PlexWebsocket.WebsocketClient(PlexLogin, onPacket);
WSClient.websocket.on("connect", () => console.log("Connected"));
WSClient.websocket.on("error", err => console.log("Error\n", err));
WSClient.websocket.on("debug", message => console.log("Debug\n", message));