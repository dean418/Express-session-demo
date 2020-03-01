const bodyParser = require('body-parser');
const nanoID = require('nanoid');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const express = require('express');

const app = express();

const checkSession = require('./lib/checkSession');
const checkUser = require('./lib/checkUser');
const UserSchema = require('./models/user');

require('dotenv').config();

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@usersignup-j1kc2.mongodb.net/users?retryWrites=true&w=majority`, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {maxAge: 60000},
	store: new MongoStore({mongooseConnection: mongoose.connection}),
	genid: (req) => {return nanoID()}
}));

app.get('/signup', (req, res) => {
	res.send('welcome to the signup page');
})

app.post('/signup', async(req, res) => {
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
app.get('/profile', checkSession, (req, res) => {
	res.send(`profile page <br> welcome ${req.session.name}`);
});

app.get('/logout', checkSession, (req, res) => {
	req.session.destroy();
	res.redirect('/signup');
})

app.listen(process.env.PORT || 8080);