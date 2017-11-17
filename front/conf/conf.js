// init method
exports.initProject = function()  {

	let conf = new Object();
	conf.dashboardSettings=new Array();
	
	conf.generalPluginToUse = ["CordonBleuInfo"];
    conf.modulePluginToUse = ["SonarInfo", "JenkinsInfo", "CerberusGetLastInfo", "DeploiementFiguresInfo"];

	conf.toolsUrlSettings = {
		server : { // server url of QualityReport
			 host : "localhost",
			 port : "8085"
		 },
		sonar : { // sonar is tools who generate many quality kpi
				host :"192.168.135.14",
				port :"9000",
		},
		jenkins : { // jenkins is the CI tools
			host : "192.168.134.55",
			port : "8210"
		},
		cerberus : { // cerberus is a testing tools
			host : "cerberus.siege.red",
			port : "80"
		},
		cordonBleu : { // cordon bleu is a code review tools
		    host : "192.168.134.148",
		    port : "8080",
		    database_host : "192.168.134.148",
		    database_user : "",
		    database_password : "",
		    database_name : "cordonbleu"
		}
	};

	conf.codeReviewSettings = {
			teams :
				[
					{name : "finpmt"}
				]
	}
	
	conf.dashboardSettings.push({
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
				cerberusPrefixTag : "finpmt-propose_20",
				jenkinsName : "finpmt-propose",
				jenkinsDeploiementPPRODName : "finpmt-propose-DEPLOY-UAT",
				jenkinsDeploiementPRODName : "finpmt-propose-DEPLOY-PROD",
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
				cerberusPrefixTag : "finpmt-settlement_20",
				jenkinsName : "finpmt-settlement",
				jenkinsDeploiementPPRODName : "finpmt-settlement-DEPLOY-UAT",
				jenkinsDeploiementPRODName : "finpmt-settlement-DEPLOY-PROD",
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

	conf.dashboardSettings.push({
		name : "mmk",
		codeReviewName : null,
		projects : [
			{
				name : "delivery-api",
				sonarName : "com.redoute.mmk:delivery-api-parent",
				cerberusPrefixTag : "delivery-mmk-api_CI",
				jenkinsName : "finpmt-propose",
			}
		]
	});

	conf.dashboardSettings.push({
		name : "XTPI",
		codeReviewName : null,
		projects : [
			 {					
				name : "marketplace-ihm",
				sonarName : "com.redoute.partner:marketplace-ihm",
				cerberusPrefixTag : "marketplace-ihm_CI",
				jenkinsName : "marketplace-ihm", 
			},
			{
				name : "partner-ref",
				sonarName : "com.redoute.partner.ref:partner-ref",
				cerberusPrefixTag : null,
				jenkinsName : "partner-ref", 
			}, {
				name : "supplier-import",
				sonarName : "com.redoute:supplier-import",
				cerberusPrefixTag : null,
				jenkinsName : "supplier-import",  
			}
		]
	});


	conf.dashboardSettings.push({
		name : "XTPI - OrganisationV2",
		codeReviewName : null,
		projects : [
			{
				name : "marketplace-ihm_organisationV2",
				sonarName : "com.redoute.partner:marketplace-ihm",
				cerberusPrefixTag : "marketplace-ihm_CI",
				jenkinsName : "BRANCHES/job/marketplace-ihm", 
			}, {
			
				name : "partner-ref_organisationV2",
				sonarName : "com.redoute.partner.ref:partner-ref",
				cerberusPrefixTag : "partner-ref_CI",
				jenkinsName : "BRANCHES/job/partner-ref", 
			}, {
				name : "supplier-import_organisationV2",
				sonarName : "com.redoute:supplier-import",
				cerberusPrefixTag : null,
				jenkinsName : "BRANCHES/job/supplier-import",  
			}
		]
	});

	conf.dashboardSettings.push({
        name : "productreferences",
        codeReviewName : null,
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
