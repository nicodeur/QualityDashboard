class JenkinsInfo extends GetAndFillInfo {

	constructor(globalSettings, contextData, contextModuleData) {
		super();
		this.projectSelector=contextModuleData.selector;
		this.jenkinsName=contextModuleData.module.jenkinsName;
	}

	getUrl() {
		return serverUrl + "/jenkinsinfo?project_name="+ this.jenkinsName;
	}

	isParameterSpecified() {
		return this.jenkinsName !=undefined && this.jenkinsName != '';	
	}
	
	checkPluginAvailable() {
        if(this.jenkinsName == undefined) return false;

        $(this.projectSelector + " [name='buildPanel']").show(); // show build panel
        return true;
    }

	getResult(msg) {
		return msg[0];
	}
		
	fillInfo(info) {
	    if(info.lastFailedBuild == null) {
                if(info.lastBuild != null) {
                        $(this.projectSelector + " [name='buildQuality']").text("OK");
                        $(this.projectSelector + " [name='buildQuality']").addClass("nice");
                        $(this.projectSelector + " [name='linkLastBuild']").attr("href", info.lastBuild.url);
                }
                else {
                        $(this.projectSelector + " [name='buildQuality']").text("NA");
                }
        }
        else {
                $(this.projectSelector + " [name='buildQuality']").text(info.lastBuild.number===info.lastFailedBuild.number ? "KO" : "OK");
                $(this.projectSelector + " [name='buildQuality']").addClass(info.lastBuild.number===info.lastFailedBuild.number ? "bad" : "nice");
                $(this.projectSelector + " [name='linkLastBuild']").attr("href", info.lastBuild.url);
        }

        if(info.healthReport != null) {
        	for (var i = 0; i < info.healthReport.length; i++) { 
        		var desc = info.healthReport[i].description;
        		
        		if (desc.startsWith("Test Result")) {
        			if (~desc.indexOf("out of a total of")) {
        				let arr = desc.split("out of a total of");
        				let arrNbFailed = arr[0].split("tests");
    	        		let arrNbTotal = arr[1].split("tests");
    	
    	        		let testQuality = arrNbFailed[0] + "/" + arrNbTotal[0] + " tests failed";
    	        		$(this.projectSelector + " [name='testQuality']").text(testQuality);
        			} else {
        				$(this.projectSelector + " [name='testQuality']").text(desc);
        			}
        			
        		} else if (desc.startsWith("Build stability")) {
        			if (~desc.indexOf("out of the last")) {    	        		
    	        		$(this.projectSelector + " [name='detailBuild']").text(desc.replace("out of the last", "/"));
        			} else {
        				$(this.projectSelector + " [name='detailBuild']").text(desc);
        			}
        		}
        	}
        }        
	}
	
}
global["JenkinsInfo"]=JenkinsInfo;