const messages = require('../../../variable/message');

module.exports = function(args, message, dbUtils) {
    dbUtils.removeMetier(args[1], (data) => {
        switch(data) {
            case true:
                message.channel.send(messages.METIER_DELETE);
                break;
            case false:
                message.channel.send(messages.ERROR);
                break;
            case "nobody" :
                message.channel.send(messages.METIER_INVALID);
                break;

        }
    });
};