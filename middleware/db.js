const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const mongodbURL = "mongodb://localhost/LoginAPI"

let _db;

const initDB = callback => {
    if (_db) {
        console.log("data base is already intialized");
        return callback(null, _db);
    }
    mongoClient
        .connect(mongodbURL)
        .then(client => {
            _db = client;
            callback(null, _db);
        }).catch(err => {
            callback(err);
        })
}

const getDB = () => {
    if (!_db) {
        throw Error("DataBase not intialized")
    }
    return _db;
}

module.exports = {
    initDB,
    getDB
}