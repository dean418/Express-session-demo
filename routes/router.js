const {Router} = require('express');
const router = Router();

const checkSession = require('../lib/checkSession');
const checkUser = require('../lib/checkUser');
const UserSchema = require('../models/user');

router.get('/signup', (req, res) => {
	res.send('welcome to the signup page');
});

router.post('/signup', async(req, res) => {
	if(! await checkUser(req.body.email)) {
		res.send('Email is already in use');
		return;
	}

	const user = new UserSchema({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	});

	user.save();

	req.session.name = req.body.name;
	req.session.sessionID = req.sessionID;
	req.session.save();

	res.redirect('/profile');
});

/**
 * middleware function 'checkSession'
 * checks if user has session,
 * can be used on all protected routes
 *
 * replaces unnecessary if statement, e.g.
 *
 * if(await checkSession(req.sessionID)) {
 * 		res.send(data)
 * }
 */
router.get('/profile', checkSession, (req, res) => {
	res.send(`profile page <br> welcome ${req.session.name}`);
});

router.get('/logout', checkSession, (req, res) => {
	req.session.destroy();
	res.redirect('/signup');
});

module.exports = router;