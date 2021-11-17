const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    lesson: {
        type: String,
        required: false
    },
    topic: {
        type: String,
        required: false
    },
    room: {
        type: String,
        required: false
    },
    thumbnail: {
        type: String,
        require: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('classes', ClassSchema);