var monday;
var sunday;	
var mondayCodeReview;
var sundayCodeReview;
var mapProjectConfiguration = new Array();
	
	
var sonarUrl;
var jenkinsUrl;
var cerberusUrl;
var serverUrl;
var codeReviewUrl;	
	
var teamCodeReview;	

var cerberusInfoLst = new Array();
	
// init method
$(document).ready(function() {

	let beginDateStr = findGetParameter("beginDate");
	let endDateStr = findGetParameter("endDate");
	let beginDateCodeReviewStr=findGetParameter("beginDateCodeReview");
	let endDateCodeReviewStr=findGetParameter("endDateCodeReview");

	if(beginDateStr != null && endDateStr!=null) {
		monday = new Date(beginDateStr);
		sunday = new Date(endDateStr);
	} else {
		monday = getLastMonday();
		
		// create new date of day before
		sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
	}

	if(beginDateCodeReviewStr != null && endDateCodeReviewStr!=null) {
		mondayCodeReview = new Date(beginDateCodeReviewStr);
		sundayCodeReview = new Date(endDateCodeReviewStr);
	} else {
		mondayCodeReview= new Date(monday.getTime());
		mondayCodeReview.setDate(mondayCodeReview.getDate()- 7);		
		sundayCodeReview= new Date(mondayCodeReview.getFullYear(), mondayCodeReview.getMonth(), mondayCodeReview.getDate() + 6);
	}
	
	setInputDate("#beginDate", monday);
	setInputDate("#endDate", sunday);
	setInputDate("#beginDateCodeReview", mondayCodeReview);
	setInputDate("#endDateCodeReview", sundayCodeReview);
	setInputDate("#beginDateCodeReview2", mondayCodeReview);
	setInputDate("#endDateCodeReview2", sundayCodeReview);
	
	$("#reportCerberusGeneral").hide();
	
	initProject();
	
	let project = findGetParameter("project");
	$('#projectParameter').val(project);
	$('#projectParameter2').val(project);
		
	// show menu active
	if(project != null) {
		$('#menu-' + project).addClass("active");
	}
		
	if(project === "codeReview") {
		$('#dashboardContainer').append("toto");
		$('#chooseYourProject').hide();
		$('#dashboardContainer').hide();
		$('#codeReview').show();
				
		$("#betweenDateCodeReview").text("Between " + mondayCodeReview.toString() + " and " + sundayCodeReview.toString());
		
		//$("#codeReviewContent").append($("#templateCodeReview"));
		
		teamCodeReview.forEach(function (data) {

			let templateCodeReview = $("#templateCodeReview").clone();	
			let idCR = "codereview-"+data.name;
			templateCodeReview.find("div:first").attr("id", idCR);
	
			$("#codeReviewContent").append(templateCodeReview.html());
			$("#"+idCR + " [name='name']").text(data.name);
			$("#"+idCR + " [name='seemore']").attr("href",codeReviewUrl+"/team/" + data.name);

			
			getCodeReviewInfo(data.name,fillCodeReview, mondayCodeReview, sundayCodeReview, "#"+idCR + " [name='?']");

		});
	} else if(mapProjectConfiguration[project] != undefined) {
		let data = mapProjectConfiguration[project];
		
		$("#betweenDate").text("Between " + monday.toString() + " and " + sunday.toString());
		
		getCodeReviewInfo(project,fillCodeReview, mondayCodeReview, sundayCodeReview);		
		
		data.projects.forEach( function (project) {
			addProject(project.name, 
				project.sonarName, 
				project.jenkinsName,monday,sunday, project.cerberusPrefixTag);						
		});
		
		$('#chooseYourProject').hide();
		$('#dashboardContainer').show();
	} else {
		$('#chooseYourProject').show();
		$('#dashboardContainer').hide();
	}
	
});


function setCodeReview(teams) {
	teamCodeReview = teams.teams;
}

function setToolsUrl(data) {
	sonarUrl=data.sonarUrl;
	jenkinsUrl=data.jenkinsUrl;
	cerberusUrl=data.cerberusUrl;
	serverUrl=data.serverUrl;
	codeReviewUrl=data.codeReviewUrl;
}

function addDashboard(data) {
	// 1 - ajouter un nouvel onglet
	$('#onglets').append(
			'<li id="menu-' + data.name + '">' +
            '        <a href="?project=' + data.name + '">' +
            '            <i class="pe-7s-graph"></i>' +
            '            <p>' + data.name + '</p>' +
            '        </a>' +
            '    </li> '
	);
	
	mapProjectConfiguration[data.name] = data;
	
	
}




