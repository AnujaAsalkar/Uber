
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , signup = require('./routes/signup')
  ,	mysql = require('mysql')
  ,session = require('client-sessions')
  ,expressSession = require("express-session")
  ,customer = require('./routes/customer')
  ,customer1=require('./routes/customer1')
  , path = require('path');

var app = express();

app.use(session({   
	  
	cookieName: 'session',    
	secret: 'cmpe273_test_string',    
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,  }));
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/profile' , signup.profile);
app.get('/directions' , signup.directions);
app.get('/Customernotification' , customer.Customernotification);
app.get('/driverModule' , signup.driverModule);
app.get('/Notifications' , signup.driverNotifications);

app.post('/next' , signup.signUp);
app.post('/page3' , signup.driverMaps);
app.post('/updateDriverProfile' , signup.updateDriverDetails);
app.post('/successSignin' , signup.driversignIn);
app.post('/acceptride', signup.acceptRide);
app.post('/driveraccepted' , signup.driveraccepted);


app.get('/signIn'  , function userSignin(req , res) {
	res.render('signIn');
});


app.get('/customerModule',customer.index);
app.get('/show_signup',customer.show_signup);
app.get('/welcomedriver',customer.welcomedriver);
app.get('/driverselected',customer.driverselected);
app.get('/history',customer.history);


app.post('/cust_signup',customer.signup);
app.post('/signin',customer.login);
app.post('/locationsrc',customer.locationsrc);
app.post('/locationdest',customer.locationdest);
//app.post('/history',customer.history);
app.post('/custSelectsdriver' , customer.custSelectsdriver);
app.post('/signUp',customer.rendersignup);
app.post('/selectdriver',customer.selectdriver);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
