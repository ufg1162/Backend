const User = require('../models/user');
const Question = require('../models/question');
const {wrapAsync} = require('../utils/helper');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.session.userId) {
        throw new Error("Need to login first");
    }
    next();
}

// If the author has an agent, the logged in user must be that agent to access
module.exports.isAgent = wrapAsync(async (req, res, next) => {
    const id = req.params.id;
    const note = await Note.findById(id);
    if (note.agent && !note.agent.equals(req.session.userId)) {
        //throw new ExpressError("Not an authorized agent for this author", 401);
        throw new Error("Not an authorized agent for this author");
    }
    next();
}); 

// Checks if current sessionId and the User Id matches
module.exports.isAuthorized = wrapAsync(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user._id && !user._id.equals(req.session.userId)) {
        throw new Error("Not an authorized user", 401);
    }
    next();
});

// Checks if current sessionId and Owner of Question matches
module.exports.isMyQuestion = wrapAsync(async (req, res, next) => {
    const id = req.params.id;
    const question = await Question.findById(id);
    if (question.user && !question.user.equals(req.session.userId)) {
        throw new Error("Not and authorized user for this question", 401);
    }
    next();
})