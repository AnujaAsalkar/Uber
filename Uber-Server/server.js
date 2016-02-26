//super simple rpc server example
var amqp = require('amqp')
, util = require('util');


//var login = require('./services/signin_signup');
var loginmongo = require('./services/signin_signupmongo');
var login = require('./services/login');

var path = require('path');


//For mongo
var express = require('express');
var http=require('http');
var mongoSessionConnectURL = "mongodb://localhost:27017/sessions";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo= require('./services/mongoconnect');


var app = express();

app.set('port', process.env.PORT || 4100);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
//app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


//Mongo ends


var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){

	 cnn.queue('login_signup_queue',function(q){ 
		 q.subscribe(function(message,header,deliveryInfo, m){
			 util.log(util.format(deliveryInfo.routingKey,message));
			 util.log("Message:"+JSON.stringify(message));
			 util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			 if(message.oper==="login")
			 {
				 login.signin(message, function(err,res){
						//return index sent
					 console.log("inside login.signin");
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
				 });
			 }
			 if(message.oper==="signup")
			 {
			 login.signup(message, function(err,res){
					//return index sent
				 console.log("inside login.signin");
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			}
			 if(message.oper==="ride")
			 {
				 console.log("inside login.ride");
			 login.ride(message, function(err,res){
					//return index sent
				 
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			}
			 if(message.oper==="history")
			 {
			 login.history(message, function(err,res){
					//return index sent
				 console.log("inside history");
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			}
			 if(message.oper==="driver")
				{
					login.driver(message, function(err,res){
						//return index sent
					 console.log("inside driver");
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
				 });
				}
			 
		 });
	 });
	
	//// Separing queue //////////////////////////
	console.log("listening on login_queue");

	cnn.queue('login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			console.log("message.task: "+ message.task);
			var t = message.task;
			console.log("t is: " + t);
			
			console.log("------------------Old Queue--------------------");
			if(t === "abc")
			{
			    console.log("inside value oof t: " + t);
				login.handle_request(message, function(err,res){
               console.log("inside server");
               console.log("server.replyto "+ m.replyTo);
                console.log("server.id "+ m.correlationId);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
				console.log("Login queue ends");
			}
			
			else if(t ==="taskDriverSignIn"){
				console.log(" Driver Sign In Queue Starts here with task name : " + t);
				login.driver_SignIn(message, function(err,res){
               console.log(" Here response of Sign In Queue to server.js ");
               console.log("server.replyto "+ m.replyTo);
                console.log("server.id "+ m.correlationId);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
				console.log("Login queue ends");
			}
				
			
			
		});
	});
		
	cnn.queue('driverUpdate', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			console.log("------------------Driver Update Queue-------------------");
			
			login.driverupdate_request(message, function(err,res){
               console.log(" Got response from driverupdate_request in login.js here ");
               console.log("server.replyto "+ m.replyTo);
                console.log("server.id "+ m.correlationId);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
				console.log(" Driver Update queue ends");
			
			
			
		});
	});
	
	cnn.queue('acceptRide', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			console.log("------------------Accept Ride Queue-------------------");
			
			login.acceptRide(message, function(err,res){
               console.log(" Got response from driverupdate_request in login.js here ");
               console.log("server.replyto "+ m.replyTo);
                console.log("server.id "+ m.correlationId);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
				console.log(" Driver Update queue ends");	
		});
	});
});
