const messages = require('../variable/message');
module.exports = {
    reset : function(user, dbUtils) {
        dbUtils.setMoney(user.id, 300, (data) => {
            switch(data) {
                case "nobody" :
                    user.send(messages.MONEY_START.replace("%1", "Libertown").replace("%2", "300"));
                    break;

                case "modify" :
                    user.send(messages.MONEY_START.replace("%1", "Libertown").replace("%2", "300"));
                    break;

                case false:
                    console.error(user.id + " : Erreur lors du don de début !");
                    break;
            }
        })
    }
};