var mongo=require("./mongoconnect");
var mongourl="mongodb://localhost:27017/test";
var hash;


function driver(msg,callback)
{
	var res={};
	msg.session={};
	var uname=msg.email;
	var pass=msg.pwd;
	//hash = bcrypt.hashSync(pass, salt);
	console.log("inside driver of mongo");
	mongo.connect(mongourl,function(){
			console.log('Connected to mongo at: ' + mongourl);
			var coll = mongo.collection('drivers');
			coll.find().toArray(function(err,result){
				if(result)
				{
					console.log("inside if");
					//msg.session.username= user.username;
					//console.log(msg.session.username +" is the session");
					for(var i=0;i<result.length;i++)
					{
						console.log("result:"+result[i].name);
						
					}
					res.code="200";
					res.value="Successfull login";
					res.drivers=result;
				}
				else
				{
					console.log("inside else");
					res.code="401";
					res.value="Failed login";
				}
				callback(null, res);
			});
		});
		mongo.close();
}


exports.driver=driver;
