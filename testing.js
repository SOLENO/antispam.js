const Discord = require("discord.js");
const client = new Discord.Client();
const antispam = require("antispam.js")

client.on("ready", () => {

    antispam(client, {
        min = 4,
        max = 5,
        interval = 4000,
        warning = "",
        muteMessage = "",
        maxWarn = 7,
        maxDuplicatesMute = 10,
        ignoredRoles = [],
        ignoredUsers = []
})
console.log("sup")
});

client.on('message', msg => {
    client.emit('checkMessage', msg);

  })
  
client.login('NjEzNzQ2Nzg3MTQ0MTcxNTM5.XXKu1Q.cXbXtVlOr3ChD_14OXhijpDjxqw');