const express = require("express")
const server = express()
server.use(express.json({extended: false}))
const {connectToDatabase, getDatabase} = require("./database")
const {ObjectId} = require("mongodb")

const PORT = process.env.PORT || 9000

let db 

connectToDatabase((callback) => {
    if(!callback) { // = TRUE
        server.listen(PORT, () => {
            console.log(`Listening on port ${PORT}...`)
        })
        db = getDatabase()
    } else {
        console.log(`Unable to connect to port ${PORT}`)
    }
})

server.get("/", (req, res) => {
    res.send("Express working for MongoDB testing!")
})

server.get("/books", (req, res) => {
    let books = []
    db.collection("books")
        .find()
        .sort({title: 1}) //ASCENDING ORDER
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books)
        })
        .catch(() => {
            res.status(500).json({message: "Error getting data"})
        })
})

server.get("/books/:id", (req, res) => {
    const id = req.params.id
    if (ObjectId.isValid(id)) { //CHECKS FOR 12BYTES OR 24HEX CHARS OF MONGO'S IDS
        db.collection("books")
        .findOne({_id: new ObjectId(id)})
        .then((result) => {
                if (result === null) { //CHECKS IF GIVEN ID EXISTS IN DATABASE
                    res.status(404).json({message: "There is no book with this id"})
                } else {
                    res.status(200).json(result)
                }
        })
        .catch(() => {
            res.status(500).json({message: "Error getting data"})
        })
    } else {
        res.status(500).json({message: "The id is not a string of 12 bytes or 24 hex characters"})
    }

})



