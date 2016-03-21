var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
	res.render('releases.html')
})

module.exports = router;