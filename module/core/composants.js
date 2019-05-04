module.exports = {
    debug : {
        code : require("../commands/admin/debug"),
        use : true,
        name : "debug"
    },
    channel : {
        code : require("../commands/admin/channel"),
        use : true,
        name : "channel"
    },
    move : {
        code : require("../commands/admin/move"),
        use : true,
        name : "move"
    },
    money : {
        code : require("../commands/admin/money"),
        use : true,
        name : "money"
    },
};