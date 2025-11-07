// middlewares/securityMiddleware.js
const helmet = require('helmet');
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  'https://localhost:5173',  
  'https://localhost:3000',
  'https://localhost:5174'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked from origin: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

const securityMiddlewares = (app) => {
  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'default-src': ["'self'"],
        'frame-ancestors': ["'none'"],
      },
    },
    hidePoweredBy: true,
    frameguard: { action: 'deny' },
    ieNoOpen: true,
  }));

  app.use(cors(corsOptions));

  console.log(" Helmet and CORS security middleware applied.");
};

module.exports = securityMiddlewares;
