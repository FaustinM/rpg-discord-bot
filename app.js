const Discord = require('discord.js');
const TOKEN = "MjM5Mzg2MDcwNDYxMDU0OTc4.DquUwQ.Vn8X0tPqmXsW8aqPGvp56qvkoEY";
const fs = require('fs');
var stockage = require("./stockage.json");


const bot = new Discord.Client();
var prefix = "!";
var channelAlias = {};
var channelRole = {
  411932446095835156 : 225573960455028736,
}

bot.on('ready', function () {
  console.log("Je suis connecté !");
})
bot.on('message', message => {
  const args = message.content.split(' ');
  const command = args.shift().toLowerCase();
  if(message.content.startsWith("*sors pour aller à")){
    function changeChannel() {
        message.channel.overwritePermissions(message.author, {READ_MESSAGES: null}, "Changement de channel (RP)").catch(console.error);
        lieuC.overwritePermissions(message.author, {READ_MESSAGES: true}).catch(console.error);
    }
    var lieu = message.content.substring(19, message.content.length-1);
    var lieuC = message.guild.channels.find(channel => channel.name === lieu)||client.channels.get(channelAlias[lieu]);
    if(lieuC){
      changeChannel();
    }
    else{
      message.delete(0);
    }
  }
  else if (command === "!test"){
    let argsSpace = 
    console.log()
  }
  else if (command === "!alias"){
    if(message.content.length > 27){
      if (bot.channels.get(message.content.substring(7, 26))){
        console.log(message.content.substring(26));
        stockage.channelAlias[message.content.substring(26)] = message.content.substring(7, 26)
        message.channel.send(":tools: L'alias du channel" +message.content.substring(7, 26)+" est "+message.content.substring(26))
      }else{
        message.channel.send(":warning: Channel non existant !").then(msg => {msg.delete(3000);message.delete(3000)});
      }
    }else{message.delete(0)};
  }
  else if (command === "!save"){
    saveJson();
    message.channel.send(":floppy_disk: Sauvegarde de la configuration");
}

})
function saveJson(){
  return function(){
    fs.writeFile('stockage.json',json.stringify(stockage),() => console.log("Sauvegarde du json"))
  }
}
bot.login(TOKEN)

setInterval(saveJson(), 3000000)
