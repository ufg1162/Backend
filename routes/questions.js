const express = require('express');
const router = express.Router();
const Question = require('../models/question');
const { wrapAsync } = require('../utils/helper');
const { isMyQuestion, isLoggedIn, isAdmin } = require('../middleware/auth');


router.get('/questions', isLoggedIn, wrapAsync(async function (req, res) {
    const questions = await Question.find({user: req.session.userId})
    res.json(questions);
}))

router.get('/questions/:id', isAdmin, wrapAsync(async function (req, res) {
    const id = req.params.id;
    const question = await Question.find({user: id})
    res.json(question);
}))


router.post('/questions', isLoggedIn, wrapAsync(async function (req, res) {
    const question = new Question({
        questions: req.body,
        user: req.session.userId,
    })
    await question.save();
    res.json(question);
}))

router.put('/questions/:id', isMyQuestion, wrapAsync(async function (req, res) {
    const id = req.params.id;
    const {questions} = req.body;
    await Question.findByIdAndUpdate(id, {questions},
        {runValidators: true});
    res.sendStatus(204);
}))

router.delete('/questions/:id', isMyQuestion, wrapAsync(async function (req, res) {
    const id = req.params.id;
    const result = await Question.findByIdAndDelete(id);
    res.json(result);
}))

module.exports = router;