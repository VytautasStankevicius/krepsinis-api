const express = require('express')
const morgan = require('morgan')
const participantRouter = require('./routes/participantRoutes')
const usersRouter = require('./routes/userRoutes')
const app = express()
app.use(express.json())

app.use(morgan('dev'))
app.use('/api/v1/participants', participantRouter);
app.use('/api/v1/participants/users', usersRouter);

module.exports = app;