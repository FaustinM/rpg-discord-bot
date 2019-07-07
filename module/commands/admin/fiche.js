const messages = require('../../variable/message');

const modify = require('./fiche/modify');
const create = require('./fiche/create');
const info = require('./fiche/info');
const list = require('./fiche/list');
const disable = require('./fiche/mort');

/**
 * Cette fonction lis le premier argument et redirige vers la bonne fonction comme un aiguillage
 *
 * @param {Array} args - Les arguments
 * @param {module:discord.js.Message} message - Le message
 * @param {Object} dbUtils - Object de dbUtils.js
 *
 */
module.exports = function(args, message, dbUtils) {
    if(message.member.permissions.has("ADMINISTRATOR")) {
        switch(args[0]) {
            default:
                break;

            case "create":
                create(args, message, dbUtils);
                break;

            case "modify":
                modify(args, message, dbUtils);
                break;

            case "info":
                info(args, message, dbUtils);
                break;

            case "list":
                list(args, message, dbUtils);
                break;

            case "mort":
                disable(args, message, dbUtils);
                break;
        }
    } else {
        message.delete(0);
    }
};
