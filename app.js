//node_modules
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');

//connect database
mongoose.connect("mongodb://aaronq:newsapi@ds015508.mlab.com:15508/seng3011-news");
require('./models/models.js');

//routes
var api = require('./routes/api');
var index = require('./routes/index');

var app = express();
app.set('json spaces', 30)

//app.set('views', path.join(__dirname,'views'));

app.use(express.static(__dirname + '/views'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api', api);

//error handling (may not be neccesary)
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
//end error handling


app.listen(15508);
console.log('API is running on port 3000');
