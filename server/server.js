var http = require('http');
var request = require('request');
var express = require('express');
var app = express();
var fs = require("fs");
var exec = require('exec');
var async = require('async');
var MongoClient = require("mongodb").MongoClient;
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

})

//error handling to prevent server is kill by an error
process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log(err);
})

//app.use(function(req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//    next();
//});

app.get("/version", function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET'); 
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); 
    res.setHeader('Access-Control-Allow-Credentials', true);
	let result = pjson.version;
	res.send(result);
});

app.get("/jenkinsinfo", function (req, res) {
	let projectName = req.param('project_name');
	let callback = req.param('callback');

	let credential = '';
	if(applicationConf.jenkins.user !== undefined) {
        credential = applicationConf.jenkins.user + ':' + applicationConf.jenkins.userToken + '@';
    }

    var jenkins = jenkinsapi.init('http://' + credential + applicationConf.jenkins.host+':'+applicationConf.jenkins.port+'');

    jenkins.job_info(projectName, {token: 'jenkins-token'}, function(err, data) {
        let result =  JSON.stringify(data);

        if(callback != null) {
            result = callback + "([" + result.toString() + "])";
        }

        res.end(result.toString());
    });
});


app.get("/sonarTimeMachine", function (req, res) {
    let sonarName = req.param('resource');
    let metrics = req.param('metrics');
    let dateDebut = req.param('fromDateTime');
    let dateFin = req.param('toDateTime');
    let callback = req.param('callback');
    let options = {
        host: applicationConf.sonar.host,
        port: applicationConf.sonar.port,
        path: "api/timemachine?resource="+sonarName+"&metrics="+metrics+"&format=json&fromDateTime="+dateDebut+"&toDateTime=" + dateFin + '&callback='+callback,
        method: 'GET'
    };

	let url = "http://"+ options.host + ":" + options.port + "/" + options.path;

    request(url, function(error, response, body) {
            res.end(body);
    });
});

app.get("/sonarResources", function (req, res) {
    let sonarName = req.param('resource');
    let metrics = req.param('metrics');
    let dateDebut = req.param('fromDateTime');
    let dateFin = req.param('toDateTime');
    let callback = req.param('callback');
    let options = {
        host: applicationConf.sonar.host,
        port: applicationConf.sonar.port,
        path: "api/resources?resource="+sonarName+"&metrics="+metrics+"&format=json&fromDateTime="+dateDebut+"&toDateTime=" + dateFin + '&callback='+callback,
        method: 'GET'
    };

    let url = "http://"+ options.host + ":" + options.port + "/" + options.path;

    request(url, function(error, response, body) {
        res.end(body);
    });
});



app.get("/jenkinsDeployInfo", function (req, res) {
    let endDate = new Date(req.param('endDate'));
    let jobName = req.param('jobName');
    let callback = req.param('callback');
   
	let path = 'job/' + jobName;

    let options = {
        host: applicationConf.jenkins.host,
        port: applicationConf.jenkins.port,
        path: path + "/api/json?tree=builds[number,status,timestamp,id,result]",
        method: 'GET'
    };


    let url = "http://"+ options.host + ":" + options.port + "/" + options.path;

    request(url, function(error, response, body) {
        var jsonData = JSON.parse(body);
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
        result.numberOfDeploy=cpt;
        result=JSON.stringify(result);

        if(callback != null) {
            result = callback + "([" + result + "])";
        }
        res.send(result);
    });

})

