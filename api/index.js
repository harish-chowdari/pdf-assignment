const express = require("express")

const app = express()
app.use(express.json())

const dotenv = require("dotenv")
dotenv.config()

const cors = require("cors")
app.use(cors())

app.use("/pdfs", express.static("upload/pdfs"));

 
require("./DB")




const routes = require("./routes/routes")
app.use("/api", routes)


const userRoutes = require("./routes/userRoutes")
app.use("/api", userRoutes)


port = process.env.PORT
app.listen(port, ()=>{
    console.log("server running")
})

