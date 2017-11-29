class CerberusInfo extends GetAndFillInfo {

	constructor(projectSelector, cerberusTag) {
		super();
		this.projectSelector=projectSelector;
		this.cerberusTag=cerberusTag;
        CerberusInfo.cerberusInfoLst = new Array();
	}

	getUrl() {
		return serverUrl + "/cerberusinfo?tag="+ this.cerberusTag;
	}

	isParameterSpecified() {
		return this.cerberusTag !=undefined && this.cerberusTag != '';	
	}
	

	getResult(msg) {
		let response = msg[0];

		let cerberusInfo = new Object();

		cerberusInfo.executionStart = response.ExecutionStart;
		cerberusInfo.executionEnd = response.ExecutionEnd;
		cerberusInfo.status_PE_nbOfExecution = response.status_PE_nbOfExecution;
		cerberusInfo.status_NA_nbOfExecution = response.status_NA_nbOfExecution;
		cerberusInfo.status_NE_nbOfExecution = response.status_NE_nbOfExecution;
		cerberusInfo.status_FA_nbOfExecution = response.status_FA_nbOfExecution;
		cerberusInfo.status_OK_nbOfExecution = response.status_OK_nbOfExecution;
		cerberusInfo.status_CA_nbOfExecution = response.status_CA_nbOfExecution;
		cerberusInfo.status_KO_nbOfExecution = response.status_KO_nbOfExecution;
        cerberusInfo.status_QU_nbOfExecution = response.status_QU_nbOfExecution;
		cerberusInfo.urlReport = cerberusUrl + "/ReportingExecutionByTag.jsp?Tag="+this.cerberusTag;

        CerberusInfo.cerberusInfoLst.push(cerberusInfo);

		return cerberusInfo;
	}

	fillInfo(cerberusInfo) {
		this.fillInfoWithSelector(this.projectSelector, cerberusInfo);
		this.majGeneralCerberusInfo();
	}

	fillInfoWithSelector(projectSelector, cerberusInfo) {

		Chartist.Pie(projectSelector + " [name='chartCerberusResultLastExecution']", {
			labels: [this.displayCerberusStatus(projectSelector, cerberusInfo.status_NA_nbOfExecution, "NA"),
				this.displayCerberusStatus(projectSelector, cerberusInfo.status_CA_nbOfExecution, "CA"),
				this.displayCerberusStatus(projectSelector, cerberusInfo.status_KO_nbOfExecution, "KO"),
				this.displayCerberusStatus(projectSelector, cerberusInfo.status_FA_nbOfExecution, "FA"),
				this.displayCerberusStatus(projectSelector, cerberusInfo.status_OK_nbOfExecution, "OK"),
				this.displayCerberusStatus(projectSelector, cerberusInfo.status_PE_nbOfExecution, "PE"),
				this.displayCerberusStatus(projectSelector, cerberusInfo.status_NE_nbOfExecution, "NE"),
            	this.displayCerberusStatus(projectSelector, cerberusInfo.status_QU_nbOfExecution, "QU")],
			series: [cerberusInfo.status_NA_nbOfExecution,
				cerberusInfo.status_CA_nbOfExecution,
				cerberusInfo.status_KO_nbOfExecution,
				cerberusInfo.status_FA_nbOfExecution,
				cerberusInfo.status_OK_nbOfExecution,
				cerberusInfo.status_PE_nbOfExecution,
				cerberusInfo.status_NE_nbOfExecution,
                cerberusInfo.status_QU_nbOfExecution]
			}
		);
		let startDate = new Date(cerberusInfo.executionStart);
		let endDate = new Date(cerberusInfo.executionEnd);
		let diff = endDate - startDate;

		$(projectSelector + " [name='campaignExecution']").text("Exectuted in " +  diff/1000 + "." + diff%1000 + " s" + " on " + cerberusInfo.executionStart);
		$(projectSelector + " [name='urlReportCerberus']").attr("href", cerberusInfo.urlReport);

	}


	majGeneralCerberusInfo() {

		let cerberusInfo = new Object();
		cerberusInfo.status_PE_nbOfExecution = 0;
		cerberusInfo.status_NA_nbOfExecution = 0;
		cerberusInfo.status_NE_nbOfExecution = 0;
		cerberusInfo.status_FA_nbOfExecution = 0;
		cerberusInfo.status_OK_nbOfExecution = 0;
		cerberusInfo.status_CA_nbOfExecution = 0;
		cerberusInfo.status_KO_nbOfExecution = 0;
        cerberusInfo.status_QU_nbOfExecution = 0;
		cerberusInfo.urlReport = "";



        CerberusInfo.cerberusInfoLst.forEach(function(data) {
			cerberusInfo.executionStart = data.executionStart;
			cerberusInfo.executionEnd = data.executionEnd;
			cerberusInfo.status_PE_nbOfExecution += data.status_PE_nbOfExecution;
			cerberusInfo.status_NA_nbOfExecution += data.status_NA_nbOfExecution;
			cerberusInfo.status_NE_nbOfExecution += data.status_NE_nbOfExecution;
			cerberusInfo.status_FA_nbOfExecution += data.status_FA_nbOfExecution;
			cerberusInfo.status_OK_nbOfExecution += data.status_OK_nbOfExecution;
			cerberusInfo.status_CA_nbOfExecution += data.status_CA_nbOfExecution;
			cerberusInfo.status_KO_nbOfExecution += data.status_KO_nbOfExecution;
            cerberusInfo.status_QU_nbOfExecution += data.status_QU_nbOfExecution;
		});

		this.fillInfoWithSelector("#reportCerberusGeneral",cerberusInfo);
		$("#reportCerberusGeneral").show();
	}

	displayCerberusStatus(projectSelector,status, title) {
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
}
global["CerberusInfo"]=CerberusInfo;