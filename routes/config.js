var express = require('express');
var router = express.Router();
var fs = require("fs");

/* GET home page. */
router.get('/', function (req, res, next) {
    var config = fs.readFileSync("config.json", "utf8");
    console.log(config);
    res.setHeader('Content-Type', 'application/json');
    res.send(config);
});

router.post('/', function (req, res, next) {
    console.log(typeof req.body);
    console.log(req.body);
    fs.writeFileSync("config.json", JSON.stringify(req.body, null, 4));
    var config = fs.readFileSync("config.json", "utf8");
    res.setHeader('Content-Type', 'application/json');
    res.send(config);
});

module.exports = router;
