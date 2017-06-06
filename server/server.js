var http = require('http');
var express = require('express');
var app = express();
var fs = require("fs");
var exec = require('exec');

var server = app.listen(8085, function () {
	console.log(server.address());
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)

})

app.get("/jenkinsinfo", function (req, res) {
	let projectName = req.param('project_name');
	let callback = req.param('callback');
	
	let options = {
		host: "192.168.134.55",
		port: 8210,
		path: '/job/' + projectName +'/api/json?tree=healthReport[description,score],lastBuild[number,url],lastFailedBuild[number,url]',
		method: 'GET'
	};

	http.request(options, function(resRequest) {
		resRequest.setEncoding('utf8');
		resRequest.on('data', function (data) {
			//data = JSON.parse( chunk );              
			
			let result = data;
			if(callback != null) {
				result = callback + "([" + data + "])";
			}
			
			res.end(result);
		});
	}).end();	
})

app.get("/cerberusinfo", function (req, res) {
	let projectName = req.param('project_name');
	let tag = req.param('tag');
	let callback = req.param('callback');
	
	console.log(tag  + " / " + callback);
	
	let options = {
		host: "cerberus.siege.red",
		port: 80,
		path: '/Cerberus/ResultCIV002?tag='+tag,
		method: 'GET'
	};

	http.request(options, function(resRequest) {
		resRequest.setEncoding('utf8');
		resRequest.on('data', function (data) {
			//data = JSON.parse( data );              
			
			let result = data;
			if(callback != null) {
				result = callback + "([" + data + "])";
			}
			
			res.end(result);
		});
	}).end();	
})


app.get("/codeReviewStats", function (req, res) {
	let team = req.param('teamName');	
	let beginDate = req.param('beginDate');	
	let endDate = req.param('endDate');	
	let callback = req.param('callback');

	if(team == undefined) {
		team = "";
	}
	
	exec('sh /apps/qualityReport/reportCordonbleuJson.sh '+beginDate+' '+endDate+' ' + team,function(err,stdout,stderr){
		if(err) {
			res.end("err : " + err);
		} else if (stderr) {
			res.end("stderr : " + stderr);
		} else {
			let result = stdout.substr(stdout.indexOf("{"), stdout.length - stdout.indexOf("{"));
			if(callback != null) {
				result = callback + "([" + result + "])";
			}
			res.end(result);
		}
	});
})


app.get("/getLastTagCerberus", function (req, res) {
	let prefixTag = req.param('prefixTag');
	let callback = req.param('callback');
	
	let options = {
		host: "cerberus.siege.red",
		port: 80,
		path: '/Cerberus/GetTagExecutions',
		method: 'GET'	
	};
	console.log("call GetTagExecutions");
	
	http.request(options, function(resRequest) {
		console.log("working ...");
		
		resRequest.setEncoding('utf8');
		
		var data = '';
		
		resRequest.on('data', function (chunk){
			data += chunk;
		});

		resRequest.on('end',function(){
						console.log('end ! ');

			tags = JSON.parse( data ).tags; 
						
			tags = tags.filter(function (item) {
				return item.indexOf(prefixTag) >= 0;
			});
			console.log("filtre ok");						
			//console.log(tags);						

			let result = '{"lasttag" : "'+ tags[tags.length-1] + '","tags" : ' + JSON.stringify(tags) + '}';
			
			if(callback != null) {
				result = callback + "([" + result + "])";
			}
			res.end(result);
		});
	}).end();	
})

