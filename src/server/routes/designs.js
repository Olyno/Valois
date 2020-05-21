const db = require('../database');
const User = require('../models/User');
const express = require('express');

const design = express.Router();

design.get('/custom', (req, res) => {
    res.sendFile('public/index.html');
});

design.post('/add', (req, res) => {
    const { userData, motifs, pull } = req.body;
    if (userData.data.acceptRules) {
        if (userData.data.acceptUsage) {
            const missingElements = Object.keys(userData.data).filter(key => ![
                'lastname',
                'firstname',
                'email',
                'adresse',
                'city',
                'city_code',
                'acceptRules',
                'acceptUsage',
                'acceptNewsletters'
            ].includes(key));
            if (missingElements.length > 0) {
                return res.status(403).send({ error: 'This fields are missing: ' + missingElements.join(', ') });
            } else {
                const users = db.users.filter(u => u.login === userData.login);
                if (users.length === 0) {
                    users[0] = new User({
                        login: userData.login,
                        username: userData.data.lastname + ' ' + userData.data.firstname.split('')[0].toUpperCase(),
                        email: userData.data.email,
                        password: userData.login,
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
                return res.status(200).json(u);
            }
        } else {
            return res.status(403).send({ error: 'User must accept conditions of use.' });
        }
    } else {
        return res.status(403).send({ error: 'User must accept rules.' });
    }
})

module.exports = design;