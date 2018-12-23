var Discord = require('discord.io');
//var logger = require('winston');
var auth = require('./auth.json');

// Configure logger settings
//logger.remove(logger.transports.Console);
//logger.add(logger.transports.Console, {
//   colorize: true
//});
//.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.username + ' - (' + bot.id + ')');
});


bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
        
    if (message.substring(0, 1) == '\\') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'on':
            case 'lancha':
                var usersOn = getAllUsersOn();
                console.log(usersOn);
                
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            // Just add any case commands if you want to..
         }
     }
});

function makeUsersOnJSON(){

}

function getAllUsersOn(){
    var voiceChannels = getVoiceChannels();
    var usersOn = {};
    for (channelKey in voiceChannels) {
        var member = getUsersOn(voiceChannels[channelKey]);
        usersOn[voiceChannels[channelKey]] = (member);
    }
    return usersOn;
}

function getUsersOn(channel){
    var chan = bot.channels[channel];
    var members = chan.members;
    var temp = {};
    
    for (member in members) {
            user = {};
            user["user_id"] = member;
            user["nick"] = bot.servers[chan.guild_id].members[member]["nick"];
            user["username"] = bot.users[member]["username"];
            user["discriminator"] = bot.users[member]["discriminator"];
            user["mute"] = members[member]["mute"] || members[member]["self_mute"];
            user["deaf"] = members[member]["deaf"] || members[member]["self_deaf"];
            user["game"] = bot.users[member]["game"];
            temp[member] = user;
        }
    return temp;
}

function getVoiceChannels(){
    var voiceChannels = [];
    for (channel in bot.channels) {
          if (bot.channels[channel].type == 2){
            voiceChannels.push(channel);
          }
    }

    return voiceChannels;
}