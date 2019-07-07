module.exports ={
    admin : {
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
        fiche : {
            path : "../commands/admin/fiche",
            code : function() {
                console.log("Composant mal gérée !" + this.name)
            },
            use : true,
            name : "fiche",
            msg : false,
        },
        metier : {
            path : "../commands/admin/metier",
            code : function() {
                console.log("Composant mal gérée !" + this.name)
            },
            use : true,
            name : "metier",
            msg : false,
        },

    },
    rp : {
        money : {
            name : "money",
            path : "../commands/user/money/bal",
            code : require("../commands/user/money/bal"),
            use : true,
            regs : require("../variable/userCommand").money,
            reg : "money",
            msg : false,
        },
        channel : {
            name : "channel",
            path : "../commands/user/channel",
            code : require("../commands/user/channel"),
            use : true,
            regs : ["^va à ([1-9][0-9]*|[^ ]*)$"],
            msg : false,
        },
    }
};