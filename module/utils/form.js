let modele = require("../variable/formEmbed");

module.exports = {
    startForm : function(bot, form, message) {
        if(form && message.id) {
            modele.author.name = "Question n°" + form.id;
            modele.description = form.question;
            if(form.mention) {
                modele.footer.text = "Réaction"
            } else {
                modele.footer.text = form.type;
            }
            message.channel.send({embed : modele}).then((msg) => {
                for(let key1 in form.mention) {
                    if(form.mention.hasOwnProperty(key1)) {
                        msg.react(form.mention[key1]);
                        let collector = msg.createReactionCollector((reaction, user) => form.mention.includes(reaction.emoji.name) && (user.id !== bot.user.id), {maxMatches: 1})
                            .on('collect', r => {
                                console.log(`Collected ${r.emoji.name}`);
                                collector.stop();
                            })
                    }
                }
            })
        }
    }
};