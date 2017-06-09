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
	});


	addDashboard( {
                name : "productreferences",
                codeReviewName : "productreference",
                projects : [
                        {
                                name : "productreference-service",
                                sonarName : "redoute.productreferences:productreferences-service-productreference",
                                cerberusPrefixTag : null,
                                jenkinsName : "productreferences-service-productreference-QA",
                        },
						{
                                name : "productreference-core",
                                sonarName : "redoute.productreferences:productreferences-core-productreference",
                                cerberusPrefixTag : null,
                                jenkinsName : "productreferences-core-productreference-QA",
                        },
                        {
                                name : "fileflows-core",
                                sonarName : "redoute.productreferences:productreferences-core-fileflows",
                                cerberusPrefixTag : null,
                                jenkinsName : "productreferences-core-fileflows-QA",
                        },
						                        {
                                name : "warehousecode-core",
                                sonarName : "redoute.productreferences:productreferences-core-warehousecode",
                                cerberusPrefixTag : null,
                                jenkinsName : "productreferences-core-warehousecode-QA",
                        },
                        {
                                name : "commercialscopegeneration-batch",
                                sonarName : "redoute.productreferences:productreferences-batch-commercialscopegeneration",
                                cerberusPrefixTag : null,
                                jenkinsName : "productreferences-batch-commercialscopegeneration-QA",
                        }						
                ]
        });





	
	
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
