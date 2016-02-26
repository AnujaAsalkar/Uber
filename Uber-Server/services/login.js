//var mongo = require("./mongo");
//var mongoURL = "mongodb://localhost:27017/facebook";
var mysql = require("mysql");

var pool  = mysql.createPool({
	connectionLimit : 100, 
	host :'localhost',
	user :'root',
	password :'',
	database :'uber',
	port :3306
});


function handle_request(req, callback){
	
	var res = {};
	
	var fname = req.username;
	var lastname = req.lastname;
	var email = req.email;
	var contact = req.contactinfo;
	var pass = req.password;
	var city = req.cityname;
	var ssn = req.ssn;
	var task = req.task;
	
	console.log(fname + lastname +email+contact+pass+ "here is the o/p");
	
	/*var conn =mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : ' ',
		database : 'uber',
		//socket : '/tmp/mysql.sock'
		port : 3306
		//port : 3000
		
	});*/
	conn=null;
	conn=pool.getConnection(function(err,connection){
        if (err) 
        {
            console.log("Error in connection database");
            connection.release();
            //return;
        }  
       // console.log("Query:" + sqlQuery);
        else
        {
        	console.log("after connecting in driver signup");
        		
        	
        var insertquery=connection.query("insert into uber.drivers values ( '"+fname+"', '"+lastname+"','"+email+"','"+contact+"' ,'"+pass+"' ,'"+city+"','"+ssn+"')", function(err,result){
    		console.log(insertquery.sql);
        	connection.release();
        	if (err) 
        	{
        		console.log(err.message);
        		res.code="401";
    			res.value="Failed login";	

        	}
        	else 
        	{
        		console.log("DB Data:" );
        		res.code="200";
    			res.value="Successfull login";	
        	}
        	callback(null, res);
        	//connection.release();
        });
        }
	});
/*	var insertquery=conn.query("insert into uber.drivers values ( '"+fname+"', '"+lastname+"','"+email+"','"+contact+"' ,'"+pass+"' ,'"+city+"','"+ssn+"')", function(err,result){
		console.log(insertquery.sql);	
		if(result){
		res.code = "200";
		//res.value = "Succes Login";
		}
		else{
			
			res.code = "401";
			
		}
		callback(null, res);
	});*/	
	console.log("----------------Sign Up Ends here ---------- ");
}


function driver_SignIn(req, callback){	
	
	var res = {};
	var driversigninEmail = req.driversigninEmail;
	var driversigninpassword = req.driversigninpassword;
	var task = req.task;
	
	console.log(driversigninEmail + driversigninpassword+ "here is the Driver Credentials");
	var conn =mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : '',
		database : 'uber',
		//socket : '/tmp/mysql.sock'
		port : 3306
		//port : 3000
		
	});
	
	  
	var signinquery=conn.query("SELECT * FROM uber.drivers drivers JOIN uber.driverLocation driverLocation on drivers.SSN=driverLocation.SSN  WHERE drivers.email='"+driversigninEmail+"' AND drivers.drpassword='"+driversigninpassword+"'", function(err,result){
		console.log(signinquery.sql);	
		if(result){
		res.code = "200";
		res.user = result[0].SSN;
		res.srcLat = result[0].srcLat;
		res.srcLon = result[0].srcLong;
		
		console.log(JSON.stringify(result[0].srcLat));
		console.log(JSON.stringify(result[0].SSN) + "  --->> Email id of Driver");
		console.log(JSON.stringify(res.user) + "  --->>  getting id of Driver");
		//res.value = "Succes Login";
		}
		else{
			
			res.code = "401";
			
		}
		callback(null, res);
	});
	
	console.log("----------------Sending back Sign In response to server.js ---------- ");

}

function driverupdate_request(req, callback){
	var res = {};
	console.log("Hi driver u[pdate queue");

	var drivername = req.driverfirstname;
	var driverlastname = req.driverlastname;
	var driveremail = req.driveremail;
	var drivercontactinfo = req.drivercontactinfo;
	//var firstname = req.firstname;
	var driverpassword = req.driverpassword;
	var drivercityname = req.drivercityname;
	var driverssnnumber = req.driverssnnumber;
	var session = req.session;
	
	console.log("Driver Name  is:" + drivername);
	console.log("password is:" + driverlastname);
	
	var conn =mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : '',
		database : 'uber',
		//socket : '/tmp/mysql.sock'
		port : 3306
		//port : 3000
		
	});
	
	var updatedriverquery=conn.query("UPDATE drivers SET  lastname='"+driverlastname+"' , email='"+driveremail+"' , phone='"+drivercontactinfo+"', drpassword='"+driverpassword+"', city='"+drivercityname+"' where SSN='"+session+"'", function(err,result){
		console.log(updatedriverquery.sql);	
		if(result){
		res.code = "200";
		//res.value = "Succes Login";
		}
		else{
			
			res.code = "401";
			
		}
		callback(null, res);
	});
	
	console.log("----------------Enters into handle_request---------- ");

}

