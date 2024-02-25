const app = require('./app')
const dotenv = require('dotenv')
const mongoose = require("mongoose")
dotenv.config({path: './config.env'})
const port = process.env.PORT

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB)
    .then(con=>{console.log('Connected to MongoDB')})
    .catch(err=>{console.log("Something went wrong")})

app.listen(port, ()=>{console.log(`Server is listening on ${port}`)})
