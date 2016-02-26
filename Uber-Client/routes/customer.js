var mysql=require('mysql');
var ejs = require("ejs");
var mq= require('../rpc/client');
var customerID;
var src=null;
var ridedate=new Array();
var ridetime=new Array();
var driverSSN;

var email;

var src_lat;
var src_long;

var dest_lat;
var dest_long;

exports.index = function(req, res){
	  res.render('customer_login', { title: 'Express' });
	};

exports.signup=function(req,res){
	
	
	var email=req.param("email");
	var pwd=req.param("pwd");
	
	var first_name=req.param("first_name");
	var last_name=req.param("last_name");
	
	console.log(first_name);
	console.log(last_name);
	
	var mobile=req.param("mobile");
	var card_number=req.param("card_number");
	var card_code=req.param("card_code");
	
	
	
	var msg_payload = { "email": email, "password": pwd, "first_name":first_name, "last_name":last_name, "mobile":mobile, "card_number":card_number, "card_code":card_code, "oper" : "signup"};
	
	console.log("In POST Request = UserName:"+ email+" "+pwd+ "  "+first_name);
	
	mq.make_request('login_signup_queue',msg_payload,function(err,results){
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("valid Login");
				//res.render("welcome.ejs");
				res.send({"login":"Success"});
				
			}
			else{    
				console.log("Invalid Login");
				//res.send({"login":"Fail"});
			}
		}  
	});
}


exports.login=function(req,res)
{
	 email = req.param("email");
	var pwd = req.param("pwd");
	console.log("email:"+email);
	
	var msg_payload = { "username": email, "password": pwd, "oper" : "login"};
	
	console.log("In POST Request = UserName:"+ email+" "+pwd);
	
	mq.make_request('login_signup_queue',msg_payload,function(err,results){
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("valid Login");
				customerID=results.customerID;
				console.log("customerID:"+customerID);
				//res.render("welcome.ejs");
				res.send({"login":"Success"});
				
			}
			else{    
				console.log("Invalid Login");
				//res.send({"login":"Fail"});
			}
		}  
	});
	
}

exports.rendersignup=function(req,res)
{
	console.log("inside rendersignup");
	res.send({"code":"200"});
	
}


exports.show_signup=function(req,res)
{
	res.render('customer_signup.ejs');
}

exports.welcomedriver = function(req,res){

	email = req.param("email");
	 pwd = req.param("pwd");
	 console.log("inside welcome driver");
	
	var msg_payload = { "username": email, "password": pwd, "oper" : "driver"};
	
	console.log("In POST Request = UserName:"+ email+" "+pwd);
	
	mq.make_request('login_signup_queue',msg_payload,function(err,results){
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("drivers searched..");
				driver_info=results.drivers;
				console.log("results.drivers:"+JSON.stringify(driver_info));
				res.render("driver_info.ejs",{"res":driver_info});
			}
			else{    
				console.log("no driver");
				//res.send({"login":"Fail"});
			}
		}  
	});
	
	
	//res.render("driver_info.ejs",{"customerID":customerID});
}

exports.welcome=function(req,res)
{
	res.render('welcome.ejs',{"customerID":customerID});
}

exports.locationsrc=function(req,res){
	 src=req.param("src");
	console.log("src:"+src);
}


exports.locationdest=function(req,res){
	var totaltime=req.param("time");
	var totaldistance=req.param("distance");
	
	console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@time:"+totaltime);
	console.log("@#$%^&*()distance:"+totaldistance);
	
	
	
	var dest=req.param("dest");
	console.log("dest:"+dest);
	
	 src=req.param("src");
		console.log("src:"+src);
		
		var src_co = src.split(",");
		 src_lat=src_co[0];
		src_long=src_co[1];
		console.log("lat:"+src_lat);
		console.log("long:"+src_long);
		
		var dest_co = dest.split(",");
		 dest_lat=dest_co[0];
		dest_long=dest_co[1];
		console.log("lat:"+dest_lat);
		console.log("long:"+dest_long);
		
		var d = new Date();
		var rideDate=formatDate(d);
		var rideTime=formatTime(d);
		console.log("date is:"+rideDate);
		console.log("time is:"+rideTime);
		
	
/*var msg_payload = { "src_lat" : src_lat, "src_long":src_long, "dest_lat":dest_lat, "dest_long":dest_long,"rideDate":rideDate,"rideTime":rideTime, "customerid": customerID, "status":"requested", "oper" : "ride"};
	
	console.log("In POST Request = pickup:"+ src+" ");
	
	mq.make_request('login_signup_queue',msg_payload,function(err,results){
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("valid Login");
				//res.render("welcome.ejs");
				console.log("inserted successfully into server");
				res.send({"login":"Success"});
				//res.render("selectdriver.ejs");
				
			}
			else{    
				console.log("Invalid Login");
				//res.send({"login":"Fail"});
			}
		}  
	});*/
}

