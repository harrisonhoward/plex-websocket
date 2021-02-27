const PlexAPI = require("plex-api");
const WSClient = require("./WebsocketClient");

/**
 * @typedef {"update.statechange" | "playing" | "backgroundProcessingQueue" | "progress" | "activity" | "unknown"} types
 */

/** 
 * @param {PlexAPI} plexInstance 
 * @param {(type: types, data: object) => void} onPacket 
 */
function PlexWebsocket(plexInstance, onPacket) {
    return new WSClient(plexInstance, onPacket);
}
PlexWebsocket.WebsocketClient = require("./WebsocketClient");
PlexWebsocket.Webhook = require("./structures/Websocket");
PlexWebsocket.PlexAPI = PlexAPI;
module.exports = PlexWebsocket;