module.exports = {
    debug : {
        path : "../commands/admin/debug",
        code : function() {
            console.log("Composant mal gérée !" + this.name)
        },
        use : true,
        name : "debug",
        msg : false,
    },
    channel : {
        path : "../commands/admin/channel",
        code : function() {
            console.log("Composant mal gérée !" + this.name)
        },
        use : true,
        name : "channel",
        msg : false,
    },
    move : {
        path : "../commands/admin/move",
        code : function() {
            console.log("Composant mal gérée !" + this.name)
        },
        use : true,
        name : "move",
        msg : false,
    },
    money : {
        path : "../commands/admin/money",
        code : function() {
            console.log("Composant mal gérée !" + this.name)
        },
        use : true,
        name : "money",
        msg : false,
    },

};