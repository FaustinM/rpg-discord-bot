const messages = require('../../variable/message');

const modify = require('./metier/modify');
const create = require('./metier/create');
const info = require('./metier/info');
const list = require('./metier/list');
const disable = require('./metier/delete');

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

            case "delete":
                disable(args, message, dbUtils);
                break;
        }
    } else {
        message.delete(0);
    }
};
