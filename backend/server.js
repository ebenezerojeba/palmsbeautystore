// import express from "express";
// import cors from "cors";

// const port = "4000"

// const app = express()
// app.use(cors())
// app.use(express.json())

// app.get(("/"), (req,res) =>{
//  res.send("API Working")
// }) 

// app.listen((port), () =>{
//     console.log(`Server started on port: ${port}`)
// } )




import express from 'express'
import cors from 'cors'

const app = express()

const port = 3000

app.use(cors())
app.use(express.json())


app.listen( (port), () => {
    console.log(`Server started on port: ${port}`)
})
app.get(("/"), (req,res)=>{
    res.send("Hello World")
})