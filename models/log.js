var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const logSchema = new Schema (
    {
        date: {
            type: String,
            required: true
        },
        questions: [{
            id: String,
            question: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            answer: {
                type: String, 
                required: true
            },
            choice: {
                one: String,
                two: String,
                three: String
            }
        }],
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }
)

module.exports = mongoose.model("Log", logSchema);