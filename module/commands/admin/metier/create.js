const messages = require('../../../variable/message');

/**
 * Cette fonction crée un métier dans la base de donnée dans la base de donnée
 *
 * @param {Array} args - Les arguments
 * @param {module:discord.js.Message} message - Le message
 * @param {Object} dbUtils - Object de dbUtils.js
 *
 */

module.exports = function(args, message, dbUtils){
    dbUtils.createMetier(args[1], args[2],args[3], message.author.id, (data) =>{
        switch(data) {
            case "first" :
                message.channel.send(messages.METIER_CREATE);
                dbUtils.createTimeoutPay({
                   name : args[1],
                   earn : args[2],
                   time: args[3],
                });
                break;

            case "two" :
                message.channel.send(messages.METIER_CREATE_TWO);
                break;

            case false:
                message.channel.send(messages.ERROR);
                break;
        }
    })
};