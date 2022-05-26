var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('../utils/validators')
var Schema = mongoose.Schema;

var addressSchema = new Schema(
    {
        one: String,
        two: String
    }
)

var userSchema = new Schema(
    {
    name: {
        type: String,
        required: true,
        maxlength: 100
    },

    email: {
        type: String,
        required: true,
        validate: {
            validator: validator.validateEmail,
            message: props => `${props.value} is not a valid email!`
        },
        trim: true,
        unique: true,
        maxlength: 100
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    image: {
        type: String
    },

    address: [addressSchema]
    }
);

userSchema.statics.findAndValidate = async function (email, password) {
    const user = await this.findOne({email});
    if (!user) {
        return false;
    }
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : false;
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

module.exports = mongoose.model("User", userSchema);