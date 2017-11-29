class SonarInfo extends GetAndFillInfo {

	constructor(globalSettings, contextData, contextModuleData) {
		super();
		this.projectSelector=contextModuleData.selector;
		this.sonarName=contextModuleData.module.sonarName;
		this.dateDebut=contextData.mondayAndSunday.monday;
		this.dateFin=contextData.mondayAndSunday.sunday;;
	}

	getUrl() {
		this.metrics = "ncloc,branch_coverage,public_documented_api_density,blocker_violations,critical_violations";
		let url = serverUrl + "/sonarTimeMachine?resource="+this.sonarName+"&metrics="+this.metrics+"&format=json&fromDateTime="+this.dateDebut+"&toDateTime=" + this.dateFin;
		return url;
	}

	isParameterSpecified() {
		return this.sonarName !=undefined && this.sonarName != '';	
	}
	
    checkPluginAvailable() {
        if(this.projectSelector == undefined || this.sonarName == undefined) return false;

        $(this.projectSelector + " [name='sonarPanel']").show(); // show build panel
        return true;
    }

	getResult(msg) {
		let sonarResult = new Object();
		if(msg[0].cells.length==0) {
			sonarResult.numberLines = "No Data";
			sonarResult.numberLinesTrend = "No Data";
			sonarResult.coverage = "No Data";
			sonarResult.coverageTrend = "No Data";
			sonarResult.documentedApi = "No Data";
			sonarResult.documentedApiTrend = "No Data";
			sonarResult.blockerViolation = "No Data";
			sonarResult.criticalViolation = "No Data";
			let this_=this;
			// call last figures
			let url = sonarUrl + "/api/resources?resource="+this.sonarName+"&metrics="+this.metrics+"&format=json&fromDateTime="+this.dateDebut+"&toDateTime=" + this.dateFin;
			 $.ajax({
				type: 'GET',
				dataType: 'jsonp',
				data: {},
				url: url+"&callback=?",
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(jqXHR)
				},
				success: function (msg) {

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
					this_.fillInfo(sonarResult);
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
		}
		return sonarResult;
	}


	fillInfo(info) {
		if(info == null) return;

        $(this.projectSelector + " [name='sonarPanel']").show(); // show sonar panel

		//$(this.projectSelector + " [name='infoLabel'").append("<br /><a target=\"_blank\" href='"+sonarUrl+"/dashboard?id="+ this.sonarName + "&did=1'>Go to sonar</a>")
		$(this.projectSelector + " [name='linkToSonar']").attr("href", sonarUrl+"/dashboard?id="+ this.sonarName + "&did=1");	
        var projectElmt = $(this.projectSelector);

		Utils.modifyElmt(projectElmt, "numberOfCodeLines", info.numberLines);
		Utils.modifyTrend(projectElmt, "numberOfCodeLinesTrend",info.numberLinesTrend);
		Utils.modifyElmt(projectElmt, "blockerIssue", info.blockerViolation);
		Utils.modifyElmt(projectElmt, "criticalIssue", info.criticalViolation);



		if(info.blockerViolation>0)
			$(this.projectSelector + " [name='blockerIssue']").addClass("bad");
		else
			$(this.projectSelector + " [name='blockerIssue']").addClass("nice");

		if(info.criticalViolation>0)
			$(this.projectSelector + " [name='criticalIssue']").addClass("medium");
		else
			$(this.projectSelector + " [name='criticalIssue']").addClass("nice");


		Utils.modifyTrend(projectElmt, "trendTestCoverage", Math.round(info.coverageTrend*10)/10);
		Utils.modifyTrend(projectElmt, "trendDocumentationApi", Math.round(info.documentedApiTrend*10)/10);

		$(this.projectSelector + " [name='trendTestCoverageColor']").addClass(Utils.getTrendColor(info.coverageTrend));
		$(this.projectSelector + " [name='trendDocumentationApiColor']").addClass(Utils.getTrendColor(info.documentedApiTrend));

		if(!isNaN(info.coverage)) {
			$(this.projectSelector + " [name='smileyTestCoverage']").addClass(Utils.getSmiley(info.coverage,80,50));
		}
		if(!isNaN(info.coverage)) {
			$(this.projectSelector + " [name='smileyDocumentationApi']").addClass(Utils.getSmiley(info.documentedApi,30,10));
		}

		Utils.modifyChartOneValue(this.projectSelector + " [name='chartTestCoverage']", info.coverage);
		Utils.modifyChartOneValue(this.projectSelector + " [name='chartDocumentationApi']", info.documentedApi);


		if(info.lastSonarCalculation !== undefined) {
			let timeLastCalulation = Utils.diffdate(info.lastSonarCalculation, new Date());
			Utils.modifyElmt(projectElmt, "infoLabel", "/!\\ Sonar last calculation is old (generated " + timeLastCalulation + " days ago, the " + info.lastSonarCalculation.toString() + ")");
			$(this.projectSelector + " [name='infoLabel']").addClass("bad");
		}

	}

}
global["SonarInfo"]=SonarInfo;