const localHost = require("https-localhost");
const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const routeLogin = require("./routes/login");
const routeMessages = require("./routes/messages");

const port = 443;
const domain = "localhost.charlesproxy.com";

const app = localHost(domain);
app.use(express.urlencoded({ extended: true }));
app.use(helmet.hsts({
    maxAge: 60 * 60 * 24 * 365,
    includeSubDomains: true,
}))

app.use(
  session({
    secret: "key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: false
    }
  })
);

routeLogin(app);
routeMessages(app);

app.use("/static", express.static(__dirname + "/static"));

app.listen(port);

const appRedir = express();

appRedir.use((req, resp) => {
    resp.redirect(`https://${domain}${req.url}`);
})

appRedir.listen(80)

console.log(
  `open https://${domain} to observe localhost network traffic via Charles`
);
