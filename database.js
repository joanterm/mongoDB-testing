const {MongoClient} = require("mongodb")

let dbConnection

module.exports = {
    connectToDatabase: (callback) => {
        MongoClient.connect("mongodb://localhost:27017/bookstore")
        .then((response) => {     
            dbConnection = response.db()
            return callback()
        })
        .catch((error) => {
            console.log(error)
            return callback(error)            
        })
    },
    getDatabase : () => {
        return dbConnection
    }
}





