const messages = require('../../../variable/message');
const disUtils = require('../../../utils/discordUtils');
const listEmbed = require('../../../variable/embed/fiches');

element = ["earn", "time"];

module.exports = function(args, message, dbUtils) {
    if(!element.includes(args[2])) {
        message.channel.send(messages.METIER_MODIFY_ELEMENT);
    } else {
        dbUtils.modifyMetier(args[1], args[2], args[3], (rsp) => {
            switch(rsp) {
                case "nobody":
                    message.channel.send(messages.METIER_INVALID);
                    break;

                case false:
                    message.channel.send(messages.ERROR);
                    break;

                case "modify":
                    message.channel.send(messages.METIER_MODIFY)
            }
        })
    }
};