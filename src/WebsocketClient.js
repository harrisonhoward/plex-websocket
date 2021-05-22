const PlexAPI = require("plex-api");
const Websocket = require("./structures/Websocket");

/**
 * @typedef {"update.statechange" | "playing" | "backgroundProcessingQueue" | "progress" | "activity" | "unknown"} types
 */

/**
 * @typedef { { UPDATESTATECHANGE: "update.statechange", PLAYING: "playing", BACKGROUNDPROCESSINGQUEUE: "backgroundProcessingQueue", PROGRESS: "progress", ACTIVITY: "activity", UNKNOWN: "unknown" } } PACKETTYPES
 */

module.exports = class WebsocketClient {
    /**
     * @param {PlexAPI} plexInstance 
     * @param {(type: types, data: object) => void} onPacket 
     */
    constructor(plexInstance, onPacket) {
        if (plexInstance instanceof PlexAPI) {
            /**
             * @type {PlexAPI.hostname}
             */
            this.hostname = plexInstance.hostname;
            /**
             * @type {PlexAPI.port}
             */
            this.port = plexInstance.port;
            /**
             * @type {PlexAPI.authToken}
             */
            this.token = plexInstance.authToken;
        } else {
            throw new TypeError("WebsocketClient : PLEXINSTANCE must be an instance of PlexAPI");
        }
        if (typeof onPacket !== "function") {
            throw new TypeError("WebsocketClient : ONPACKET must be a function");
        }
        /**
         * @type {(type: types, data: object) => void}
         */
        this.onPacket = onPacket;
        /**
         * @type {Websocket}
         */
        this.websocket = new Websocket(
            this.hostname,
            `ws://${this.hostname}:${this.port}/:/websockets/notifications?X-Plex-Token=${this.token}`,
            this.onPacket
        ).init();
    }

    /**
     * @type {PACKETTYPES}
     * @static
     */
    static PACKETTYPES = {
        UPDATESTATECHANGE: "update.statechange",
        PLAYING: "playing",
        BACKGROUNDPROCESSINGQUEUE: "backgroundProcessingQueue",
        PROGRESS: "progress",
        ACTIVITY: "activity",
        UNKNOWN: "unknown"
    }
}