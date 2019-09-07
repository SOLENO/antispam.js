const Discord = require("discord.js");

var authors = [];
var warned = [];
var muted = [];
var messageLog = [];

module.exports = async (client, options) => {

    const min = (options && options.min) || 4; // Message allowed before getting warn message
    const max = (options && options.max) || 12; // Maximum messages that can be sent before getting muted
    const interval = (options && options.interval) || 3000; // Max messages can be sent in this ms
    const warning = (options && options.warning) || "Stop spamming!"; // warning message
    const muteMessage = (options && options.muteMessage) || "has been muted for spamming!"; // muted message
    const maxWarn = (options && options.maxWarn || 7); // Maximum amount of duplicate messages that can be sent before getting warned
    const maxDuplicatesMute = (options && options. maxDuplicatesMute || 10); // Maximum amount of duplicate messages that can be sent before getting muted
    const ignoredRoles = (options && options.exemptRoles) || []; // ignored roles
    const ignoredUsers = (options && options.exemptUsers) || []; // ignored users

    if (isNaN(min)) throw new Error("Min must be a number.");
    if (isNaN(max)) throw new Error("max must be a number.");
    if (isNaN(interval)) throw new Error("interval must be a number.");
    if (!isNaN(muteMessage) || muteMessage.length < 7) throw new Error("Mute message must be a string with at least 7 charcters.");
    if (!isNaN(warning) || warning.length < 7) throw new Error("warning message must be a string with at least 7 characters.");
    if (isNaN(maxWarn)) throw new Error("maxWarn must be a number.")
    if (isNaN(maxDuplicatesMute)) throw new Error("maxDuplicatesMute must be a number.");
    if (ignoredRoles.constructor !== Array) throw new Error("Ignored roles must be an array.");
    if (ignoredUsers.constructor !== Array) throw new Error("Ignored users must be an array.");

    client.on("checkMessage", async (message) => {

        const muteUser = async (m, muteMessage) => {
            for (var i = 0; i < messageLog.length; i++) {
                if (messageLog[i].author == m.author.id) {
                  messageLog.splice(i);
                }
              }
          
              muted.push(m.author.id);
          
              let user = m.guild.members.get(m.author.id);
              if (user) {
                let muterole = message.guild.roles.find(`name`, "Muted")
    if(!muterole){
    try{
      muterole = await message.guild.createRole({
        name: "Muted",
        color: "#000000",
        permissions:[]
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
          SPEAK: false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }
  message.guild.members.get(user.id).addRole(message.guild.roles.find("name", 'Muted')).then((member) => {
                  m.channel.send(`${user.user.tag} ${muteMessage}`);
                  return true;
               }).catch(() => {
                  m.channel.send(`:x: Oops, looks like i don't have sufficient permissions to mute <@!${message.author.id}>!`);
                  return false;
              });
            }
          }

          const warnUser = async (m, reply) => {
            warned.push(m.author.id);
            m.channel.send(`<@${m.author.id}>, ${reply}`);
           }
        
            if (message.author.bot) return;
            if (message.channel.type !== "text" || !message.member || !message.guild || !message.channel.guild) return;
            if (message.author.hasPermission('KICK_MEMBERS')) return;
            if (message.member.roles.some(r => ignoredRoles.includes(r.name)) || ignoredUsers.includes(message.author.tag)) return;
        
            if (message.author.id !== client.user.id) {
              let currentTime = Math.floor(Date.now());
              authors.push({
                "time": currentTime,
                "author": message.author.id
              });
              
              messageLog.push({
                "message": message.content,
                "author": message.author.id
              });
              
              let msgMatch = 0;
              for (var i = 0; i < messageLog.length; i++) {
                if (messageLog[i].message == message.content && (messageLog[i].author == message.author.id) && (message.author.id !== client.user.id)) {
                  msgMatch++;
                }
              }
              
              if (msgMatch == maxWarn && !warned.includes(message.author.id)) {
                warnUser(message, warning);
              }
        
              if (msgMatch == maxDuplicatesMute && !muted.includes(message.author.id)) {
                muteUser(message, muteMessage);
              }
        
              var matched = 0;
        
              for (var i = 0; i < authors.length; i++) {
                if (authors[i].time > currentTime - interval) {
                  matched++;
                  if (matched == min && !warned.includes(message.author.id)) {
                    warnUser(message, warning);
                  } else if (matched == max) {
                    if (!muted.includes(message.author.id)) {
                      muteUser(message, muteMessage);
                    }
                  }
                } else if (authors[i].time < currentTime - interval) {
                  authors.splice(i);
                  warned.splice(warned.indexOf(authors[i]));
                  muted.splice(warned.indexOf(authors[i]));
                }
        
                if (messageLog.length >= 200) {
                  messageLog.shift();
                }
              }
            }
          });

}