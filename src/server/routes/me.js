const bcrypt = require('bcrypt');
const User = require('../models/User');
const db = require('../database');
const express = require('express');

const me = express.Router();

async function signin(req, res) {
    const { login, password } = req.body;
    const search = db.users.filter(u => u.login === login || u.email === login);
    if (search.length > 0) {
        const user = search[0];
        user.hasPassword(password)
            .then(result => {
                if (result === true) {
                    res.status(200).send(user);
                } else {
                    res.status(403).json({
                        error: 'Wrong login or password'
                    })
                }
            })
    } else {
        res.status(403).json({
            error: 'Wrong login or password'
        })
    }
}

async function signup(req, res) {
    const { login, email, username, password, confirm_password } = req.body;
    const search = db.users.filter(u => u.login === login || u.email === login);
    if (search.length === 0) {
        if (password === confirm_password) {
            const hashed_password = await bcrypt.hash(password, 12);
            const user = new User({
                login,
                email,
                username,
                password: hashed_password
            })
            db.addUser(user);
            res.status(200).json(user);
        } else {
            res.status(403).json({
                error: 'Password and confirm password are not the same.'
            })
        }
    } else {
        res.status(403).json({
            error: 'This login or email is already used. Please use another one.'
        })
    }
}

me.post('/signin', signin);
me.post('/signup', signup);

module.exports = me;