function getLastMonday() {
  let d = new Date();
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
	  diff = diff - 7;
	let monday = new Date(d.setDate(diff));
	
  return monday;
}

function setInputDate(elmt, date) {
	let now = date;

	let day = ("0" + now.getDate()).slice(-2);
	
	let monthNumber = now.getMonth() + 1;
	let month = (monthNumber<10 ? "0":"") + monthNumber;

	let today = now.getFullYear()+"-"+(month)+"-"+(day) ;

	$(elmt).val(today);
}


function addProject(id, projectSonarName, projectJenkinsName, beginDate, endDate, prefixCerberusTag) {
	let projectSelector = "#"+id;	
	let projectDetail1 = $("#projectDetail").clone();	
	projectDetail1.find("div:first").attr("id",id);
	$( "#dashboardContainer" ).append( projectDetail1.html() );	
	
		
	modifyElmt($(projectSelector), "projectName", id);	
	modifyElmt($(projectSelector), "infoLabel", "Between "+beginDate.toString()+" and " + endDate.toString());	
	
		
	//getSonarInfo(projectSelector,projectSonarName, "2017-05-01T00:00:00+0100", "2017-05-19T00:00:00+0100", fillSonar);
	getSonarInfo(projectSelector,projectSonarName, beginDate.toString()+"T00:00:00+0100", endDate.toString()+"T00:00:00+0100", fillSonar);	

	if(prefixCerberusTag != null) {
		getCerberusTag(prefixCerberusTag, function(cerberusTags) {
				getCerberusInfo(projectSelector, cerberusTags.lasttag, fillCerberusInfo);
			}
		);
	} else {
		$(projectSelector + " [name='cerberusReport']").hide();
	}
	
	getJenkinsInfo(projectSelector,projectJenkinsName,fillJenkinsInfo);
	
}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
    .substr(1)
        .split("&")
        .forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
    return result;
}

Date.prototype.toString = function() {
	var day = this.getDate();
	var month = this.getMonth() + 1 ;
	var year = this.getFullYear();

	return year + '-' + (month<10 ? "0":"") + month + '-' + (day<10 ? "0":"") + day;
  
}

function fillCodeReview(codeReviewResult, selecter) {	
	if(selecter == undefined) {
		selecter = "#?";
	}

	result = codeReviewResult.projects[0];

	modifyChartOneValue(selecter.replace("?","chartCodeReview"), result.ratioCommitReview);		
	
	$(selecter.replace("?","commitNumber")).text(result.commitNumber);
	$(selecter.replace("?","approveCommitNumber")).text(result.approveCommitNumber);
	$(selecter.replace("?","commentCommitNumber")).text(result.commentCommitNumber);
	$(selecter.replace("?","reviewCommitNumber")).text(result.commitNumber-result.notReviewCommitNumber);	

	$(selecter.replace("?","smileyCodeReview")).addClass(getSmiley(result.ratioCommitReview, 100,50));
	
}


function fillSonar( projectSelector,sonarResult) {
	
	var projectElmt = $(projectSelector);
	
	modifyElmt(projectElmt, "numberOfCodeLines", sonarResult.numberLines);	
	modifyTrend(projectElmt, "numberOfCodeLinesTrend",sonarResult.numberLinesTrend);	
	modifyElmt(projectElmt, "blockerIssue", sonarResult.blockerViolation);
	modifyElmt(projectElmt, "criticalIssue", sonarResult.criticalViolation);
	
	if(sonarResult.blockerViolation>0)	
		$(projectSelector + " [name='blockerIssue']").addClass("bad");
	else 
		$(projectSelector + " [name='blockerIssue']").addClass("nice");	
	
	if(sonarResult.criticalViolation>0)	
		$(projectSelector + " [name='criticalIssue']").addClass("medium");
	else 
		$(projectSelector + " [name='criticalIssue']").addClass("nice");
		
	
	modifyTrend(projectElmt, "trendTestCoverage", Math.round(sonarResult.coverageTrend*10)/10);
	modifyTrend(projectElmt, "trendDocumentationApi", Math.round(sonarResult.documentedApiTrend*10)/10);
	
	$(projectSelector + " [name='trendTestCoverageColor']").addClass(getTrendColor(sonarResult.coverageTrend));
	$(projectSelector + " [name='trendDocumentationApiColor']").addClass(getTrendColor(sonarResult.documentedApiTrend));
	
	if(!isNaN(sonarResult.coverage)) {
		$(projectSelector + " [name='smileyTestCoverage']").addClass(getSmiley(sonarResult.coverage,80,50));
	}
	if(!isNaN(sonarResult.coverage)) {
		$(projectSelector + " [name='smileyDocumentationApi']").addClass(getSmiley(sonarResult.documentedApi,30,10));
	}
	


	modifyChartOneValue(projectSelector + " [name='chartTestCoverage']", sonarResult.coverage);
	modifyChartOneValue(projectSelector + " [name='chartDocumentationApi']", sonarResult.documentedApi);	


	if(sonarResult.lastSonarCalculation !== undefined) {
		let timeLastCalulation = diffdate(sonarResult.lastSonarCalculation, new Date());
		modifyElmt(projectElmt, "infoLabel", "/!\\ Sonar last calculation is old (generated " + timeLastCalulation + " days ago, the " + sonarResult.lastSonarCalculation.toString() + ")");	
		$(projectSelector + " [name='infoLabel']").addClass("bad");
	}

}

