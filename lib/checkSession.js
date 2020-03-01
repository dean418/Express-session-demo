const SessionSchema = require('../models/session');

const getSessions = () => {
	return new Promise((resolve, reject) => {
		SessionSchema.find({}, (err, sessions) => {
			if (err) reject(err);

			resolve(sessions);
		});
	});
}

/**
 * next is a function to run the following middleware function,
 * which is back in index.js in our case:
 */
const checkSession = async(req, res, next) => {
	let sessions = await getSessions();

	for (const session of sessions) {
		if(JSON.parse(session.session).sessionID == req.sessionID) {
			next();
			return;
		}
	}
	res.send('You are not authorised to perform this action');
}

module.exports = checkSession;