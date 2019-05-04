let modele = require("../variable/formEmbed");
let messages = require("../variable/message");

module.exports = {
    forms : [],
    sendQuestion : function(bot, form, message, callback) {

        if(form && message) {
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
                        let collector = msg.createReactionCollector((reaction, user) => form.mention.includes(reaction.emoji.name) && (user.id !== bot.user.id), {max : 1})
                            .once('collect', r => {
                                callback(r.emoji.name, message, bot, form);
                                collector.stop();
                            })
                    }
                }
            })
        } else {
            console.log(form);
        }
    },
    sendForm : function(bot, form, message) {
        if(!form && !bot.user.id && !message.content) {
        } else {
            if(!this.forms[message.author.id]) {
                this.forms[message.author.id] = {};
                this.forms[message.author.id].reponse = [];
                this.forms[message.author.id].currentForm = form;
            }
            /** @param {{lenght: number}} form */
            if(!form[this.forms[message.author.id].reponse.length]) {
                message.channel.send(messages.FICHE_SEND);
                return;
            } else if("goe") {

            }

        }
    },
    getResponseReply : function(x, message, bot, form) {
        this.doc = module.exports;
        this.doc.forms[message.author.id].reponse[form.id] = x;
        this.doc.sendForm(bot, module.exports.forms[message.author.id].currentForm, message);

    }
};