function diffdate(d1,d2){
	var WNbJours = d2.getTime() - d1.getTime();
	return Math.ceil(WNbJours/(1000*60*60*24));
}

function getSmiley(figure, levelMedium,levelBad) {
	
	if(figure < levelBad) {
		return "fa-frown-o";
	} else if(figure < levelMedium) {
		return "fa-meh-o";
	} else {
		return "fa-smile-o";
	}

}
function getTrendColor(trend) {
	if(isNaN(trend)) {
		return "medium";
	}else if(trend < -5) {
		return "bad";
	} else if(trend < 0) {
		return "medium";
	} else {
		return "nice";
	}
		
}

function fillCerberusInfo(projectSelector,cerberusInfo) {
	Chartist.Pie(projectSelector + " [name='chartCerberusResultLastExecution']", {
		labels: [displayCerberusStatus(projectSelector, cerberusInfo.status_NA_nbOfExecution, "NA"),
			displayCerberusStatus(projectSelector, cerberusInfo.status_CA_nbOfExecution, "CA"),
			displayCerberusStatus(projectSelector, cerberusInfo.status_KO_nbOfExecution, "KO"),
			displayCerberusStatus(projectSelector, cerberusInfo.status_FA_nbOfExecution, "FA"),
			displayCerberusStatus(projectSelector, cerberusInfo.status_OK_nbOfExecution, "OK"), 			
			displayCerberusStatus(projectSelector, cerberusInfo.status_PE_nbOfExecution, "PE"),
			displayCerberusStatus(projectSelector, cerberusInfo.status_NE_nbOfExecution, "NE")],
		series: [cerberusInfo.status_NA_nbOfExecution,
			cerberusInfo.status_CA_nbOfExecution,
			cerberusInfo.status_KO_nbOfExecution,			
			cerberusInfo.status_FA_nbOfExecution,
			cerberusInfo.status_OK_nbOfExecution,
			cerberusInfo.status_PE_nbOfExecution,
			cerberusInfo.status_NE_nbOfExecution]
		}
	);
	let startDate = new Date(cerberusInfo.executionStart);
	let endDate = new Date(cerberusInfo.executionEnd);
	let diff = endDate - startDate;
	
	$(projectSelector + " [name='campaignExecution']").text("Exectuted in " +  diff/1000 + "." + diff%1000 + " s" + " on " + cerberusInfo.executionStart);
	$(projectSelector + " [name='urlReportCerberus']").attr("href", cerberusInfo.urlReport);
}

function fillJenkinsInfo(projectSelector,cerberusInfo) {	
	$(projectSelector + " [name='buildQuality']").text(cerberusInfo.healthReport[1].score<100 ? "KO" : "OK");
	$(projectSelector + " [name='buildQuality']").addClass(cerberusInfo.healthReport[1].score<100 ? "bad" : "nice");
	$(projectSelector + " [name='detailBuild']").text(cerberusInfo.healthReport[1].description);
	$(projectSelector + " [name='testQuality']").text(cerberusInfo.healthReport[0].description);	
	$(projectSelector + " [name='linkLastBuild']").attr("href", cerberusInfo.lastBuild.url);
	
	
}


