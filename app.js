const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const connectMongoDB = require('./config/db');
const passport = require('passport');
const session = require('express-session');
const { route } = require('./routes');
const { static } = require('express');

//Load config
dotenv.config({ path: './config/config.env' });

//Passport config
require('./config/passport')(passport);

//Connect mongoDB
connectMongoDB();

const app = express();

//Logging in dev
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Handlebars
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

//Sessions
// Session data is not saved in the cookie itself, just the session ID. Session data is stored server-side.
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

// Static file path
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port : ${PORT}`
  )
);