function acceptRide(req, callback){
	var res = {};
	console.log("Hi accept Ride queue");

	var session = req.session;
	var rideID = req.rideID;
	var srcLat = req.srcLat;
	var srcLong = req.srcLong;
	
	console.log("seesion variable on server -->" +session);
	console.log(" Source Latitude  is:" + srcLat);
	console.log(" Source Longit is:" + srcLong);
	
	var conn=null;
	conn= pool.getConnection(function(err,connection){
        if (err) 
        {
            
            console.log("Error in connection database");
            connection.release();
            //return;
        }  
        else
        {
        	console.log("after connecting in acceptride");
        	
        	var updatedriverLoc=conn.query("UPDATE driverLocation SET  srcLat='"+srcLat+"' , srcLong='"+srcLong+"'  where ssn='"+session+"'", function(err,result){
        		//console.log(updatedriverLoc.sql);	
        		conn.release();
        		if(result){
        		res.code = "200";
        		//res.value = "Succes Login";
        		}
        		else{
        			
        			res.code = "401";
        			
        		}
        		callback(null, res);        	
        });
      }
	});	
	console.log("--------------- Accept ride sending Response---------- ");
}

function signup(msg,callback)
{
	var res={};
	var email=msg.email;
	var pwd=msg.password;
	var first_name=msg.first_name;
	var last_name=msg.last_name;
	var mobile=msg.mobile;
	var card_number=msg.card_number;
	var card_code=msg.card_code;
	
    
	var connection=null;
	connection= pool.getConnection(function(err,connection){
        if (err) 
        {
            
            console.log("Error in connection database");
            connection.release();
            //return;
        }  
       // console.log("Query:" + sqlQuery);
        else
        {
        	console.log("after connecting in signup");
        connection.query("insert into customer values('null','"+email+"','"+pwd+"','"+first_name+"','"+last_name+"','"+mobile +"','"+card_number+"','"+card_code+"')", function(err, rows) 
        { 
        	connection.release();
        	if (err) 
        	{
        		console.log(err.message);
        		res.code="401";
    			res.value="Failed login";	

        	}
        	else 
        	{
        		console.log("DB Data:" + rows);
        		res.code="200";
    			res.value="Successfull login";
        	}
        	callback(null, res);
        	
        });
        }

});
	
}


function signin(msg,callback)
{
	var res={};
	msg.session={};
	var uname=msg.username;
	var pass=msg.password;
	var first_name;
	console.log("uname:"+uname);
	console.log("pass:"+pass);
	
	console.log("after connecting");
	
	var connection=null;
	connection= pool.getConnection(function(err,connection){
        if (err) 
        {
            
            console.log("Error in connection database");
            //connection.release();
            //return;
        }  
        else
        {
        	console.log("after connecting in login");
            connection.query("select * from customer where email='"+uname+"'", function(err, rows) 
            { 
            	connection.release();
            	if (err) 
            	{
            		console.log(err.message);
            		res.code="401";
        			res.value="Failed login";	

            	}
            	else 
            	{
            		console.log("DB Data:" + rows);
            		console.log("Customer ID:"+rows[0].customerID);
            		//cannot fetch customerID after insertion
            		res.code="200";
            		res.customerID=rows[0].customerID;
        			res.value="Successfull login";	
            		//callback(err, rows);

            	}
            	callback(null, res);
            	//connection.release();
            });
            }

    });

}


function ride(msg,callback)
{
	var res={};
	var src_lat=msg.src_lat;
	var src_long=msg.src_long;
	var dest_lat=msg.dest_lat;
	var dest_long=msg.dest_long;
	var customerid=msg.customerid;
	var status=msg.status;
	var rideDate=msg.rideDate;
	var rideTime=msg.rideTime;
	
	src_lat=src_lat.replace('(','');
	dest_lat=dest_lat.replace('(','');
	console.log("src_lat:"+src_lat);
console.log("dest_lat:"+dest_lat);

var d = new Date();
console.log("date inserver:"+d.toLocaleString());

	var connection=null;
	connection= pool.getConnection(function(err,connection){
        if (err) 
        {
            console.log("Error in connection database");
            connection.release();
            //return;
        }  
       // console.log("Query:" + sqlQuery);
        else
        {
        	console.log("after connecting in rides");
        connection.query("insert into rides values('null','"+src_lat+"','"+src_long+"','"+dest_lat+"','"+dest_long+"','"+rideDate+"','"+rideTime+"','"+customerid+"','null','null','"+status+"','null','null','null','null')", function(err, rows) 
        { 
        	connection.release();
        	if (err) 
        	{
        		console.log(err.message);
        		res.code="401";
    			res.value="Failed login";	

        	}
        	else 
        	{
        		console.log("DB Data:" + rows);
        		res.code="200";
    			res.value="Successfull login";	
        	}
        	callback(null, res);
        	//connection.release();
        });
        }
	});
}

