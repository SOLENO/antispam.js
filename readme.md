# antispam.js
Discord antispam module to protect your server from raiders.

## Installation
<p align="center"><a href="https://nodei.co/npm/antispam.js/"><img src="https://nodei.co/npm/antispam.js.png"></a></p>

```js
npm i antispam.js
```

**Note:**
It will ignore the people with `KICK_MEMBERS` permissions.

## Example

```js
const Discord = require("discord.js");
const client = new Discord.Client();
const antispam = require("antispam.js");

client.on("ready", () => {
  
 console.log("Ready!");

  antispam(client, {
        min: 4, // Message allowed before getting warn message
        max: 5, // Maximum messages that can be sent before getting muted
        interval: 4000, // Max messages can be sent in this ms
        warning: "", // warning message
        muteMessage: "", // muted message
        maxWarn: 7, // Maximum amount of duplicate messages that can be sent before getting warned
        maxDuplicatesMute: 10, // Maximum amount of duplicate messages that can be sent before getting muted
        ignoredRoles: ["My role", "His role"], // ignored roles
        ignoredUsers: ["User#1234", "User#5678"] // ignored users
})
});

client.on("message", async (message) => {
    client.emit('checkMessage', message);
});

client.login("Your Token");

```