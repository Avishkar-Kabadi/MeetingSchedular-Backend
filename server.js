const express = require('express');
const config = require('config');
const app = express();
const debug = require('debug')('development:server');
const cookieParser = require('cookie-parser');
require('dotenv').config();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const db = require('./config/mongoose-connection');
const userRouter = require('./routes/userRouter');
const meetingRouter = require('./routes/meetingRouter');


app.use('/auth', userRouter);

app.use('/meeting', meetingRouter);

app.listen(config.get("PORT"), () => {
    debug(`Server is running at: http://localhost:${config.get('PORT')}`);
});