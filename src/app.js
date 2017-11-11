const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');

const primus = require('feathers-primus');
const handler = require('feathers-errors/handler');
const notFound = require('feathers-errors/not-found');

const middleware = require('./middleware');
//const services = require('./services');
const services = require('./services/db');
const appHooks = require('./app.hooks');

const app = feathers();

// Load app configuration
app.configure(configuration());
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', feathers.static(app.get('public')));


// Set up Plugins and providers
app.configure(hooks());
app.configure(rest());


app.use(function (req, res, next) {
  req.feathers.req = req;
  next();
});

app.configure(primus({ transformer: 'websockets' }));
// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
// Set up our services (see `services/index.js`)
app.configure(services);
// Configure a middleware for 404s and the error handler
app.use(notFound());
app.use(handler());

app.service('/report').hooks({
  before: {
    create(hook) {
      hook.data.reporterIP = hook.params.req.ip;
    },
  }
});

app.hooks(appHooks);

module.exports = app;
