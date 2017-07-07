class CordonBleuInfo extends GetAndFillInfo {

	constructor(teamName, beginDate, endDate, selecter) {
		super();
		this.teamName=teamName;
		this.beginDate=beginDate;
		this.endDate=endDate;
		this.selecter=selecter;
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
		console.log(this.selecter.replace("?","commitNumber"));
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