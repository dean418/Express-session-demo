const {Schema, model} = require('mongoose');

const sessionSchema = new Schema({
	session: {type: String, required: true}
});

module.exports = model('sessions', sessionSchema);