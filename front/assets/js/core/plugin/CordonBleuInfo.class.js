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
		if(this.selecter == undefined) {
			this.selecter = "#?";
		}
		
		$("#dateLegendCodeReview").text("Between " + this.beginDate.toString() + " and " + this.endDate.toString());


		let result = info.projects[0];

		Utils.modifyChartOneValue(this.selecter.replace("?","chartCodeReview"), result.ratioCommitReview);		
		
		$(this.selecter.replace("?","commitNumber")).text(result.commitNumber);
		$(this.selecter.replace("?","approveCommitNumber")).text(result.approveCommitNumber);
		$(this.selecter.replace("?","commentCommitNumber")).text(result.commentCommitNumber);
		$(this.selecter.replace("?","reviewCommitNumber")).text(result.commitNumber-result.notReviewCommitNumber);	

		$(this.selecter.replace("?","smileyCodeReview")).addClass(Utils.getSmiley(result.ratioCommitReview, 100,50));
	}

}