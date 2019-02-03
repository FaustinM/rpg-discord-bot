const Discord = require('discord.js');
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
    let argsSpace = args
    argsSpace.shift()
    var argsNameAlias = argsSpace.join(' ');
    console.log(argsNameAlias)
  }
  else if (command === "!alias"){
    if(args.length > 1){
      if (bot.channels.get(args[0])){
        let argsSpace = args
        argsSpace.shift()
        let nameAlias = argsSpace.join(' ');
        stockage.channelAlias[nameAlias.toString()] = args[0]
        message.channel.send(":tools: L'alias du channel "+args[0].toString()+" est "+nameAlias.toString())
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
    fs.writeFile('stockage.json',JSON.stringify(stockage),() => console.log("Sauvegarde du json"))
  }
}
bot.login(TOKEN)
//setInterval(saveJson(), 3000000)
setInterval(saveJson(), 10000)
