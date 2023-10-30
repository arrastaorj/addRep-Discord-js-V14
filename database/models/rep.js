const { Schema, model } = require('mongoose');

const Rep = new Schema({
    userId: { type: String, required: true, },
    guildId: { type: String, required: true, },
    Rep: { type: Number, default: 0, },
    Cd: { type: String },
})

module.exports = model('Rep', Rep)