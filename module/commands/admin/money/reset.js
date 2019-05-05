const money = require('../../../utils/money');
const messages = require('../../../variable/message.js');
const disUtils = require('../../../utils/discordUtils.js');


module.exports = function(dbUtils, args, message) {
    const user = message.guild.members.get(args[1]) || message.guild.members.find(user => user.nickname === args[1]) || message.guild.members.get(disUtils.getChannel(args[1]));
    if(!user) {
        message.channel.send(messages.USER_INVALID);
    } else {
        money.start(user, dbUtils);
    }
};