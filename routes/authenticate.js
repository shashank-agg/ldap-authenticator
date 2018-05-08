var express = require('express');
var router = express.Router();
var fs = require("fs");
const ldap = require('ldapjs');

router.post('/', function (req, res, next) {
    var usernameToAuthenticate = req.body.username;
    var passwordToAuthenticate = req.body.password;
    console.log(req);

    var config = fs.readFileSync("config.json", "utf8");
    config = JSON.parse(config);

    const ldapUrl = config.url,
        bindDN = config.bindDN,
        bindCredentials = config.bindCredentials,
        searchBase = config.searchBase;
    let searchFilter = config.searchFilter;

    
    searchFilter = searchFilter.replace("{{username}}", usernameToAuthenticate);

    const client = ldap.createClient({
        url: ldapUrl
    });
    
    client.bind(bindDN, bindCredentials, function (err) {
        if (err) {
            res.end(err);
        }
    });
    
    const opt = {
        filter: "(" + searchFilter + ")",
        scope: 'sub'
    }

    let responseMessage = '{"error": "No record found"}';
    
    client.search(searchBase, opt, (err, ldapResponse) => {
        ldapResponse.on('searchEntry', function(entry) {
            responseMessage = JSON.stringify(entry.object, null, 4);
          });
          ldapResponse.on('searchReference', function(referral) {
            responseMessage = "referral: " + referral.uris.join();
          });
          ldapResponse.on('error', function(err) {
            responseMessage = "error: " + err.message;
          });
          ldapResponse.on('end', function(result) {
            client.unbind();
            res.send(responseMessage);
          });
    });
});

module.exports = router;