function history(msg,callback)
{
	console.log("inside history");
	var res={};
	var ridedate=new Array();
	var ridetime=new Array();
	msg.session={};
	var customerid=msg.customerid;
	var month;
	var day;
	var year;
	//var pass=msg.password;
	//var first_name;
	
	
	console.log("after connecting customerid:"+customerid);
	
	var connection=null;
	connection= pool.getConnection(function(err,connection){
        if (err) 
        {
            
            console.log("Error in connection database");
            //connection.release();
            //return;
        }  
        else
        {
        	console.log("after connecting in login");
            connection.query("select * from rides where customerID='"+customerid+"'", function(err, rows) 
            { 
            	connection.release();
            	if (err) 
            	{
            		console.log(err.message);
            		res.code="401";
        			res.value="Failed login";	

            	}
            	else 
            	{
            		console.log("DB Data:" + rows);
            		for (var i = 0; i < rows.length; i++) 
            		{		
            		console.log("rideDate:"+rows[i].ridedate);
            		month=(rows[i].ridedate.getMonth())+1;
            		console.log("***month:"+((rows[i].ridedate.getMonth())+1));
            		day=month+"/"+rows[i].ridedate.getDate();
            		console.log("***date:"+rows[i].ridedate.getDate());
            		year=day+"/"+rows[i].ridedate.getFullYear();
            		console.log("***year:"+rows[i].ridedate.getFullYear());
            		console.log("rideTime:"+rows[i].rideTime);
            		//cannot fetch customerID after insertion
            		res.code="200";
            		ridedate.push(year);
            		ridetime.push(rows[i].rideTime);
        			
            		}
            		//callback(err, rows);
            		res.d=ridedate;
            		res.t=ridetime;
            		res.value="Successfull login";	

            	}
            	callback(null, res);
            	//connection.release();
            });
            }
    });
}


function driver(msg,callback)
{
	console.log("inside driver");
	var res={};
	var driverarray=new Array();
	
	//var pass=msg.password;
	//var first_name;
	//console.log("after connecting customerid:"+customerid);
	
	var connection=null;
	connection= pool.getConnection(function(err,connection){
        if (err) 
        {
            
            console.log("Error in connection database");
            //connection.release();
            //return;
        }  
        else
        {
        	console.log("after connecting in login");
            connection.query("select * from drivers", function(err, rows) 
            { 
            	connection.release();
            	if (err) 
            	{
            		console.log(err.message);
            		res.code="401";
        			res.value="Failed login";	

            	}
            	else 
            	{
            		console.log("inside else");
					//msg.session.username= user.username;
					//console.log(msg.session.username +" is the session");
					for(var i=0;i<rows.length;i++)
					{
						console.log("result:"+rows[i].firstname);
						driverarray.push(rows[i]);
						
					}
					res.code="200";
					res.value="Successfull login";
					res.drivers=driverarray;
            		
            	/*	
            		console.log("DB Data:" + rows);
            		for (var i = 0; i < rows.length; i++) 
            		{		
            		console.log("rideDate:"+rows[i].ridedate);
            		month=(rows[i].ridedate.getMonth())+1;
            		console.log("***month:"+((rows[i].ridedate.getMonth())+1));
            		day=month+"/"+rows[i].ridedate.getDate();
            		console.log("***date:"+rows[i].ridedate.getDate());
            		year=day+"/"+rows[i].ridedate.getFullYear();
            		console.log("***year:"+rows[i].ridedate.getFullYear());
            		console.log("rideTime:"+rows[i].rideTime);
            		//cannot fetch customerID after insertion
            		res.code="200";
            		ridedate.push(year);
            		ridetime.push(rows[i].rideTime);
        			
            		}
            		//callback(err, rows);
            		res.d=ridedate;
            		res.t=ridetime;
            		res.value="Successfull login";	
            	 	*/
            	}
            	callback(null, res);
            	//connection.release();
            });
            }
    });
}






exports.driver=driver;

exports.ride=ride;
exports.signin=signin;
exports.signup=signup;
exports.pool = pool;
exports.history=history;

///// New Queue Ends here //////
exports.acceptRide = acceptRide;
exports.driver_SignIn = driver_SignIn;

exports.handle_request = handle_request;
exports.driverupdate_request = driverupdate_request;