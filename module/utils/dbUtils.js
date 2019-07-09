const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const config = require('../core/config');
const message = require('../variable/message');


module.exports = {
    client : new MongoClient(process.env.URI || config.URL_DB),
    metierPay : {},
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
    createFiche : function(user, by, callback) {
        this.client.db(config.NAME_DB).collection("Fiche").findOne({
            user : user,
            statut : "alive"
        }, (err, rsp) => {
            if(err) callback(false);
            else if(rsp) callback("two");
            else this.client.db(config.NAME_DB).collection("Fiche").insertOne({
                user : user,
                createBy : by,
                statut : "alive",
                date : new Date(),
            }, (err) => {
                if(err) {
                    console.error(err);
                    callback(false);
                } else {
                    callback("first");
                }
            });
        });

    },
    createMetier : function(name, earn, time, createBy, callback) {
        this.client.db(config.NAME_DB).collection("Metier").findOne({
            name : name,
        }, (err, rsp) => {
            if(err) callback(false);
            else if(rsp) callback("two");
            else this.client.db(config.NAME_DB).collection("Metier").insertOne({
                name : name,
                earn : earn,
                time : time,
                createBy : createBy,
                date : new Date(),
            }, (err) => {
                if(err) {
                    console.error(err);
                    callback(false);
                } else {
                    callback("first");
                }
            });
        });

    },

    removeAlias : function(alias, callback) {
        this.client.db(config.NAME_DB).collection("aliasChannel").deleteOne({"alias" : alias}, (err, rsp) => {
            if(err) callback(false);
            else if(rsp.deletedCount === 0) callback("nobody");
            else if(rsp.deletedCount === 1) callback(true)
        })
    },
    removeMetier : function(name, callback) {
        this.client.db(config.NAME_DB).collection("Metier").deleteOne({"name" : name}, (err, rsp) => {
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
    findFiche : function(user, callback) {
        this.client.db(config.NAME_DB).collection("Fiche").find({"user" : user}).toArray((err, rsp) => {
            if(err) {
                console.error(err);
                callback(false);
            } else if(rsp.length === 0) callback("nobody");
            else if(rsp) callback(true, rsp);
        })
    },
    queryFiche : function(element, data, callback) {
        this.client.db(config.NAME_DB).collection("Fiche").find({[element] : data, statut : "alive"}).toArray((err, rsp) => {
            if(err) {
                console.error(err);
                callback(false);
            } else if(rsp.length === 0) callback("nobody");
            else if(rsp) callback(true, rsp);
        })
    },
    findMetiers : function(callback) {
        this.client.db(config.NAME_DB).collection("Metier").find().toArray((err, rsp) => {
            if(err) {
                console.error(err);
                callback(false);
            } else if(rsp.length === 0) callback("nobody");
            else if(rsp) callback(true, rsp);
        })
    },
    infoFiche : function(id, callback) {
        this.client.db(config.NAME_DB).collection("Fiche").find(ObjectId(id)).toArray((err, rsp) => {
            if(err) {
                console.error(err);
                callback(false);
            } else if(rsp.length === 0) callback("nobody");
            else if(rsp) callback(true, rsp);
        })
    },
    infoMetier : function(name, callback) {
        this.client.db(config.NAME_DB).collection("Metier").find({"name": name}).toArray((err, rsp) => {
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
    modifyFiche : function(user, element, data, callback) {
        this.client.db(config.NAME_DB).collection("Fiche").findOne({user : user, statut : "alive"}, (err, rsp) => {
            if(err) {
                console.error(err);
                callback(false)
            } else if(rsp) {
                this.client.db(config.NAME_DB).collection("Fiche").updateOne({user : user, statut : "alive"}, {
                    $set : {
                        [element] : data
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
                callback("nobody");
            }
        });
    },
    modifyMetier : function(name, element, data, callback) {
        this.client.db(config.NAME_DB).collection("Metier").findOne({name : name}, (err, rsp) => {
            if(err) {
                console.error(err);
                callback(false)
            } else if(rsp) {
                this.client.db(config.NAME_DB).collection("Metier").updateOne({name : name}, {
                    $set : {
                        [element] : data
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
                callback("nobody");
            }
        });
    },
    createPayMetier : function(bot){
        this.findMetiers((code, res) => {
            switch(code){
                default:
                        break;

                case true:
                    for(let key in res){ //Création d'un setTimeout pour tous les métiers
                        if(res.hasOwnProperty(key)) this.createTimeoutPay(res[key], bot)
                    }
                    break;

                case "nobody":
                case false:
                    break;
            }
        })
    },
    createTimeoutPay : function(data, bot){
        let that = this;
        this.metierPay[data.name] = setTimeout(function(){
            that.queryFiche("metier", data.name,  function(code2, res2){
                switch(code2){
                    default:
                        break;

                    case true:
                        for(let key2 in res2) {
                            if(res2.hasOwnProperty(key2)) {
                                const user = bot.users.get(res2[key2].user);
                                user.send(message.METIER_PAY.replace("%1", data.earn).replace("%2", data.name));
                                that.modifyMoney(res2[key2].user, parseInt(data.earn), () =>{})
                            }
                        }
                        break;

                    case "nobody":
                    case false:
                        break;
                }
            });
            that.infoMetier(data.name, function(code, res) {
                switch(code) {
                    default:
                        break;

                    case true:
                        that.createTimeoutPay(res[0], bot);
                        break;

                    case "nobody":
                    case false:
                        break;
                }
            })
        }, data.time)
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