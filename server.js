const express = require('express');
const config = require('config');
const app = express();
const debug = require('debug')('development:server');
const cors = require('cors')
const cookieParser = require('cookie-parser');
require('dotenv').config();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const db = require('./config/mongoose-connection');
const userRouter = require('./routes/userRouter');
const meetingRouter = require('./routes/meetingRouter');

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use('/api/auth', userRouter);

app.use('/api/meeting', meetingRouter);

app.listen(config.get("PORT"), () => {
    debug(`Server is running at: http://localhost:${config.get('PORT')}`);
});