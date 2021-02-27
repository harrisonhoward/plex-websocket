import { EventEmitter } from "events";
import * as PlexAPI from "plex-api";
import * as ws from "ws";

declare function PlexWebsocket(PlexLogin: PlexAPI, onPacket: PlexWebsocket.onPacket): PlexWebsocket.WebsocketClient;

/**
 * PLEASE REPORT ANY ISSUES OR MISTYPES ON THE GITHUB 
 */

declare namespace PlexWebsocket {
    type onPacket = (type: types, data: object) => void;

    type types = "update.statechange" |
        "playing" |
        "backgroundProcessingQueue" |
        "progress" |
        "activity" |
        "unknown";

    interface PACKETTYPES {
        UPDATESTATECHANGE: "update.statechange",
        PLAYING: "playing",
        BACKGROUNDPROCESSINGQUEUE: "backgroundProcessingQueue",
        PROGRESS: "progress",
        ACTIVITY: "activity",
        UNKNOWN: "unknown"
    }

    interface ClientEvents<T> {
        (event: "connect", listener: () => void): T;
        (event: "error", listener: () => void): T;
        (event: "debug", listener: () => void): T;
    }

    export class WebsocketClient {
        hostname: PlexAPI.hostname;
        port: PlexAPI.port;
        token: PlexAPI.authToken;
        onPacket: onPacket;
        websocket: PlexWebsocket.Websocket;
        static PACKETTYPES: PACKETTYPES;
        constructor(PlexLogin: PlexAPI, onPacket: onPacket);
    }

    export class Websocket extends EventEmitter {
        PACKETTYPES: PACKETTYPES;
        id: string;
        url: string;
        ws?: ws;
        constructor(address: string, url: string, packet: onPacket);
        init(): Websocket;
        on: ClientEvents<this>;
    }
    export { PlexAPI } from "plex-api";
}

export = PlexWebsocket;