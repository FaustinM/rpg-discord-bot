let modele = require("../variable/formEmbed");

module.exports = {
    forms : [],
    sendQuestion : function(bot, form, message, id) {
        if(form && message.id) {
            modele.author.name = "Question n°" + form[id].id;
            modele.description = form[id].question;
            if(form[id].mention) {
                modele.footer.text = "Réaction"
            } else {
                modele.footer.text = form[id].type;
            }
            message.channel.send({embed : modele}).then((msg) => {
                for(let key1 in form[id].mention) {
                    if(form[id].mention.hasOwnProperty(key1)) {
                        msg.react(form[id].mention[key1]);
                        let collector = msg.createReactionCollector((reaction, user) => form.mention.includes(reaction.emoji.name) && (user.id !== bot.user.id), {max: 1})
                            .on('collect', r => {
                                console.log(`Collected ${r.emoji.name}`);
                                collector.stop();
                            })
                    }
                }
            })
        }
    },
    sendForm :function(bot, form, message) {
        if(!form && !bot.id && !message.id){}
    },
};