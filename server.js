/** Configure Environment Variables */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv-flow').config();

/** Dependencies */
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

/** Initalize App */
const app = express();

/** Middlewares */
// Enable CORS
app.use(cors());
// BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// use Session
app.use(session({
  secret: process.env.COOKIE_KEY,
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  }
}));
// Passport
require('./services/passport')(app, passport);

/** Routes */
// app.get('/', (req, res) => {
//   res.send("This is EatPlaySleep Server");
// });
require('./routes/auth')(app);
require('./routes/user')(app);
require('./routes/baby')(app);
require('./routes/activity')(app);

/** Frontend for production */
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is up on port ${PORT}`));