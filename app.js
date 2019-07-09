// Librairie
const Discord = require("discord.js");
const Sentry = require("@sentry/node");
const Ora = require("ora");

// Core Module
const manager = require("./module/core/gestionCommands");
const config = require("./module/core/config");

// Module de gestion de commande
const gestionCommands = require("./module/commands/admin/gestion");

// Fichiers de constantes
const messages = require("./module/variable/message");

// Fichiers utilitaire
let dbUtils = require("./module/utils/dbUtils");

/*WIP
let formUtils = require("./module/utils/form");
const forms = {
    join : require("./module/variable/joinForm"),
};*/

// Constantes
const bot = new Discord.Client({fetchAllMembers : true});
const TOKEN = process.env.TOKEN;

// Initialisation de Sentry
Sentry.init({
    dsn: process.env.SENTRY_DSN,

});

// Gestion des événements du bot
bot.on("ready", function() {
    spinners.discord.succeed("Connecté à l'api Discord !");
    dbUtils.createPayMetier(bot);
});

bot.on("guildMemberAdd", (member) => {
    if(!member.user.bot) {
        member.send(messages.JOIN);
    }
});

bot.on("message", message => {
    // Gestionnaire de commandes utilisateurs
    if(message.content.startsWith("*") && message.content.endsWith("*")) {
        let command = message.content.slice(1, -1);
        for(let key in manager.commands.rp) {
            if(manager.commands.rp.hasOwnProperty(key)) for(let key2 in manager.commands.rp[key].regs) {
                if(manager.commands.rp[key].regs.hasOwnProperty(key2) && command.match(manager.commands.rp[key].regs[key2])) {

                    Sentry.configureScope((scope) => {
                        scope.setUser({"username": message.author.tag});
                        scope.setTag("module", manager.commands.rp[key].name);
                        scope.setTag("role", "user")
                    });

                    if(!manager.commands.rp[key].msg && !message.guild) {
                        break;
                    }
                    switch(manager.state(manager.commands.rp[key].name, "rp")) {
                        case "error":
                            message.channel.send(messages.COMMANDS_ERROR);
                            break;

                        case false:
                            message.channel.send(messages.COMMANDS_OFF);
                            break;

                        case true:
                            manager.commands.rp[key].code(message, dbUtils, bot);
                             manager.commands.rp[key].code(message, dbUtils, bot);
                    }
                    break;
                }
            }
        }
    } else {
        // Gestionnaire de commandes administrateurs

        const args = message.content.toLowerCase().split(" ");
        const command = args.shift().toLowerCase();
        for(let key in manager.commands.admin) {

            if(manager.commands.admin.hasOwnProperty(key) && command === config.PREFIX + manager.commands.admin[key].name) {
                Sentry.configureScope((scope) => {
                    scope.setUser({"username": message.author.tag});
                    scope.setTag("module", manager.commands.admin[key].name);
                    scope.setTag("role", "admin")
                });


                if(!manager.commands.admin[key].msg && !message.guild) {
                    message.channel.send(messages.DM_BLOCK);
                    break;
                }
                switch(manager.state(manager.commands.admin[key].name, "admin")) {
                    default :
                        break;

                    case "error":
                        message.channel.send(messages.COMMANDS_ERROR);
                        break;

                    case false:
                        message.channel.send(messages.COMMANDS_OFF);
                        break;

                    case true:
                        manager.commands.admin[key].code(args, message, dbUtils, bot);
                }
                break;
            }
        }
        if(command === "!gestion") gestionCommands(args, message, manager);
    }

});

// Gestion des événements d'arrets
process.on("SIGINT", function() {
    for(let key in dbUtils.metierPay){
        if(dbUtils.metierPay.hasOwnProperty(key)) clearTimeout(dbUtils.metierPay[key]);
    };
    bot.destroy().catch((err) => {
        console.error(err);
    });
    dbUtils.client.close();
});
process.on("SIGTERM", function() {
    bot.destroy().catch((err) => {
        console.error(err);
    });
    dbUtils.client.close();
});
// Initialisation
const spinners = {
    dbS : new Ora("Connexion à la base de donnée"),
    verification : new Ora("Vérification des variables d'environement").start(),
    discord : new Ora("Connexion à l'api Discord"),
};

if(!TOKEN || !(process.env.URI || config.URL_DB)){
    spinners.verification.fail("Erreur lors de la vérification des données !");
    process.exit(78); // Code : Problème à la vérification
} else if(!process.env.SENTRY_DSN) {
    spinners.verification.warn("Le token de sentry n'est pas trouvable");
} else {
    spinners.verification.succeed("Toutes les données sont disponible !")
}

dbUtils.client.connect(function(error) {
    if(error){
        Sentry.captureException(error);
        spinners.dbS.fail("Erreur lors de la connexion à la base de donnée...");
        process.exit(1); // Code : Problème à la connexion à la DB
    }
    spinners.dbS.succeed("Connecté à la base de donnée !");
});

bot.login(TOKEN).catch((error) => {
    Sentry.captureException(error);
    spinners.discord.fail("Erreur lors de la connexion à Discord...");
    process.exit(1); // Code : Problème à la connexion à Discord
});
manager.load();


