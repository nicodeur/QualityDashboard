class CordonBleuInfo extends GetAndFillInfo {

	constructor(globalSettings, contextData, selector, teamName) {
		super();
        this.selecter=selector;//contextModuleData.selector;
        this.beginDate=contextData.mondayAndSunday.monday;
        this.endDate=contextData.mondayAndSunday.sunday;
        if(contextData.teamDashboardSettings != null) {
            this.teamName = contextData.teamDashboardSettings.codeReviewName;
        }
        else {
            this.teamName = teamName.toLowerCase();
		}

    }

    checkPluginAvailable() {
        if(this.teamName == undefined) return false;

        $('#codeReviewPanel').show(); // show build panel
        return true;
    }

	getUrl() {
		return serverUrl + "/codeReviewStats?teamName="+ this.teamName 
		+ "&beginDate=" + this.beginDate.toString()
		+ "&endDate=" + this.endDate.toString();
	
	}


	getResult(msg) {
		return msg[0];
	}

		
	fillInfo(info) {
        let result = info[0];

        let templateCodeReview = $("#templateCodeReview").clone();
        templateCodeReview.find("div:first").attr("id", "codereview-" + result.team.toLowerCase());

        $("#codeReviewContent").append(templateCodeReview.html());

        if(this.selecter == undefined) {
			this.selecter = "#?";
		}

		$("#dateLegendCodeReview").text("Between " + this.beginDate.toString() + " and " + this.endDate.toString());

		$(this.selecter.replace("?","commitNumber")).text(result.nbCommitThisWeek);
		$(this.selecter.replace("?","approveCommitNumber")).text(result.nbCommitApprove);
		$(this.selecter.replace("?","commentCommitNumber")).text(result.nbCommitComment);
		$(this.selecter.replace("?","reviewCommitNumber")).text(result.nbCommitThisWeek-result.nbCommitWithoutReview);

        Utils.modifyChartOneValue(this.selecter.replace("?","chartCodeReview"), result.ratioCommitReview);
		$(this.selecter.replace("?","smileyCodeReview")).addClass(Utils.getSmiley(result.ratioCommitReview, 100,50));
        $(this.selecter.replace("?","seemore")).attr("href",codeReviewUrl+"/team/" + result.team);
        $(this.selecter.replace("?","name")).text(result.team);
	}

}
global["CordonBleuInfo"]=CordonBleuInfo;