exports.history=function(req,res)
{
	console.log("welcome in history");
	//var customerid=req.param("src");
	console.log("customerid:"+customerID);

	var msg_payload = { "customerid" : customerID,"oper" : "history"};
	console.log("In POST Request = customerid:"+ customerID+" ");
	
	mq.make_request('login_signup_queue',msg_payload,function(err,results){
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("searched customer history");
				//res.render("welcome.ejs");
				//console.log("inserted successfully into server");
				ridedate=results.d;
				//res.send({"date":results.d, "time":results.t});
				ridetime=results.t;
				res.render("customer_history.ejs",{"date":ridedate,"time":ridetime});
				//res.render("selectdriver.ejs");
				
			}
			else{    
				console.log("Invalid Login");
				//res.send({"login":"Fail"});
			}
		}  
	});
	
}
exports.custSelectsdriver=function(req,res)
{
	var d = new Date();
	var rideDate=formatDate(d);
	var rideTime=formatTime(d);
	var custdriverselected = req.param("drivername");
	console.log(custdriverselected +" customer selected driver ");
	//var msg_payload = { "custdriverselected" : custdriverselected,"oper" : "custdriverselected"};
	var msg_payload = { "src_lat" : src_lat, "src_long":src_long, "dest_lat":dest_lat, "dest_long":dest_long,"rideDate":rideDate,"rideTime":rideTime, "customerid": customerID, "status":"requested","custdriverselected" : custdriverselected, "oper" : "ride"};
	mq.make_request('login_signup_queue',msg_payload,function(err,results){
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log(" Inserted values in Rides Table Successfully <----------");
				//res.render("welcome.ejs");
				//console.log("inserted successfully into server");
				res.send({"login":"success"});
				//ridetime=results.t;
				//res.render("selectdriver.ejs");
				
			}
			else{    
				console.log("Invalid Login");
				//res.send({"login":"Fail"});
			}
		}  
	});
	
	
}


exports.driverselected=function(req,res)
{
	console.log("inside driver selected");
	//res.render("customer_history.ejs",{"date":ridedate,"time":ridetime});
}


exports.selectdriver=function(req,res)
{
	var driver_name=req.param('drivername');
	console.log("driver_name:"+driver_name);
	console.log("inside selectdriver");
}


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function formatTime(d) {
    hours = format_two_digits(d.getHours());
    minutes = format_two_digits(d.getMinutes());
    seconds = format_two_digits(d.getSeconds());
    return hours + ":" + minutes + ":" + seconds;
}

function format_two_digits(n) {
    return n < 10 ? '0' + n : n;
}


exports.Customernotification=function(req,res)
{
	console.log(email +"   Email ID of the Customer ");
	var msg_payload = { "email" : email,"oper" : "CustomerNotifications"};
	mq.make_request('login_signup_queue',msg_payload,function(err,results){
		
		if(err){
			
			throw err;
		}
		else 
		{
		
			
			if(results.code == 200){
				//console.log(results.rows[0].rideID +"  Ride ID for Customer Notifications ");
				res.render('Customernotification' , {"Customernotification" : results.rows});
				//res.send({"login":"Fail"});
        	}
			else{    
				console.log("Invalid Customernotification");
			
			}
		}  
	});
	
	console.log("directions");
	//res.render('directions');
}