function displayCerberusStatus(projectSelector,status, title) {
	$(projectSelector + " [name='"+title+"']").text(status + " " + title);	
	
	if(status===0) {
		//$(projectSelector + " [name='"+title+"']").hide();
		$(projectSelector + " [name='elt"+title+"']").hide();
	} else {
		//$(projectSelector + " [name='"+title+"']").show();
		$(projectSelector + " [name='elt"+title+"']").show();
	}
	
	//return (status==null || status==0) ? " " : status + " " + title;
	return " ";
}

function modifyTrend(projectElmt, attribut, trend) {
	if(isNaN(trend)) {
		projectElmt.find("[name='" + attribut + "']").first().text("No data");	
	} else {
		projectElmt.find("[name='" + attribut + "']").first().text((trend >= 0 ? "+":"") + trend);	
	}
}

function modifyElmt(projectElmt, attribut, text) {
	projectElmt.find("[name='" + attribut + "']").first().text(text);	
}

function modifyChartOneValue(elmt, value) {
	Chartist.Pie(elmt, {
        labels: [value + '%',' '],
        series: [value, 100-value]
    });	
}


function getSonarInfo(projectSelector, projet, dateDebut, dateFin, callback) {
	let metrics = "ncloc,branch_coverage,public_documented_api_density,blocker_violations,critical_violations";
	
	let url = sonarUrl + "/api/timemachine?resource="+projet+"&metrics="+metrics+"&format=json&fromDateTime="+dateDebut+"&toDateTime=" + dateFin;
	
	let sonarResult = new Object();
	
    $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        data: {},
        url: url+"&callback=?",
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR)
        },
        success: function (msg) {											
			if(msg[0].cells.length==0) {
				sonarResult.numberLines = "No Data";
				sonarResult.numberLinesTrend = "No Data";
				sonarResult.coverage = "No Data";
				sonarResult.coverageTrend = "No Data";
				sonarResult.documentedApi = "No Data";
				sonarResult.documentedApiTrend = "No Data";						
				sonarResult.blockerViolation = "No Data";
				sonarResult.criticalViolation = "No Data";
				
				// call last figures 
				let url = "http://192.168.135.14:9000/api/resources?resource="+projet+"&metrics="+metrics+"&format=json&fromDateTime="+dateDebut+"&toDateTime=" + dateFin;
				 $.ajax({
					type: 'GET',
					dataType: 'jsonp',
					data: {},
					url: url+"&callback=?",
					error: function (jqXHR, textStatus, errorThrown) {
						console.log(jqXHR)
					},
					success: function (msg) {	
						console.log(msg);
						msg[0].msr.forEach(function(msr) {
							switch(msr.key) {
								case "blocker_violations" :
									sonarResult.blockerViolation = msr.val;
								break;
								case "branch_coverage" :
									sonarResult.coverage = msr.val;
								break;
								case "critical_violations" :
									sonarResult.criticalViolation  = msr.val;
								break;
								case "ncloc" :
									sonarResult.numberLines = msr.val;
								break;
								case "public_documented_api_density" :
									sonarResult.documentedApi = msr.val;
								break;
							}
						});
						

						sonarResult.lastSonarCalculation = new Date(msg[0].date);
						
						callback(projectSelector,sonarResult);
					}
				 });
				
				
				
			} else {
				let firstValue = msg[0].cells[0];
				let lastValue = msg[0].cells[msg[0].cells.length-1];
			
				sonarResult.numberLines = lastValue.v[0];
				sonarResult.numberLinesTrend = lastValue.v[0] - firstValue.v[0];
				sonarResult.coverage = lastValue.v[1];
				sonarResult.coverageTrend = lastValue.v[1] - firstValue.v[1];
				sonarResult.documentedApi = lastValue.v[2];
				sonarResult.documentedApiTrend = lastValue.v[2] - firstValue.v[2];						
				sonarResult.blockerViolation = lastValue.v[3];
				sonarResult.criticalViolation = lastValue.v[4];
				callback(projectSelector,sonarResult);
			}
			
			
        }
	});
	
}



function getCerberusTag(prefixTag, callback) {	
	let url = serverUrl + "/getLastTagCerberus?prefixTag="+prefixTag;
		
    $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        data: {},
        url: url+"&callback=?",	
        error: function (jqXHR, textStatus, errorThrown) {
			console.log("error " + textStatus);
            console.log(jqXHR)
        },
        success: function (msg) {	
			response = msg[0];		
			callback(response);
        }
	});	
}  


