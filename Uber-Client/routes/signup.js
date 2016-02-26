/**
 * New node file
 */
var mysql = require("mysql");
var mq_client = require('../rpc/client');
var userdetails;
var session;
var mq= require('../rpc/client');

function driverModule(req , res){
	console.log("  Driver Module ");
	res.render('index.ejs');
}
//var session;
function signUp(req,res)

{
	
	var firstname = req.param("first_name");
	var lastname = req.param("last_name");
	var email = req.param("email");
	var contactinfo = req.param("contactinfo");
	var password = req.param("password");
	var cityname = req.param("city_name");
	var ssn = req.param("ssn_number");
	
	
	var task = "abc";
	var msg_payload = { "username": firstname, "lastname": lastname,"email": email,"contactinfo": contactinfo,"password": password,"cityname": cityname,"ssn": ssn, "task": task };
	console.log(msg_payload);
	mq_client.make_request('login_queue',msg_payload, function(err,results){
	userdetails = results;
	if(results.code==200){
		console.log(" Response code is 200 -----");
		res.send({"status" : "success"});
		//res.render('drivermaps.ejs');
	}
	else{
		throw err;
	}
	});
	
	
	
	
	//Code ends
	
	/*var conn =mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : '',
		database : 'tempuber',
		//socket : '/tmp/mysql.sock'
		port : 3306
		//port : 3000
		
	});
	
	var insertquery=conn.query("insert into tempuber.drivers values ( '"+firstname+"', '"+lastname+"','"+email+"','"+contactinfo+"' ,'"+password+"' ,'"+cityname+"','"+ssn+"')", function(err,result){
		console.log(insertquery.sql);	
		if(err)
		{			console.error(err);
		
			return;
	}
				 //console.error(result[0].xy);
		res.render("signupsuccess");
	});*/
	
	
}

function driverMaps(req , res) {
res.render('drivermaps.ejs');
	
}

function profile(req , res){
	console.log(session +" Sessions are being stored in session variable here")
	res.render('profile.ejs');
}

function driversignIn(req , res){
	
	var drsrcLat , drsrcLong;
	var driversigninEmail = req.param("email");
	var driversigninpassword = req.param("password");
	var task = "taskDriverSignIn";
	var msg_payload = {"driversigninEmail": driversigninEmail,"driversigninpassword": driversigninpassword,"task": task };
	console.log(msg_payload);
	
	mq_client.make_request('login_queue',msg_payload, function(err,results){
		userdetails = results;
		if(results.code==200){
			
			drsrcLat = results.srcLat;
			drsrcLong = results.srcLon;	
			req.Session = results.user;
			session = req.Session;
			console.log("Sess maintained ---> " + req.Session);
			
			console.log(" Response code is 200 -----");
			console.log(" sign in values from server --->> "+JSON.stringify(results.user));
			
			console.log(" Results for driver source : -->> " +JSON.stringify(results.srcLon));
			
			res.render("drivermaps" , {driversource : results.srcLat , driversourcelong : results.srcLon});
	
		}
		else{
			throw err;
		}
		});
}

function updateDriverDetails(req , res) {
	
	
	var driverfirstname = req.param("driver_firstname");
	var driverlastname = req.param("driver_lastname");
	var driveremail = req.param("driver_email");
	var drivercontactinfo = req.param("driver_contactinfo");
	var driverpassword = req.param("driver_password");
	var drivercityname = req.param("driver_cityname");
	var driverssnnumber = req.param("driver_ssnnumber");
	//var task = "abc";
	var msg_payload = {"session": session,"driverfirstname": driverfirstname, "driverlastname": driverlastname,"driveremail": driveremail,"drivercontactinfo": drivercontactinfo,"driverpassword": driverpassword,"drivercityname": drivercityname,"driverssnnumber": driverssnnumber };
	console.log(JSON.stringify(msg_payload) + " Session sending for update Driver Details");
	
	mq_client.make_request('driverUpdate',msg_payload, function(err,results){
		userdetails = results;
		if(results.code==200){
			console.log(" Response code is 200 -----");
			res.render("signupsuccess");
		}
		else{
			throw err;
		}
		});	
}


function acceptRide(req , res) {
	console.log("Ride Accept function******************************");
	
	var rideID = "1";
	var srcLat = "37.3332213";
	var srcLong = "-121.9116566";
	
	var driverlat = req.param("src");
	//var driverlong = req.param("lon");
	
	//var long = req.param("src1");
	
	
	console.log(driverlat +" Getting latitude from Ajax here <------");

//	console.log(driverlong +" Getting longitude from Ajax here <------");
	
	var msg_payload = {"session": session, "srcLat": driverlat, "srcLong":srcLong };
	console.log(JSON.stringify(msg_payload) + " Session sending for update Driver Details");
	
	mq_client.make_request('acceptRide',msg_payload, function(err,results){
		userdetails = results;
		if(results.code==200){
			res.render('drivermaps');
			
			res.send({"login":"Success"});
			console.log(" Response code is 200 ----- server response for accept ride");
			
		}
		else{
			throw err;
		}
		});
	
	}

