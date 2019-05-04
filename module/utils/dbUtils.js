const MongoClient = require("mongodb").MongoClient;
const config = require('../variable/config');


module.exports = {
    client : new MongoClient(process.env.URI || config.URL_DB),

    checkRole : function(id, callback) {
        this.client.db(config.NAME_DB).collection("Channel").findOne({"channelId" : id}, (err, rsp) => {
            if(err) {
                console.error(err);
                callback(false);
            } else if(!rsp) callback(false);
            else if(rsp) callback(true, rsp.role);
        });
    },

    addRole : function(channel, role, callback) {
        this.client.db(config.NAME_DB).collection("Channel").findOne({channelId : channel}, (err, rsp) => {
            if(err) {
                console.error(err);
                callback(false)
            } else if(rsp) {
                this.client.db(config.NAME_DB).collection("Channel").updateOne({channelId : channel}, {
                    $set : {
                        channelId : channel,
                        role : role
                    }
                }, (err, rsp) => {
                    if(err) {
                        console.error(err);
                        callback(false)
                    } else if(rsp) {
                        callback("modify");
                    }
                })
            } else if(!rsp) {
                this.client.db(config.NAME_DB).collection("Channel").insertOne({
                    channelId : channel,
                    role : role
                }, (err, rsp) => {
                    if(err) {
                        console.error(err);
                        callback(false);
                    } else if(rsp) {
                        callback("add")
                    }
                })
            }
        });
    },

    addAlias : function(channelId, alias, callback) {
        if(alias === "" || alias === " " || !alias) {
            callback("nobody");
        } else {
            this.client.db(config.NAME_DB).collection("aliasChannel").findOne({"alias" : alias}, (err, rsp) => {
                if(!rsp) this.client.db(config.NAME_DB).collection("aliasChannel").insertOne({
                    channelId : channelId,
                    alias : alias
                }, (err) => {
                    if(err) {
                        console.error(err);
                        callback(false)
                    } else {
                        callback(true)
                    }
                });
                else if(err) callback(false);
                else if(rsp) callback("two")
            });
        }
    },

    removeAlias : function(alias, callback) {
        this.client.db(config.NAME_DB).collection("aliasChannel").deleteOne({"alias" : alias}, (err, rsp) => {
            if(err) callback(false);
            else if(rsp.deletedCount === 0) callback("nobody");
            else if(rsp.deletedCount === 1) callback(true)
        })
    },

    findChannel : function(alias, callback) {
        this.client.db(config.NAME_DB).collection("aliasChannel").findOne({"alias" : alias}, (err, rsp) => {
            if(err) {
                console.error(err);
                callback(false);
            } else if(!rsp) callback("nobody");
            else if(rsp) callback(true, rsp.channelId);
        })
    },

    findAlias : function(channel, callback) {
        this.client.db(config.NAME_DB).collection("aliasChannel").find({"channelId" : channel}).toArray((err, rsp) => {
            if(err) {
                console.error(err);
                callback(false);
            } else if(rsp.length === 0) callback("nobody");
            else if(rsp) callback(true, rsp);
        })
    },

    checkMoney : function(user, callback) {
        this.client.db(config.NAME_DB).collection("player").findOne({"userId" : user}, (err, rsp) => {
            if(err) {
                console.error(err);
                callback(false);
            } else if(!rsp) callback("nobody");
            else if(rsp) callback(true, rsp.money);
        })
    },

    modifyMoney : function(user, money, callback) {
        this.client.db(config.NAME_DB).collection("player").findOne({userId : user}, (err, rsp) => {
            if(err) {
                console.error(err);
                callback(false)
            } else if(rsp) {
                this.client.db(config.NAME_DB).collection("player").updateOne({userId : user}, {
                    $inc : {
                        money : money
                    }
                }, (err, rsp) => {
                    if(err) {
                        console.error(err);
                        callback(false)
                    } else if(rsp) {
                        callback("modify");
                    }
                })
            } else if(!rsp) {
                if(money < 0) {
                    callback("nobody");
                    return;
                }
                this.client.db(config.NAME_DB).collection("player").insertOne({
                    userId : user,
                    money : money
                }, (err, rsp) => {
                    if(err) {
                        console.error(err);
                        callback(false);
                    } else if(rsp) {
                        callback("add")
                    }
                })
            }
        });
    },

    setMoney : function(user, money, callback) {
        this.client.db(config.NAME_DB).collection("player").findOne({userId : user}, (err, rsp) => {
            if(err) {
                console.error(err);
                callback(false)
            } else if(rsp) {
                this.client.db(config.NAME_DB).collection("player").updateOne({userId : user}, {
                    $set : {
                        money : money
                    }
                }, (err, rsp) => {
                    if(err) {
                        console.error(err);
                        callback(false)
                    } else if(rsp) {
                        callback("modify");
                    }
                })
            } else if(!rsp) {
                if(money < 0) {
                    callback("nobody");
                    return;
                }
                this.client.db(config.NAME_DB).collection("player").insertOne({
                    userId : user,
                    money : money
                }, (err, rsp) => {
                    if(err) {
                        console.error(err);
                        callback(false);
                    } else if(rsp) {
                        callback("add")
                    }
                })
            }
        });
    },
};