app.get("/cerberusinfo", function (req, res) {
	let projectName = req.param('project_name');
	let tag = req.param('tag');
	let callback = req.param('callback');

	let options = {
		host: applicationConf.cerberus.host,
		port: applicationConf.cerberus.port,
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

	getInfoCordonBleu(function (infoCordonBleu) {

        let result = infoCordonBleu;
        if(callback != null) {
            result = callback + "([" + JSON.stringify(infoCordonBleu) + "])";
        }
        res.end(result);
	},team,beginDate,endDate, callback);

})


app.get("/getLastTagCerberus", function (req, res) {
	let prefixTag = req.param('prefixTag');
	let callback = req.param('callback');

	let options = {
		host: applicationConf.cerberus.host,
		port: applicationConf.cerberus.port,
		path: '/Cerberus/GetTagExecutions',
		method: 'GET'
	};

	
	http.request(options, function(resRequest) {

		resRequest.setEncoding('utf8');

		var data = '';

		resRequest.on('data', function (chunk){
			data += chunk;
		});

		resRequest.on('end',function(){
			tags = JSON.parse( data ).tags;

			tags = tags.filter(function (item) {
				return item.indexOf(prefixTag) >= 0;
			});
            tags = tags.sort(SortByName);

			let result = '{"lasttag" : "'+ tags[tags.length-1] + '","tags" : ' + JSON.stringify(tags) + '}';

			if(callback != null) {
				result = callback + "([" + result + "])";
			}
			res.end(result);
		});
	}).end();
})



function SortByName(a, b){
    var aName = a.toLowerCase();
    var bName = b.toLowerCase();
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

// le semaphore permet de savoir quand les toutes les requêtes mongo attendu sont terminées
// 1 semaphore par callback, donc un tableau du genre semaphore[callback] = <int>
var semaphore = [];
function getInfoCordonBleu(callback, team, dateDebutStr, dateFinStr, callbackName) {
	let databaseConnectStr = "mongodb://" + applicationConf.cordonBleu.database_host + "/" + applicationConf.cordonBleu.database_name;
	console.log(databaseConnectStr);
	MongoClient.connect(databaseConnectStr, {poolSize: 10}, function(error, db) {
		if (error)  {
				console.log(error);
		}
		
		let dateDebut=new Date(dateDebutStr);
		let dateFin=new Date(dateFinStr);
		// include current date, set to last second of the day
		dateFin = new Date(dateFin.getFullYear(), dateFin.getMonth(), dateFin.getDate(), 23, 59, 59);

		let teams;
				
		if(team == null || team == undefined || team == "") {
			teams = db.collection("team").find({},{_id:1, name:1});
		} else {
			teams = db.collection("team").find({"name.unique" : team.toLowerCase()},{_id:1, name:1});
		}
		
		let cpt = 0;
		let cordonBleuInfos = new Array();
		
		semaphore[callbackName]=1;

		teams.count(function (errorTeaemsCount, teamsSize) {
			teams.forEach(function (team) {
				let cordonBleuInfo = new Object();
				cordonBleuInfo.team=team.name.value;
				cordonBleuInfos.push(cordonBleuInfo);
				
				var re = "/^/i";

                semaphore[callbackName]++;

                
				db.collection("commit").find({ "_id.team" : team._id,  "created": {  $gt : dateDebut,  $lt : dateFin }}).count(function (e, count) {
					cordonBleuInfo.nbCommitThisWeek=count;
                    semaphore[callbackName]--;
				});

                semaphore[callbackName]++;
				var nbCommitApprove = db.collection("commit").find({ "_id.team": team._id,  "created": {  $gt : dateDebut, $lt : dateFin}, approval : {$ne: null}}).count(function (e, count) {
					cordonBleuInfo.nbCommitApprove=count;
                    semaphore[callbackName]--;
				});

                semaphore[callbackName]++;
				var nbCommitComment = db.collection("commit").find({ "_id.team": team._id,  "created": {  $gt : dateDebut,  $lt : dateFin }, comments : {$gt: []}}).count(function (e, count) {
					cordonBleuInfo.nbCommitComment=count;
                    semaphore[callbackName]--;
				});

                semaphore[callbackName]++;
				var nbCommitWithoutReview = db.collection("commit").find({ "_id.team": team._id,  "created": {  $gt : dateDebut,  $lt : dateFin }, approval : null, comments : []}).count(function (e, count) {
					cordonBleuInfo.nbCommitWithoutReview=count;
                    semaphore[callbackName]--;
				});

				// final condition
				if(cpt === teamsSize-1) {
                    semaphore[callbackName]--;

					wait_until_semaphore( function(){

                        cordonBleuInfos.forEach(function(cbi) {
                        	if(cbi.nbCommitThisWeek==0) cbi.ratioCommitReview=100;
                            else cbi.ratioCommitReview = Math.round((((cbi.nbCommitThisWeek - cbi.nbCommitWithoutReview) / cbi.nbCommitThisWeek)*1000))/10.0;
						}, callback);

						callback(cordonBleuInfos);
					}, callbackName);
				}
				
				cpt=cpt+1;
			});			
		});
	});
}


function wait_until_semaphore(callback, callbackName) {
    console.log("wait semaphore : " + semaphore[callbackName]);
    if (semaphore[callbackName]==0) {
        callback();
    } else {
        setTimeout(function(){wait_until_semaphore(callback, callbackName)},1000);
    }
}