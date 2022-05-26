const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Log = require('../models/log');
const { wrapAsync } = require('../utils/helper');
const { isLoggedIn } = require('../middleware/auth');

router.get('/logs/:date', isLoggedIn, wrapAsync(async function (req, res) {
    let log = await Log.find({user: req.session.userId, date: req.params.date});
    res.json(log);
}))

router.post('/logs', isLoggedIn, wrapAsync(async function (req, res) {
    const log = new Log({
        date: req.body.date,
        questions: req.body.questions,
        user: req.session.userId
    })
    await log.save();
    res.json(log);
}))

router.put('/logs/:id', isLoggedIn, wrapAsync(async function (req, res) {
    const id = req.params.id;
    const {questions} = req.body;
    await Log.findByIdAndUpdate(id, {questions},
        {runValidators: true});
    res.sendStatus(204);
}))

module.exports = router;