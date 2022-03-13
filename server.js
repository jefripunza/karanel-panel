console.log("\033[2J"); // clear CLI
require("dotenv").config(); // add .env

// ======================== App ========================
// Webserver
// Set Content Security Policies
const scriptSources = ["'self'", "'unsafe-inline'", "'unsafe-eval'"];
const styleSources = ["'self'", "'unsafe-inline'"];
const connectSources = ["'self'"];
const { app, webserver } = require("./app/webserver")({
  remoteFrontendPackage: true,
  bodyParser: true,
  secure: {
    parameterPollution: true,
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      scriptSrc: scriptSources,
      scriptSrcElem: scriptSources,
      styleSrc: styleSources,
      connectSrc: connectSources,
    },
    helmet: true,
    cors: true,
    cookie: "your-secret-key", // csrf ? http://expressjs.com/en/resources/middleware/csurf.html
    allowOrigin: "*",
    allowHeaders:
      "x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization, *",
  },
  public: true,
  debug: true,
});
