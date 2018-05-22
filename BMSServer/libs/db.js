// 引入第三方mongodb连接框架
const MongoClient = require('mongodb').MongoClient;
const settings = require("../settings");

// 连接数据库
function _connectDb(callback) {
    MongoClient.connect(settings.dbUrl, function(err, db) {
        callback(err, db);
        return;
    });
}

// 插入一条json数据
exports.insertOne = function(collectionName, json, callback) {
    _connectDb(function(err, db) {
        if (err) {
            callback(err, null);
            return;
        }
        const myDb = db.db("BMS");
        myDb.collection(collectionName).insertOne(json, function(err, result) {
            callback(err, result);
            db.close();
            return;
        });
    });
}

exports.find = function(collectionName, json, C, D) {
    if (arguments.length == 3) {
        var callback = C;
        var skipCount = 0;
        var limit = 0;
        var sort = {};
    } else if (arguments.length == 4) {
        var callback = D;
        var args = C;
        var skipCount = args.pageAmount * args.page || 0;
        var limit = args.pageAmount || 0;
        var sort = args.sort || {};
    } else {
        throw new Error("find函数的参数必须为3个或4个");
        retrun;
    }
    _connectDb(function(err, db) {
        if (err) {
            callback(err, null);
            return;
        }
        const myDb = db.db("BMS");
        myDb.collection(collectionName).find(json).skip(skipCount)
        .limit(limit).sort(sort).toArray(function(err, result) {
            callback(err, result);
            db.close();
            return;
        });
    })
}

exports.deleteMany = function(collectionName, json, callback) {
    _connectDb(function(err, db) {
        if (err) {
            callback(err, null);
            return;
        }
        const myDb = db.db("BMS");
        myDb.collection(collectionName).deleteMany(json, function(err, result) {
           callback(err, result);
           db.close();
           return;
        });
    });   
}

exports.updateMany = function(collectionName, originJson, updateJson, callback) {
    _connectDb(function(err, db) {
        if (err) {
            callback(err, null);
            return;
        }
        const myDb = db.db("BMS");
        myDb.collection(collectionName).updateMany(originJson, updateJson, function(err, result) {
            callback(err, result);
            db.close();
            return;
        });
    });
}