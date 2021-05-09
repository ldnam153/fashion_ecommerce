const express = require('express');
const morgan = require('morgan');
require('express-async-errors');
var Handlebars = require('handlebars');
const session = require('express-session');
const config = require('./config/default.json');

Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});

const app = express();
//store session
// const sessionStore = new MySQLStore(config.mysql);

app.set('trust proxy', 1)
app.use(session({
  secret: 'SECRET_KEY',
  resave: false,
  saveUnitialized: true,
  // store: sessionStore,
  cookie: {
    //secure: true
  }
}));

app.use(morgan('dev'));
app.use(express.urlencoded({
  extended: true
}));
//---local---
require('./middlewares/locals.mdw')(app);
app.use('/resources', express.static('resources'));
require('./middlewares/view.mdw')(app);
require('./middlewares/routes.mdw')(app);
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.render('500', {
    layout: false
  })
})

const PORT = process.env.PORT||3000;
app.listen(PORT, "0.0.0.0",function () {
  console.log(`E-Commerce app is listening at http://localhost:${PORT}`)
})