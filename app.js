const express = require('express');
const passport = require('passport');
const session = require('express-session');
const indexRouter = require('./routes/indexRouter');
const userRouter = require('./routes/userRouter');
const folderRouter = require('./routes/folderRouter');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store')
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const path = require('node:path');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SECRET || SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000
        },
        store: new PrismaSessionStore(
            new PrismaClient(),
            {
                checkPeriod: 2 * 60 * 1000,
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined
            }
        )
    })
)

app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/folders', folderRouter);

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
app.use(express.static('./public'));

app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');

const PORT = 3000;
app.listen(PORT, () => console.log(`File Uploader listening on port ${PORT}`));