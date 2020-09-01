const  express = require('express')
const  dotenv = require('dotenv')

// Load env
dotenv.config({path: '.env'})

//init app
const app = express()
const PORT = process.env.PORT || 5000

app.listen(
    PORT,
    console.log(`Server running  on ${process.env.NODE_ENV} mode on port ${PORT}`)
)


