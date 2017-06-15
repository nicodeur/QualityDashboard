var sonarUrl;
var jenkinsUrl;
var cerberusUrl;
var serverUrl;
var codeReviewUrl;
var exports= new Object();

// init method
$(document).ready(function() {

		let conf = exports.initProject();

		let report = new Report(conf.toolsUrlSettings, conf.dashboardSettings, conf.codeReviewSettings);

		report.init ();
});


class Report {

	constructor(settings, dashboardData, codeReviewData) {
			this.settings=settings;
			this.dashboardData=dashboardData;
			this.codeReviewData=codeReviewData;

			sonarUrl			="http://" + settings.sonar.host + ":" + settings.sonar.port;
			jenkinsUrl		="http://" + settings.jenkins.host + ":" + settings.jenkins.port;
			cerberusUrl		="http://" + settings.cerberus.host + ":" + settings.cerberus.port;
			serverUrl			="http://" + settings.server.host + ":" +  settings.server.port;
			codeReviewUrl	="http://" + settings.cordonBleu.host + ":" + settings.cordonBleu.port;

			// add dashboardData
			let thisObject = this;
			this.dashboardData.forEach(function(data) {
				thisObject.addDashboard(data);
			});
	}

	addDashboard (data) {
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

	init () {

			mondayAndSunday = Utils.getLastMondayAndSunday();

			Utils.setInputDate("#beginDate", mondayAndSunday.monday);
			Utils.setInputDate("#endDate", mondayAndSunday.sunday);
			Utils.setInputDate("#beginDateCodeReview", mondayAndSunday.mondayCodeReview);
			Utils.setInputDate("#endDateCodeReview", mondayAndSunday.sundayCodeReview);
			Utils.setInputDate("#beginDateCodeReview2", mondayAndSunday.mondayCodeReview);
			Utils.setInputDate("#endDateCodeReview2", mondayAndSunday.sundayCodeReview);

			$("#reportCerberusGeneral").hide();

			let project = Utils.findGetParameter("project");
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

				$("#betweenDateCodeReview").text("Between " + mondayAndSunday.mondayCodeReview.toString() + " and " + mondayAndSunday.sundayCodeReview.toString());

				//$("#codeReviewContent").append($("#templateCodeReview"));

				this.codeReviewData.teams.forEach(function (data) {

					let templateCodeReview = $("#templateCodeReview").clone();
					let idCR = "codereview-"+data.name;
					templateCodeReview.find("div:first").attr("id", idCR);

					$("#codeReviewContent").append(templateCodeReview.html());
					$("#"+idCR + " [name='name']").text(data.name);
					$("#"+idCR + " [name='seemore']").attr("href",codeReviewUrl+"/team/" + data.name);

					let cordonBleuInfo = new CordonBleuInfo(data.name, mondayAndSunday.mondayCodeReview, mondayAndSunday.sundayCodeReview, "#"+idCR + " [name='?']");
					cordonBleuInfo.getInfo();

				});
			} else if(mapProjectConfiguration[project] != undefined) {
				let data = mapProjectConfiguration[project];

				$("#betweenDate").text("Between " + mondayAndSunday.monday.toString() + " and " + mondayAndSunday.sunday.toString());

				if(data.responsible != undefined) {
					$("#responsible").text(data.responsible.name);
					$("#responsible").attr("href", "mailto:"+data.responsible.email);
				}

				let cordonBleuInfo = new CordonBleuInfo(project, mondayAndSunday.mondayCodeReview, mondayAndSunday.sundayCodeReview,null);
				cordonBleuInfo.getInfo();
				let thisObject = this;
				data.projects.forEach( function (project) {
					thisObject.addProject(project,mondayAndSunday.monday,mondayAndSunday.sunday);
				});

				$('#chooseYourProject').hide();
				$('#dashboardContainer').show();
			} else {
				$('#chooseYourProject').show();
				$('#dashboardContainer').hide();
			}
	}

	addProject(project, beginDate, endDate) {
		let id = project.name;
		let projectSelector = "#"+id;
		let projectDetail1 = $("#projectDetail").clone();
		projectDetail1.find("div:first").attr("id",id);
		$( "#dashboardContainer" ).append( projectDetail1.html() );

		Utils.modifyElmt($(projectSelector), "projectName", id);
		Utils.modifyElmt($(projectSelector), "infoLabel", "Between "+beginDate.toString()+" and " + endDate.toString());

		let sonarInfo = new SonarInfo(projectSelector,project.sonarName, beginDate.toString()+"T00:00:00+0100", endDate.toString()+"T00:00:00+0100");
		sonarInfo.getInfo();

		if(project.cerberusPrefixTag != null) {
			let cerberusTagInfo = new CerberusTagInfo(project.cerberusPrefixTag, function(cerberusTags) {
					let cerberusInfo = new CerberusInfo(projectSelector, cerberusTags.lasttag);
					cerberusInfo.getInfo();
				}
			);
			cerberusTagInfo.getInfo();
		} else {
			$(projectSelector + " [name='cerberusReport']").hide();
		}

		let jenkinsInfo = new JenkinsInfo(projectSelector, project.jenkinsName);
		jenkinsInfo.getInfo();

	}
}



var mondayAndSunday;

var mapProjectConfiguration = new Array();



/**
 * Redifined to date string to display automaticaly a beautiful date
 *
 */
Date.prototype.toString = function() {
	var day = this.getDate();
	var month = this.getMonth() + 1 ;
	var year = this.getFullYear();

	return year + '-' + (month<10 ? "0":"") + month + '-' + (day<10 ? "0":"") + day;

}
