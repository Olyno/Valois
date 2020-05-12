const db = require('../database');
const express = require('express');

const design = express.Router();

design.get('/custom', (req, res) => {
    res.sendFile('public/index.html')
});

design.post('/add', (req, res) => {
    const user = db.users.filter(u => u.login === '');
    console.log('True')
    console.log(req.body);
    res.status(200).json({});
})

module.exports = design;