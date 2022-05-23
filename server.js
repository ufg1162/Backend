const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const users = require('./routes/users');
const questions = require('./routes/questions');
const logs = require('./routes/logs');

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const sessionSecret = 'made a secret string';

// Set up mongoose connection
var dbURL = process.env.MONGO_URL || 'mongodb://localhost:27017/LogDay';
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Create MongoDB Session Store
const store = MongoStore.create({
    mongoUrl: dbURL,
    secret: sessionSecret,
    touchAfter: 24 * 60 * 60
})

// Setup to use the express-session package
const sessionConfig = {
    store, 
    name: 'session',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
        // later you would want to add: 'secure: true' once your website is hosted on HTTPS. 
    }
}

app.use(session(sessionConfig));

// This is middleware that will run before every request
app.use((req, res, next) => {
    // We can set variables on the request, which we can then access in a future method
    req.requestTime = Date.now();
    console.log(req.method, req.path);
    // Calling next() makes it go to the next function that will handle the request
    next();
});
///////////////////////////////////////////////////////////////////////////////////////////////
app.use('/api', users);
app.use('/api', questions);
app.use('/api', logs);

///////////////////////////////////////////////////////////////////////////////////////////////
app.use((err, req, res, next) => {
    console.log("Error handling called");
    // If want to print out the error stack, uncomment below
    // console.error(err.stack)
    // Updating the statusMessage with our custom error message (otherwise it will have a default for the status code).
    res.statusMessage = err.message;

    if (err.name === 'ValidationError') {
        res.status(400).end();
    } else {
        // We could further interpret the errors to send a specific status based more error types.
        res.status(500).end();
    }
})

port = process.env.PORT || 6000;
app.listen(port, () => { console.log('server started!')});