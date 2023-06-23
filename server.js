const express = require("express")
const server = express()
server.use(express.json({extended: false}))
const {connectToDatabase, getDatabase} = require("./database")

const PORT = process.env.PORT || 9000
// server.listen(PORT, () => {
//     console.log(`Listening on port ${PORT}...`)
// })
connectToDatabase((err) => {
    if(!err) {
        server.listen(PORT, () => {
            console.log(`Listening on port ${PORT}...`)
        })
        getDatabase()
    } else {
        console.log(`Unable to connect to port ${PORT}`)
    }
})

server.get("/", (req, res) => {
    res.send("Express working for MongoDB testing!")
})

server.get("/books", (req, res) => {
    let books = []
    getDatabase().collection("books")
        .find()
        .sort({title: 1})
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books)
        })
        .catch(() => {
            res.status(500).json({message: "Error getting adata"})
        })
})