exports.driverNotifications=function(req,res)
{
	var a = req.param("src");
	console.log(" Here is the result 1234567567" +a);
	var driverSSN = session;
	/*console.log("SSN for driverNotifications__________________________________");
	var driverSSN = session;
	var drivername;
	var driverlastname;
	var driveremail;
	var driverphone;
	var drivercity;*/
	
	/*
	console.log(driverSSN +" SSN for driverNotifications");
	console.log(req.session +" SSN for driverNotifications");*/
	
	//res.render('Notifications');
	//console.log(custdriverselected +" customer selected driver ");
	var msg_payload = { "rideNotification" : driverSSN,"oper" : "rideNotification"};
	//var msg_payload = { "src_lat" : src_lat, "src_long":src_long, "dest_lat":dest_lat, "dest_long":dest_long,"rideDate":rideDate,"rideTime":rideTime, "customerid": customerID, "status":"requested","custdriverselected" : custdriverselected, "oper" : "ride"};
	mq.make_request('login_signup_queue',msg_payload,function(err,results){
		console.log(session +")@)@)@)@)@)@@)@)))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))");
		console.log("TOP Results");
		console.log(results);
		console.log("below Results");
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log(" Inserted values in Rides Table Successfully <----------");
				//console.log("Driver Details +++++++++++++++++++++++++++++++++++++++++++++++ " +results[0].firstname);
				//console.log(results.rows[0].rideID +" OuTPUT");
				//console.log("Dheeaj");
				//res.render("welcome.ejs");
				//console.log("inserted successfully into server");
				
				//console.log(results.rows);
				
				//driverlastname=results.lastname;
				//driveremail=results.email;
				//driverphone=results.phone;
				//drivercity=results.city;
        		res.render('Notifications' , {"requestedRides" : results.rows});
        		
        		//console.log(results.rows[0].rideID +" OuTPUT");
				
				
			}
			else{    
				console.log("Invalid Login");
				//res.send({"login":"Fail"});
			}
		}  
	});
	
	
}
exports.driveraccepted=function(req,res)
{
	var rideID = req.param("src");
	//var driverID = req.param("dest");
	console.log(" Driver Accepted");
	var driverSSN = session;
	
	var msg_payload = { "rideId" : rideID,"oper" : "driveraccepted"};
	mq.make_request('login_signup_queue',msg_payload,function(err,results){
		console.log("TOP Results");
		console.log(results);
		console.log("below Results");
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				//console.log(results.rows);
				//res.render('Notifications' , {"requestedRides" : results.rows});
				res.send({"login":"Fail"});
        		//console.log(results.rows[0].rideID +" OuTPUT");
				
				
			}
			else{    
				console.log("Invalid Login");
				//res.send({"login":"Fail"});
			}
		}  
	});
	
	
}

exports.directions=function(req,res)
{
	console.log(session);
	
	var msg_payload = { "AcceptedDriverID" : session,"oper" : "directions"};
	mq.make_request('login_signup_queue',msg_payload,function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			
			if(results.code == 200){
				console.log(results.rows[0].rideID +"results.code == 200 for Directions ");
				res.render('directions' ,  {"directions" : results.rows});
				//res.send({"login":"Fail"});
        	}
			else{    
				console.log("Invalid Directions");
			
			}
		}  
	});
	
	console.log("directions");
	//res.render('directions');
	
	
}

exports.directions=function(req,res)
{
	console.log(session);
	
	var msg_payload = { "AcceptedDriverID" : session,"oper" : "directions"};
	mq.make_request('login_signup_queue',msg_payload,function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			
			if(results.code == 200){
				console.log(results.rows[0].rideID +"results.code == 200 for Directions ");
				res.render('directions' ,  {"directions" : results.rows});
				//res.send({"login":"Fail"});
        	}
			else{    
				console.log("Invalid Directions");
			
			}
		}  
	});
	
	console.log("directions");
	//res.render('directions');
	
	
}




exports.driverModule = driverModule;
exports.acceptRide = acceptRide;
exports.updateDriverDetails = updateDriverDetails;
exports.profile = profile;
exports.driverMaps = driverMaps;
exports.signUp = signUp;
exports.driversignIn = driversignIn;
