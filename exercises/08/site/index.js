const localHost = require("https-localhost");
const helmet = require("helmet");
const express = require("express");
const session = require("express-session");
const csurf = require("csurf");
const routeLogin = require("./routes/login");
const routeMessages = require("./routes/messages");

const port = 443;
const domain = "localhost.charlesproxy.com";

const app = localHost(domain);
app.use(express.urlencoded({ extended: true }));
app.use(
  helmet.hsts({
    maxAge: 60 * 60 * 24 * 365, // 1 year minimum to allow preload
    includeSubDomains: true, // must cover all subdomains to allow preload
    preload: true
  })
);

app.use(
  session({
    secret: "key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      httpOnly: false
    }
  })
);

app.use(csurf());

// app.get(
//     '/login',
//     csurf,
//     (req, res) => {
//         // pass the csrfToken to the view
//         res.render('send', { csrfToken: req.csrfToken() })
//     })

routeLogin(app);
routeMessages(app);

app.use("/static", express.static(__dirname + "/static"));

app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)

    // handle CSRF token errors
    res.status(403)
    res.send('csrf detected')
})

app.listen(port);

const redirApp = express();
redirApp.use(function(req, res) {
  return res.redirect(`https://${domain}${req.url}`);
});
redirApp.listen(80);

console.log(
  `open https://${domain} to observe localhost network traffic via Charles`
);
