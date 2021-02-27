const ws = require("ws");

let EventEmitter;
try {
    // @ts-ignore
    EventEmitter = require("eventemitter3");
} catch (err) {
    EventEmitter = require("events").EventEmitter;
}

/**
 * @typedef {"update.statechange" | "playing" | "backgroundProcessingQueue" | "progress" | "activity" | "unknown"} types
 */

/**
 * @typedef { { UPDATESTATECHANGE: "update.statechange", PLAYING: "playing", BACKGROUNDPROCESSINGQUEUE: "backgroundProcessingQueue", PROGRESS: "progress", ACTIVITY: "activity", UNKNOWN: "unknown" } } PACKETTYPES
 */

module.exports = class Websocket extends EventEmitter {
    /**
     * @param {string} address 
     * @param {string} url 
     * @param {(type: types, data: object) => void} packet 
     */
    constructor(address, url, packet) {
        super();
        /**
         * @type {PACKETTYPES}
         */
        this.PACKETTYPES = require("../WebsocketClient").PACKETTYPES;
        /**
         * @type {string}
         */
        this.id = address;
        /**
         * @type {string}
         */
        this.url = url;

        if (!this.id
            || typeof this.id !== "string") {
            throw new TypeError("Websocket : ID must be a string");
        }
        if (!this.url
            || typeof this.url !== "string") {
            throw new TypeError("Websocket : URL must be a string");
        }
        if (typeof packet === "function") {
            /**
             * @type {(type: types, data: object) => void}
             */
            this.packet = packet;
        } else {
            throw new TypeError("Websocket : PACKET must be a function");
        }

        this._onOpen = this._onOpen.bind(this);
        this._onMessage = this._onMessage.bind(this);
        this._onError = this._onError.bind(this);
        this._onClose = this._onClose.bind(this);
    }

    /**
     * @returns {Websocket}
     */
    init() {
        this.status = "connecting";
        this.ws = new ws(this.url);
        this.ws.on("open", this._onOpen);
        this.ws.on("message", this._onMessage);
        this.ws.on("error", this._onError);
        this.ws.on("close", this._onClose);

        this.connectionTimeout = setTimeout(() => {
            if (this.connecting) {
                new Error("Connection timed out");
            }
        }, 30000);
        this.connecting = true;
        return this;
    }

    _onOpen() {
        this.status = "handshaking";
        this.emit("connect", this.id);
    }

    _onMessage(data) {
        try {
            if (data) {
                data = JSON.parse(data);
            }
            if (data.NotificationContainer) {
                this.connecting = false;
                data = data.NotificationContainer;
                if (data.type) {
                    if (Object.values(this.PACKETTYPES).includes(data.type)) {
                        this.packet(data.type, data);
                    } else {
                        this.packet("unknown", data);
                    }
                }
            }
        } catch (err) {
            this.emit("error", err, this.id);
        }
    }

    _onError(err) {
        this.emit("error", err, this.id);
        this.ws.terminate();
        process.exit(0);
    }

    _onClose(code, reason) {
        this.emit("debug", "WS Disconnected - " + JSON.stringify({
            code: code,
            reason: reason,
            status: this.status
        }));
        let err = !code || code === 1000 ? null : new Error(`${code}: ${reason}`);
        if (code) {
            this.emit("debug", `${code === 1000 ? "Clean" : "Unclean"} WS Close: ${code} - ${reason}`, this.id);
            if (code >= 4000 || code <= 4999) {
                err = new Error(`Plex error code: ${code}`);
            } else if (code !== 1000 && reason) {
                err = new Error(`${code} - ${reason}`);
            }
            if (err) {
                // @ts-ignore
                err.code = code;
            }
        } else {
            this.emit("debug", `WS close: unknown code - ${reason}`, this.id);
        }
    }
}