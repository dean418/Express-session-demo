const bodyParser = require('body-parser');
const nanoID = require('nanoid');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const express = require('express');

const app = express();

const routes = require('./routes/router');

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

app.use('/', routes);

app.listen(process.env.PORT || 8080);