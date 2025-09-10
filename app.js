 const express = require('express')
 const app = express()
 const taskRouter = require('./routes/tasks')
 const dbConnection = require('./db-connection/connect')
 require('dotenv').config()
 const port = process.env.PORT || 5000;
 //middleware
 app.use(express.static("./public"))
 app.use(express.json())

 app.use('/api/v1/tasks', taskRouter)

 const start = async () => {
     try {
         await dbConnection(process.env.MONGO_URI);
         app.listen(port, console.log(`server is listening to on port ${port}`))
     } catch (error) {
         console.log('Error connecting to the database', error);
     }
 }
 start();