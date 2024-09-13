const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const session = require('express-session');
const bcryptjs = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    username: username
                }
            });
            if (!user) {
                return done(null, false, { message: "No Username found" });
            }
            const match = await bcryptjs.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: "Incorrect password" });
            };
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
)

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        });
        done(null, user);
    } catch (err) {
        done(err);
    }
})

exports.userLogInGet = async (req, res, next) => {
    try {
        const message = req.session.messages || [];
        console.log(message);

        res.render('log-in', {
            title: "Log in",
            message: message,
            user: req.user,
        });
    } catch (err) {
        console.log(err);
    }
}

exports.userLogInPost = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/log-in',
    failureMessage: true,
});

exports.userLogout = async(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    })
}

exports.userSignUpGet = async (req, res, next) => {
    try {
        const message = req.session.messages || [];

        res.render('sign-up', {
            title: "Sign up",
            message: message[0],
            user: req.user,
        });
    } catch (err) {
        console.log(err);
    }
}

exports.userSignUpPost = [
    body('name', 'Name must not be empty')
        .trim()
        .isLength({ min: 1, max: 50 })
        .escape(),
    body('username', 'Username must not be empty')
        .trim()
        .isLength({ min: 1, max: 50 })
        .escape(),
    body('password', 'Password must not be empty')
        .trim()
        .isLength({ min: 8, max: 100 })
        .escape(),
    body('confirm_password', 'The passwords must match')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                return false
            }
            return true
        }),

    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('sign-up', {
                title: "Sign up",
                errors: errors.array()
            });
            return
        } else {
            const usernameTaken = await prisma.user.findUnique({
                where: {
                    username: req.body.username
                }
            });
            if (usernameTaken) {
                res.render('sign-up', {
                    title: "Sign up",
                    errors: [{ msg: "The username is already in use"}],
                    message: "The username is already in use",
                })
            }
        }
        const { name, username, password } = req.body

        try {
            await prisma.user.create({
                data: {
                    name: name,
                    username: username,
                    password: await bcryptjs.hash(password, 10)
                }
            });
            res.redirect('/');
        } catch (err) {
            return next(err);
        }
    }
]