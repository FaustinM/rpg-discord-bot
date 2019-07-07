module.exports = (message, dbUtils, bot) => {
    dbUtils.checkMoney(message.author.id, (rsp, money) => {
        switch(rsp) {
            case true:
                message.author.send(messages.MONEY_BALANCE.replace("%1", money));
                break;

            case false:
                message.delete(0);
                break;

            case "nobody":
                message.author.send(messages.MONEY_NOBODY);
                break;
        }
    })
};