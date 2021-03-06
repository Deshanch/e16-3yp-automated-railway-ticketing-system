require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors') // this is cross platform resource sharing
const cookieParser = require('cookie-parser')
const path = require('path')

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())

// Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api/customer', require('./routes/customerRouter'))
app.use('/api', require('./routes/trainRouter'))
app.use('/api', require('./routes/stationRouter'))
app.use('/api', require('./routes/travelRouter'))
app.use('/api', require('./routes/paymentRouter'))
app.use('/api/uncom', require('./routes/uncomRouter'))

//Connect to MongoDB
const URI = process.env.MONGODB_URL

if (process.env.NODE_ENV === 'test') {
    mongoose.connect(URI, {
        useNewUrlParser: true,
        useCreateIndex: true
    }, err => {
        if (err) throw err;
        console.log('Connected to MongoDB')
    })
} else {
    mongoose.connect(URI, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, err => {
        if (err) throw err;
        console.log('Connected to MongoDB')
    })
}

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}


app.get('/', (req, res) => {
    res.json({ msg: 'Hi From RTS' });
})


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})

module.exports = app;