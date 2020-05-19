const db = require('../database');
const User = require('../models/User');
const express = require('express');

const design = express.Router();

design.get('/custom', (req, res) => {
    res.sendFile('public/index.html');
});

design.post('/add', (req, res) => {
    const { userData, motifs, pull } = req.body;
    if (userData.acceptRules) {
        if (userData.acceptUsage) {
            const missingElements = Object.keys(userData).map(key => !['lastname', 'firstname', 'email', 'adresse', 'city', 'city_code'].includes(userData[key]));
            if (missingElements.length > 0) {
                res.status(403).json({ message: 'This fields are missing', data: missingElements });
            } else {
                const users = db.users.filter(u => u.login === userData.login);
                if (users.length === 0) {
                    users[0] = new User({
                        login: login,
                        username: login,
                        email: login + '@' + login + '.com',
                        password: login,
                        motifs: motifs,
                        pull: pull
                    });
                    db.addUser(users[0]);
                } else {
                    users[0].motfs = motifs;
                    users[0].pull = pull;
                }
                db.save();
                const u = users[0];
                delete u.password;
                res.status(200).json(u);
            }
        } else {
            res.status(403).json({ message: 'User must accept conditions of use.' });
        }
    } else {
        res.status(403).json({ message: 'User must accept rules.' });
    }
})

module.exports = design;