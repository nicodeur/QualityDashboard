var http = require('http');
var request = require('request');
var express = require('express');
var app = express();
var fs = require("fs");
var exec = require('exec');
var async = require('async');
var jenkinsapi = require('jenkins-api');

// get verion
var pjson = require('./package.json');
console.log("Application QualityDashboard is in %s version", pjson.version);

// main.js
const conf = require('../front/conf/conf');
var applicationConf= conf.initProject().toolsUrlSettings;

//import {hello} from 'conf'; // or './module'
var server = app.listen(8085, function () {
	applicationConf = conf.initProject().toolsUrlSettings;

    var host = server.address().address
    var port = server.address().port
    console.log("App listening at http://%s:%s", host, port)

});

//error handling to prevent server is kill by an error
process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log(err);
});

app.get("/version", function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET'); 
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); 
    res.setHeader('Access-Control-Allow-Credentials', true);
	let result = pjson.version;
	res.send(result);
});


var credential = '';
if(applicationConf.jenkins.user !== undefined) {
    credential = applicationConf.jenkins.user + ':' + applicationConf.jenkins.userToken + '@';
}

app.get("/jenkinsinfo", function (req, res) {
	let projectName = req.query['project_name'];
	let callback = req.query['callback'];
	
    var jenkins = jenkinsapi.init('http://' + credential + applicationConf.jenkins.host+':'+applicationConf.jenkins.port+'');

    jenkins.job_info(projectName, {token: 'jenkins-token'}, function(err, data) {
        let result =  JSON.stringify(data);

        if(callback != null) {
            result = callback + "([" + result.toString() + "])";
        }

        res.end(result.toString());
    });
});

app.get("/jenkinsDeployInfo", function (req, res) {
    let endDate = new Date(req.query['endDate']);
    let jobName = req.query['jobName'];
    let callback = req.query['callback'];
   
	let path = '/job/' + jobName;

	var jenkins = jenkinsapi.init('http://' + credential + applicationConf.jenkins.host+':'+applicationConf.jenkins.port+'');

	jenkins.job_info(jobName, {tree : 'builds[timestamp,id,result]', token: 'jenkins-token'}, function(err, data) {        
        var jsonData = JSON.parse(data);
        var jenkinsBuilds = jsonData.builds;
        var cpt = 0;

        for (var i = 0, len = jenkinsBuilds.length; i < len; ++i) {
            var jenkinsBuild = jenkinsBuilds[i];

            if (jenkinsBuild.timestamp > endDate.getTime()
                && jenkinsBuild.result == "SUCCESS") {
                cpt++;
            }
        }

        var result = new Object();
        result.numberOfDeploy = cpt;
        result = JSON.stringify(result);

        if(callback != null) {
            result = callback + "([" + result.toString() + "])";
        }

        res.end(result.toString());
	});
});

app.get("/sonarTimeMachine", function (req, res) {
    let sonarName = req.query['resource'];
    let metrics = req.query['metrics'];
    let dateDebut = req.query['fromDateTime'];
    let dateFin = req.query['toDateTime'];
    let callback = req.query['callback'];
    let options = {
        host: applicationConf.sonar.host,
        port: applicationConf.sonar.port,
        path: "/api/timemachine?resource="+sonarName+"&metrics="+metrics+"&format=json&fromDateTime="+dateDebut+"&toDateTime=" + dateFin + '&callback='+callback,
        method: 'GET'
    };

	let url = "http://"+ options.host + ":" + options.port + options.path;


    http.request(options, function(resRequest) {
        resRequest.setEncoding('utf8');
        resRequest.on('data', function (body) {
            res.end(body);
        });
    }).end();
});

app.get("/sonarResources", function (req, res) {
    let sonarName = req.query['resource'];
    let metrics = req.query['metrics'];
    let dateDebut = req.query['fromDateTime'];
    let dateFin = req.query['toDateTime'];
    let callback = req.query['callback'];
    let options = {
        host: applicationConf.sonar.host,
        port: applicationConf.sonar.port,
        path: "/api/resources?resource="+sonarName+"&metrics="+metrics+"&format=json&fromDateTime="+dateDebut+"&toDateTime=" + dateFin + '&callback='+callback,
        method: 'GET'
    };

    let url = "http://"+ options.host + ":" + options.port + options.path;

    http.request(options, function(resRequest) {
        resRequest.setEncoding('utf8');
        resRequest.on('data', function (body) {
            res.end(body);
        });
    }).end();
});

app.get("/cerberusinfo", function (req, res) {
	let projectName = req.query['project_name'];
	let tag = req.query['tag'];
	let callback = req.query['callback'];

	let options = {
		host: applicationConf.cerberus.host,
		port: applicationConf.cerberus.port,
		path: "/" + applicationConf.cerberus.path + '/ResultCIV002?tag=' + tag,
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
});

app.get("/getLastTagCerberus", function (req, res) {
	let prefixTag = req.query['prefixTag'];
	let callback = req.query['callback'];

	let options = {
		host: applicationConf.cerberus.host,
		port: applicationConf.cerberus.port,
		path: "/" + applicationConf.cerberus.path + '/ReadTag?sSortDir_0=desc&iDisplayLength=1&sSearch=' + prefixTag,
		method: 'GET'
	};
	
	http.request(options, function(resRequest) {
		resRequest.setEncoding('utf8');
		var data = '';

		resRequest.on('data', function (chunk){
			data += chunk;
		});

		resRequest.on('end',function(){
			var obj = JSON.parse(data);
            let result = '{"lasttag" : "'+ obj.contentTable[0].tag + '"}';

			if(callback != null) {
				result = callback + "([" + result + "])";
			}

			res.end(result);
		});
	}).end();
});

app.get("/codeReviewStats", function (req, res) {
	let team = req.query['teamName'];
	let beginDate = req.query['beginDate'];
	let endDate = req.query['endDate'];
	let callback = req.query['callback'];

	let options = {
		host: applicationConf.cordonBleu.host,
		port: applicationConf.cordonBleu.port,
		path: "/api/activity/public?name=" + team + '&begin=' + beginDate + '&end=' + endDate,
		method: 'GET'
	};
	
	http.request(options, function(resRequest) {
		resRequest.setEncoding('utf8');
		var data = '';

		resRequest.on('data', function (chunk){
			data += chunk;
		});

		resRequest.on('end',function(){
			var obj = JSON.parse(data);
			
			let infoCordonBleu = new Object();
			infoCordonBleu.team=team;
			infoCordonBleu.nbCommitThisWeek=obj.nbCommit;
			infoCordonBleu.nbCommitApprove=obj.nbCommitApproved;
			infoCordonBleu.nbCommitComment=obj.nbCommitWithComments;
			infoCordonBleu.nbCommitWithoutReview=obj.nbCommitWithoutReview;
			
			if(obj.nbCommit==0) {
				infoCordonBleu.ratioCommitReview=100;
			} else {	
				infoCordonBleu.ratioCommitReview = Math.round(((infoCordonBleu.nbCommitThisWeek - infoCordonBleu.nbCommitWithoutReview) / infoCordonBleu.nbCommitThisWeek)*100);
			}

			let result = "([" + JSON.stringify(infoCordonBleu) + "])";
	        if(callback != null) {
	            result = callback + "([" + JSON.stringify(infoCordonBleu) + "])";
	        }
	        
	        res.end(result);
		});
		
	}).end();
});
