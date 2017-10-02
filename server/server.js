var http = require('http');
var express = require('express');
var app = express();
var fs = require("fs");
var exec = require('exec');
var async = require('async');
var MongoClient = require("mongodb").MongoClient;
var events = require('events');
var eventEmitter = new events.EventEmitter();

// main.js
const conf = require('./conf');
var applicationConf;

//import {hello} from 'conf'; // or './module'

var server = app.listen(8085, function () {
	applicationConf = conf.initProject().toolsUrlSettings;

	console.log(server.address());
    var host = server.address().address
    var port = server.address().port
    console.log("App listening at http://%s:%s", host, port)

})



//error handling to prevent server is kill by an error
process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log(err);
})


app.get("/jenkinsinfo", function (req, res) {
	let projectName = req.param('project_name');
	let callback = req.param('callback');

	let options = {
		host: applicationConf.jenkins.host,
		port: applicationConf.jenkins.port,
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
});

app.get("/jenkinsDeployInfo", function (req, res) {
    let endDate = new Date(req.param('endDate'));
    let jobName = req.param('jobName');
    let callback = req.param('callback');

	let path = '/job/' + jobName;

    let optionsLastBuild = {
        host: applicationConf.jenkins.host,
        port: applicationConf.jenkins.port,
        path: path + "/api/json?tree=lastBuild[number]",
        method: 'GET'
    };

    http.request(optionsLastBuild, function(resRequest) {
        resRequest.setEncoding('utf8');
        resRequest.on('data',function(data){
            let numberLastBuild = JSON.parse( data ).lastBuild.number;
            countNumberBuildBetween(endDate, path, numberLastBuild,0);

            eventEmitter.addListener('countNumberBuildEnd', function (countNumberBuildEnd) {
            	var result = new Object();
            	result.numberOfDeploy=countNumberBuildEnd;
            	result=JSON.stringify(result);
                if(callback != null) {
                    result = callback + "([" + result + "])";
                }
                res.end(result);
            });
        });
    }).end();
})

/**
 * Count recurcively the number of build by call JOB/$buildNumber/api? for each build.
 * Stop where build is older than endDate or if api return a 404 error
 *
 * Emmit an countNumberBuildEnd Event with number of build to cathc the result.
 * Use that to recover data
 * 		eventEmitter.addListener('countNumberBuildEnd', function (countNumberBuildEnd) {
 *               res.end("number : " + countNumberBuildEnd);
 *      });
 * @param endDate
 * @param path
 * @param nextBuild
 * @param countNumberBuild
 */
function countNumberBuildBetween(endDate, path, nextBuild, countNumberBuild) {

    let options = {
        host: applicationConf.jenkins.host,
        port: applicationConf.jenkins.port,
        path: path + "/" + nextBuild + "/api/json?tree=timestamp",
        method: 'GET'
    };


    http.request(options, function(resRequest) {
        let statusCode = resRequest.statusCode;
        resRequest.setEncoding('utf8');
        if (statusCode!=200) {
            eventEmitter.emit('countNumberBuildEnd',countNumberBuild);
        } else {
            resRequest.on('data', function (data) {
                data = JSON.parse(data);

                if (data.timestamp < endDate.getTime()) {
                    eventEmitter.emit('countNumberBuildEnd',countNumberBuild);
                } else {
                    countNumberBuildBetween(endDate, path, nextBuild - 1, countNumberBuild+1);
                }
            });
        }
    }).end();

}

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
	},team,beginDate,endDate);

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



function getInfoCordonBleu(callback, team, dateDebutStr, dateFinStr) {
	// TODO varaiblisiser la chaine de connexion
	MongoClient.connect("mongodb://192.168.134.148/cordonbleu", {poolSize: 10}, function(error, db) {
		if (error)  {
				console.log(error);
		}
		
		let dateDebut=new Date(dateDebutStr);
		let dateFin=new Date(dateFinStr);

		let teams;
				
		if(team == null || team == undefined || team == "") {
			teams = db.collection("team").find({},{_id:1, name:1});
		} else {
			teams = db.collection("team").find({"name.unique" : team.toLowerCase()},{_id:1, name:1});
		}
		
		let cpt = 0;
		let cordonBleuInfos = new Array();
		
		let semaphore=1;

		teams.count(function (errorTeaemsCount, teamsSize) {
			teams.forEach(function (team) {
				let cordonBleuInfo = new Object();
				cordonBleuInfo.team=team.name.value;
				cordonBleuInfos.push(cordonBleuInfo);
				
				var re = "/^/i";
				
				semaphore++;
				db.collection("commit").find({ "_id.team" : team._id,  "created": {  $gt : dateDebut,  $lt : dateFin }, "author.name" : {$regex :eval(re)}  }).count(function (e, count) {
					cordonBleuInfo.nbCommitThisWeek=count;
					//return count;
					semaphore--;
				});

				semaphore++;
				var nbCommitApprove = db.collection("commit").find({ "_id.team": team._id,  "created": {  $gt : dateDebut, $lt : dateFin}, approval : {$ne: null}, "author.name" : 
				{$regex :eval(re)}}).count(function (e, count) {
					cordonBleuInfo.nbCommitApprove=count;
					//return count;
					semaphore--;
				});

				semaphore++;
				var nbCommitComment = db.collection("commit").find({ "_id.team": team._id,  "created": {  $gt : dateDebut,  $lt : dateFin }, comments : {$gt: []}, "author.name" : {$regex :eval(re)} }).count(function (e, count) {
					cordonBleuInfo.nbCommitComment=count;
					//return count;
					semaphore--;
				});

				semaphore++;
				var nbCommitWithoutReview = db.collection("commit").find({ "_id.team": team._id,  "created": {  $gt : dateDebut,  $lt : dateFin }, approval : null, comments : [],  "author.name" : {$regex :eval(re)}}).count(function (e, count) {
					cordonBleuInfo.nbCommitWithoutReview=count;
					//return count;
					semaphore--;
				});
		
				// final condition
				if(cpt === teamsSize-1) {									
					semaphore--;
					wait_until_semaphore( function(){

                        cordonBleuInfos.forEach(function(cbi) {
                        	if(cbi.nbCommitThisWeek==0) cbi.ratioCommitReview=100;
                            else cbi.ratioCommitReview = Math.round((((cbi.nbCommitThisWeek - cbi.nbCommitWithoutReview) / cbi.nbCommitThisWeek)*1000))/10.0;
						});

						callback(cordonBleuInfos);
					}, semaphore);
				}
				
				cpt=cpt+1;
			});			
		});
	});
}


function wait_until_semaphore(callback, semaphore) {
    if (semaphore==0) {
        callback();
    } else {
        setTimeout(function(){wait_until_semaphore(callback, semaphore)},100);
    }
}
