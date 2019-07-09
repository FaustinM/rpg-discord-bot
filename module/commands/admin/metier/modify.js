const messages = require('../../../variable/message');

element = ["earn", "time"];

module.exports = function(args, message, dbUtils, bot) {
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
                    message.channel.send(messages.METIER_MODIFY);
                    if(args[2] === "time"){
                        clearTimeout(dbUtils.metierPay[args[1]]);
                        dbUtils.infoMetier(args[1], (value, rsp2) => dbUtils.createTimeoutPay(rsp2[0], bot));
                    }
            }
        })
    }
};