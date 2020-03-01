const UserSchema = require('../models/user');

const getUsers = (email) => {
	return new Promise((resolve, reject) => {
		UserSchema.find({email}, (err, docs) => {
			if(err) reject(err);

			resolve(docs);
		})
	})
}

const checkUser = async(email) => {
	let users = await getUsers(email);

	if(users[0]) {
		return false;
	}
	return true;
}

module.exports = checkUser;