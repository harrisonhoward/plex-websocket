Read [Github](https://github.com/Forbidden-Duck/plex-websocket) README, in case of unpublished changes
# Plex-Websocket
A tool to allow JavaScript and Typescript users to aquire the full power of [plex-api](https://github.com/phillipj/node-plex-api) with Websockets\
**YOU DO NOT NEED TO INSTALL [plex-api](https://github.com/phillipj/node-plex-api) IT COMES WITH THE MODULE**
```
npm install plex-websocket
```

## **Features**

### Quickly connect to a remote Plex Media Server by using a well known JavaScript Plex API tool [plex-api](https://github.com/phillipj/node-plex-api)
This will work with the [plex-api](https://github.com/phillipj/node-plex-api) authenticator tool. The websocket just needs the authToken which is provided either by you or by the authenticator module

```js
const LOGININFO = {
    hostname: "255.255.255.255",
    username: "example@gmail.com",
    token: "app.plex.tv/desktop => Inspect => Application => Local Storage => myPlexAccessToken"
}; // Login information of the Plex Media User
const PlexAPI = require("plex-api");
const PlexLogin = new PlexAPI(LOGININFO); // Login with plex-api

function onPacket(type, data) {
    if (type === PlexWebsocket.WebsocketClient.PACKETTYPES.PLAYING) {
        console.log("\nPlaying State Change");
        console.log("Session IDs: ", data.PlaySessionStateNotification.map(session => session.sessionKey).join(", "));
        console.log("Rating Keys: ", data.PlaySessionStateNotification.map(session => session.ratingKey).join(", "));
        console.log("States: ", data.PlaySessionStateNotification.map(session => session.state).join(", "));
    }
} // Create a function for receiving packets

// Create a WebsocketClient with the create plex-api login and onPacket function
const WSClient = new PlexWebsocket.WebsocketClient(PlexLogin, onPacket);
WSClient.websocket.on("connect", () => console.log("Connected")); // When a successful connection is made
WSClient.websocket.on("error", err => console.log("Error\n", err)); // When an error occurs (Will terminate program)
WSClient.websocket.on("debug", message => console.log("Debug\n", message)); // Debug event for errors
```

## **Test Script**

### `npm test`
[Script Location](https://github.com/Forbidden-Duck/plex-websocket/tree/master/example/watchSessions.js)\
Ensure that **LOGININFO** has been filled in with your information
```js
const LOGININFO = {
    hostname: "255.255.255.255",
    username: "example@gmail.com",
    token: "app.plex.tv/desktop => Inspect => Application => Local Storage => myPlexAccessToken"
};
```
