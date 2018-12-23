var Discord = require('discord.io');
//var logger = require('winston');
var auth = require('./auth.json');



// Configure logger settings
//logger.remove(logger.transports.Console);
//logger.add(logger.transports.Console, {
//   colorize: true
//});
//.level = 'debug';

// Initialize Discord bot
var discordBot = new Discord.Client({
   token: auth.token,
   autorun: true
});
discordBot.on('ready', function (evt) {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(discordBot.username + ' - (' + discordBot.id + ')');
});


discordBot.on('message', function (user, userID, channelID, message, evt) {
    // Our discordBot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
        
    if (message.substring(0, 1) == '\\') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'on':
            case 'lancha':
                
                msg = makeUsersOnText();                
                discordBot.sendMessage({
                    to: channelID,
                    message: msg
                });
            break;
            // Just add any case commands if you want to..
         }
     }
});


function makeUsersOnText(){
    msg = "";
    var usersOn = getAllUsersOn();
    if(isEmpty(usersOn)){
        msg = "Não há pessoas nos canais de voz"
    }else {
        for (channel in usersOn){
            msg += "Canal " + discordBot.channels[channel]["name"] + "\n";
            for (member in usersOn[channel]){
                name = usersOn[channel][member]["username"];
                if( usersOn[channel][member]["nick"] != null ) name = usersOn[channel][member]["nick"]; 
                msg += "\t" + name + " ( "+usersOn[channel][member]["username"]+"#"+usersOn[channel][member]["discriminator"]+" )\n";
                console.log();
            }
            msg += "\n";
        }
    }
    return msg;
}

function getAllUsersOn(){
    var voiceChannels = getVoiceChannels();
    var usersOn = {};
    for (channelKey in voiceChannels) {
        var member = getUsersOn(voiceChannels[channelKey]);
        if(!isEmpty(member)){        
            usersOn[voiceChannels[channelKey]] = member;
        }
    }
    return usersOn;
}

function getUsersOn(channel){
    var chan = discordBot.channels[channel];
    var members = chan.members;
    var temp = {};
    
    for (member in members) {
            user = {};
            user["user_id"] = member;
            user["nick"] = discordBot.servers[chan.guild_id].members[member]["nick"];
            user["username"] = discordBot.users[member]["username"];
            user["discriminator"] = discordBot.users[member]["discriminator"];
            user["mute"] = members[member]["mute"] || members[member]["self_mute"];
            user["deaf"] = members[member]["deaf"] || members[member]["self_deaf"];
            user["game"] = discordBot.users[member]["game"];
            temp[member] = user;
        }
    return temp;
}

function getVoiceChannels(){
    var voiceChannels = [];
    for (channel in discordBot.channels) {
          if (discordBot.channels[channel].type == 2){
            voiceChannels.push(channel);
          }
    }

    return voiceChannels;
}


function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

//Initialize Telegram bot
const TelegramBot = require( `node-telegram-bot-api` )
const teleBot = new TelegramBot( auth.telegram, { polling: true } )
teleBot.onText('/start', (msg) => {
    
     teleBot.sendMessage(msg.chat.id,"ALOOOU");
     
});
teleBot.onText(/\/on/, (msg) => {
    
     teleBot.sendMessage(msg.chat.id,makeUsersOnText());
     
});
teleBot.onText(/\/lancha/, (msg) => {
    
     teleBot.sendMessage(msg.chat.id,makeUsersOnText());
     
});
