const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    userID: {
        type: String,
        required: true,
    },
    guildID: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    lastDaily: {
        type: Date,
        required: true,
    },
    streak: {
        type: Number,
        default: 0,
    }
});

module.exports = model('User', userSchema);