function getCerberusInfo(projectSelector,tagCerberus, callback) {	
	let url = serverUrl + "/cerberusinfo?tag="+ tagCerberus;
	
	let cerberusInfo = new Object();
    $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        data: {},
        url: url+"&callback=?",	
        error: function (jqXHR, textStatus, errorThrown) {
			console.log("error " + textStatus);
            console.log(jqXHR)
        },
        success: function (msg) {	
			response = msg[0];
		
			cerberusInfo.executionStart = response.ExecutionStart;
			cerberusInfo.executionEnd = response.ExecutionEnd;
			cerberusInfo.status_PE_nbOfExecution = response.status_PE_nbOfExecution;
			cerberusInfo.status_NA_nbOfExecution = response.status_NA_nbOfExecution;
			cerberusInfo.status_NE_nbOfExecution = response.status_NE_nbOfExecution;
			cerberusInfo.status_FA_nbOfExecution = response.status_FA_nbOfExecution;
			cerberusInfo.status_OK_nbOfExecution = response.status_OK_nbOfExecution;
			cerberusInfo.status_CA_nbOfExecution = response.status_CA_nbOfExecution;
			cerberusInfo.status_KO_nbOfExecution = response.status_KO_nbOfExecution;
			cerberusInfo.urlReport = "http://cerberus.siege.red/Cerberus/ReportingExecutionByTag.jsp?Tag="+tagCerberus;
			
			cerberusInfoLst.push(cerberusInfo);
						
			callback(projectSelector,cerberusInfo);
			
			majGeneralCerberusInfo();

        }
	});
	
}

function majGeneralCerberusInfo() {
	
	let cerberusInfo = new Object();
	cerberusInfo.status_PE_nbOfExecution = 0;
	cerberusInfo.status_NA_nbOfExecution = 0;
	cerberusInfo.status_NE_nbOfExecution = 0;
	cerberusInfo.status_FA_nbOfExecution = 0;
	cerberusInfo.status_OK_nbOfExecution = 0;
	cerberusInfo.status_CA_nbOfExecution = 0;
	cerberusInfo.status_KO_nbOfExecution = 0;
	cerberusInfo.urlReport = "";
		
	cerberusInfoLst.forEach(function(data) {
		cerberusInfo.executionStart = data.executionStart;
		cerberusInfo.executionEnd = data.executionEnd;
		cerberusInfo.status_PE_nbOfExecution += data.status_PE_nbOfExecution;
		cerberusInfo.status_NA_nbOfExecution += data.status_NA_nbOfExecution;
		cerberusInfo.status_NE_nbOfExecution += data.status_NE_nbOfExecution;
		cerberusInfo.status_FA_nbOfExecution += data.status_FA_nbOfExecution;
		cerberusInfo.status_OK_nbOfExecution += data.status_OK_nbOfExecution;
		cerberusInfo.status_CA_nbOfExecution += data.status_CA_nbOfExecution;
		cerberusInfo.status_KO_nbOfExecution += data.status_KO_nbOfExecution;
	});
	
	
	fillCerberusInfo("#reportCerberusGeneral",cerberusInfo);
	$("#reportCerberusGeneral").show();
}


// jenkins info : http://192.168.134.55:8210/job/finpmt-core/api/json?tree=healthReport[description,score],lastBuild[number,url],lastFailedBuild[number,url]



function getJenkinsInfo(projectSelector,projectName,callback) {	
	let url = serverUrl + "/jenkinsinfo?project_name="+ projectName;
	
	let jenkinsInfo = new Object();
    $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        data: {},
        url: url+"&callback=?",	
        error: function (jqXHR, textStatus, errorThrown) {
			console.log("error " + textStatus);
            console.log(jqXHR)
        },
        success: function (msg) {	
			response = msg[0];		
			callback(projectSelector,response);
        }
	});	
}


function getCodeReviewInfo(teamName,callback, beginDate, endDate, selecter) {	
	let url = serverUrl + "/codeReviewStats?teamName="+ teamName 
		+ "&beginDate=" + beginDate.toString()
		+ "&endDate=" + endDate.toString();
	
	$("#dateLegendCodeReview").text("Between " + beginDate.toString() + " and " + endDate.toString());
	
    $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        data: {},
        url: url+"&callback=?",	
        error: function (jqXHR, textStatus, errorThrown) {
			console.log("error " + textStatus);
            console.log(jqXHR)
        },
        success: function (msg) {	
			response = msg[0];		
			callback(response, selecter);
        }
	});	
}  
