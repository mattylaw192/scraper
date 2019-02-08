var express = require("express");
var router = express.Router();




module.exports = {
    Article: require("./Article"),
    Note: require("./Note")
};

module.exports = router;