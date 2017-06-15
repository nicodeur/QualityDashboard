class JenkinsInfo extends GetAndFillInfo {

	constructor(projectSelector, jenkinsName) {
		super();
		this.projectSelector=projectSelector;
		this.jenkinsName=jenkinsName;
	}

	getUrl() {
		return serverUrl + "/jenkinsinfo?project_name="+ this.jenkinsName;
	}

	getResult(msg) {
		return msg[0];
	}
		
	fillInfo(info) {

		$(this.projectSelector + " [name='buildQuality']").text(info.healthReport[1].score<100 ? "KO" : "OK");
		$(this.projectSelector + " [name='buildQuality']").addClass(info.healthReport[1].score<100 ? "bad" : "nice");
		$(this.projectSelector + " [name='detailBuild']").text(info.healthReport[1].description);
		$(this.projectSelector + " [name='testQuality']").text(info.healthReport[0].description);	
		$(this.projectSelector + " [name='linkLastBuild']").attr("href", info.lastBuild.url);
				
	}

}