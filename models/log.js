var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const logSchema = new Schema (
    {
        date: {
            type: String,
            required: true
        },
        questions: [{
            question: String,
            type: String,
            answer: String
        }],
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }
)

module.exports = mongoose.model("Log", logSchema);