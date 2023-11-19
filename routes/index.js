var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({message: "Group 20's Patient API"});
});

module.exports = router;
