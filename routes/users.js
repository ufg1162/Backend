const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { wrapAsync } = require('../utils/helper');
const { isAuthorized, isLoggedIn, isAdmin } = require('../middleware/auth');

const multer = require('multer');
const upload = multer({dest: 'uploads/'});

// upload.single('image') tells it we are only uploading 1 file, and the file was named "image" on the front end client.
router.post('/users/:id/file', upload.single('image'), wrapAsync(async function (req, res) {
    // You can see the file details here – it also gets automatically saved into the uploads folder
    // Again, this is an example of how this works but you would do something a little different in production.
    console.log("File uploaded of length: " + req.file.size);
    console.dir(req.file);
    res.json("File uploaded successfully");
}));

router.get('/curruser', isLoggedIn, wrapAsync(async function (req, res) {
    let user = await User.find({_id: req.session.userId}).populate('address');
    res.json(user);
}))

// Handle Register
router.post('/register', wrapAsync(async function (req, res) {
    const {name, email, password,isadmin} = req.body;

    const user = new User({name,email, password,isadmin});
    await user.save();
    req.session.userId = user._id;
    res.json(user);
}))
 
// Handle Login
router.post('/login', wrapAsync(async function (req, res) {
    const {email, password} = req.body;
    const user = await User.findAndValidate(email, password);
    if (user) {
        req.session.userId = user._id;
        //res.sendStatus(204);
        res.json({userId:req.session.userId, name: user.name, isadmin: user.isadmin, email: user.email, image: user.image, address: user.address, status:204})
        console.log("logged in");
    }
    else {
        res.sendStatus(401);
    }
}))

// Handle Logout
router.post('/logout', wrapAsync(async function (req, res) {
    req.session.userId = null;
    res.sendStatus(204);
    console.log("logged out");
}))

// Edit User Profile
router.put('/users/:id', isAuthorized, wrapAsync(async function (req, res) {
    const id = req.params.id;
    const {name, email, password, image, address} = req.body;
    await User.findByIdAndUpdate(id, {name, email, password, image, address},
         {runValidators: true});
    res.sendStatus(204);
}))



// Check if the seesionId is available
router.post('/auth', wrapAsync(async function (req, res) {
    if (!req.session.userId) {
        res.json(false);
    }
    else {
        res.json(true);
      
    }
}))

router.get('/users', isLoggedIn, wrapAsync(async function (req, res) {
    console.log("Accessed by user id: " + req.session.userId);
    
    const allUsers = await User.find();
    res.json(allUsers);

    
}));

router.delete('/users/:id', wrapAsync(async function (req, res) {
    const id = req.params.id;
    console.log(id);
    const result = await User.findByIdAndDelete(id);
    console.log("Deleted successfully: " + result);
    res.json(result);
}));
  

module.exports = router;
