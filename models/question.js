var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const questionSchema = new Schema(
    {
    id: String,
    text: {
        type: String,
        required: true,
        maxlength: 100
    },
    type: {
        type: String,
        required: true,
    },
    choice: {
        one: String,
        two: String,
        three: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    }
)

module.exports = mongoose.model("Question", questionSchema);