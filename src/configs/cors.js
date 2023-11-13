//CORS
require("dotenv").config();
const configCors = (app) => {
  app.use(function (req, res, next) {
    let http_origin = req.headers.origin;
    // Website you wish to allow to connect
    if (
      http_origin === process.env.URL_REACT ||
      http_origin === process.env.URL_REACT_BK ||
      http_origin === process.env.URL_REACT_TEST
    ) {
      res.setHeader("Access-Control-Allow-Origin", http_origin);
    }
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow

    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, content-type, Authorization, Content-type , Accept, x-no-retry, Bearer"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    // Pass to next layer of middleware
    next();
  });
};
export default configCors;
