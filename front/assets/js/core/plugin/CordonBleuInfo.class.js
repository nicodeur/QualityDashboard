class CordonBleuInfo extends GetAndFillInfo {

	constructor(globalSettings, contextData, selector, teamName) {
		super();
        this.selecter=selector;//contextModuleData.selector;
        this.beginDate=contextData.mondayAndSunday.mondayCodeReview;
        this.endDate=contextData.mondayAndSunday.sundayCodeReview;
        if(contextData.teamDashboardSettings != null) {
            this.teamName = contextData.teamDashboardSettings.codeReviewName;
        }
        else {
            this.teamName = teamName.toLowerCase();
		}

    }

    checkPluginAvailable() {
        if(this.teamName == undefined) return false;

        $('#codeReviewPanel').show(); // show build panel$
        $('#codeReviewDatePanel').show(); // show build panel

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

	formatDate(myDate) {
		var unformattedDate = new Date(myDate);
		var d = unformattedDate.getDate();
		var m =  unformattedDate.getMonth();
		var y = unformattedDate.getFullYear();

		var formattedDate = d + "/" + m + "/" + y;

		return formattedDate;
	}
	
	fillInfo(info) {
        let templateCodeReview = $("#templateCodeReview").clone();
        templateCodeReview.find("div:first").attr("id", "codereview-" + info.team.toLowerCase());
        templateCodeReview.find("div:first").css("padding-bottom","20px");
        
        $("#codeReviewContent").append(templateCodeReview.html());
        
        if(this.selecter == undefined) {
			this.selecter = "#?";
		}
		
		$("#dateLegendCodeReview").text("Between " + Utils.formatDate(this.beginDate) + " and " + Utils.formatDate(this.endDate));

		$(this.selecter.replace("?","commitNumber")).text(info.nbCommitThisWeek);
		$(this.selecter.replace("?","approveCommitNumber")).text(info.nbCommitApprove);
		$(this.selecter.replace("?","commentCommitNumber")).text(info.nbCommitComment);
		$(this.selecter.replace("?","reviewCommitNumber")).text(info.nbCommitThisWeek-info.nbCommitWithoutReview);

        Utils.modifyChartOneValue(this.selecter.replace("?","chartCodeReview"), info.ratioCommitReview);
		$(this.selecter.replace("?","smileyCodeReview")).addClass(Utils.getSmiley(info.ratioCommitReview, 100,50));
        $(this.selecter.replace("?","seemore")).attr("href",codeReviewUrl+"/team/" + info.team);
        $(this.selecter.replace("?","name")).text(info.team);
	}

}
global["CordonBleuInfo"]=CordonBleuInfo;