module.exports = {
    commands : require('./commands'),
    load : function() {
        delete require.cache[require.resolve('./commands')];
        this.commands = require('./commands');
        for(let key in this.commands.rp) {
            if(this.commands.rp.hasOwnProperty(key) && this.commands.rp[key]) {
                if(this.commands.rp[key].use) this.enable(key, "rp");
                else if(!this.commands.rp[key].use) this.disable(key, "rp");
            }
        }
        for(let key in this.commands.admin) {
            if(this.commands.admin.hasOwnProperty(key) && this.commands.admin[key]) {
                if(this.commands.admin[key].use) this.enable(key, "admin");
                else if(!this.commands.admin[key].use) this.disable(key, "admin");
            }
        }
    },
    state : function(name, type) {
        if(!this.commands[type][name] || !name || !type) return "nobody";
        switch(this.commands[type][name].use) {
            default :
                break;

            case "error":
                return "error";

            case false:
                return false;

            case true:
                return true;
        }
    },
    disable : function(name, type) {
        if(!this.commands[type][name]) return "nobody";
        try {
            this.commands[type][name].use = false;
            this.commands[type][name].code = () => console.log("Composant mal bloqué" + this.commands[type][name].name);
            return true;
        } catch(e) {
            console.error(e);
            return false;
        }
    },
    enable : function(name, type) {
        if(!this.commands[type][name]) return "nobody";
        try {
            this.commands[type][name].use = true;
            delete require.cache[require.resolve(this.commands[type][name].path)];
            this.commands[type][name].code = require(this.commands[type][name].path);
            return true;
        } catch(e) {
            this.commands[type][name].use = "error";
            this.commands[type][name].code = () => console.log("Composante en erreur" + this.commands[type][name].name);
            console.error(e);
            return false;
        }
    },
};