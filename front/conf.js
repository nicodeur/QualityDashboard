// init method
function initProject() {

	let conf = new Object();
	conf.dashboardSettings=new Array();

	conf.toolsUrlSettings = {
		serverUrl : "http://192.168.134.148:8085",
		sonarUrl : "http://192.168.135.14:9000",
		jenkinsUrl : "",
		cerberusUrl : "",
		codeReviewUrl : "http://192.168.134.148:8080"
	};

	conf.codeReviewSettings = {
			teams :
				[
					{name : "finpmt"},
					{name : "mmk"},
					{name : "selecteur"},
					{name : "xtpi"}
				]
	};


	conf.dashboardSettings.push(
		{
			name : "finpmt",
			codeReviewName : "finpmt",
			responsible : {
				name : "DUPIRE Veronique",
				email : "vdupire@redoute.fr"
			},
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

	conf.dashboardSettings.push(
		{
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

	conf.dashboardSettings.push(
		{
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

			return conf;

}
