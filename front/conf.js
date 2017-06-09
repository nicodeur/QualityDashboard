// init method
function initProject() {

	setToolsUrl( {
		serverUrl : "",
		sonarUrl : "",
		jenkinsUrl : "",
		cerberusUrl : ""
	});

	addDashboard( {
		name : "finpmt",
		codeReviewName : "finpmt",
		projects : [
			{
				name : "finpmt-propose",
				sonarName : "redoute.finpmt:finpmt-proposal-parent",
				cerberusPrefixTag : "Jenkins-20",
				jenkinsName : "finpmt-propose",							
			},
			{
				name : "finpmt-core",
				sonarName : "redoute.finpmt:finpmt-core-parent",
				cerberusPrefixTag : null,
				jenkinsName : "finpmt-core",				
			},
			{
				name : "finpmt-settlement",
				sonarName : "redoute.finpmt:finpmt-settlement-parent",
				cerberusPrefixTag : null,
				jenkinsName : "finpmt-settlement",				
			},
			{
				name : "finpmt-parameter",
				sonarName : "redoute.finpmt:finpmt-parameter-parent",
				cerberusPrefixTag : null,
				jenkinsName : "finpmt-parameter",				
			},
			{
				name : "ruleengine",
				sonarName : "redoute.common.core:ruleengine",
				cerberusPrefixTag : null,
				jenkinsName : "redoute-common-core-ruleengine",				
			}			
		]		
	});
	
	addDashboard( {
		name : "mmk",
		codeReviewName : "mmk",
		projects : [
			{
				name : "delivery-api",
				sonarName : "com.redoute.mmk:delivery-api-parent",
				cerberusPrefixTag : "delivery-mmk-api_CI",
				jenkinsName : "finpmt-propose",				
			}				
		]		
	})
	
	
	/*
	addProject("delivery-api", 
		"com.redoute.mmk:delivery-api-parent", 
		"delivery-mmk-api_CI_201705241653",
		"finpmt-propose",monday,sunday, "delivery-mmk-api_CI");
		
	addProject("finpmt-core", 
		"redoute.finpmt:finpmt-core-parent", 
		"Jenkins-20170531165054017",
		"finpmt-core",monday,sunday, "Jenkins-20");
		
	*/

}