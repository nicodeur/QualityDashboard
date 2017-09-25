class CerberusGetLastInfo extends GetAndFillInfo {

	constructor(globalSettings, contextData, contextModuleData) {
		super();
		this.globalSettings=globalSettings;
		this.contextData=contextData;
		this.contextModuleData = contextModuleData;
	}

	getUrl() {
		return null;
	}

	getResult(msg) {
		return null;
	}

    getInfo() {
        let thisObject = this;
        if (this.contextModuleData.module.cerberusPrefixTag != null) {
            let cerberusTagInfo = new CerberusTagInfo(this.contextModuleData.module.cerberusPrefixTag, function (cerberusTags) {
                    console.log(cerberusTags);
                    let cerberusInfo = new CerberusInfo(thisObject.contextModuleData.selector, cerberusTags.lasttag);
                    cerberusInfo.getInfo();
                }
            );
            cerberusTagInfo.getInfo();
        } else {
            // hide
            $(this.contextModuleData.selector + " [name='cerberusReport']").hide();
        }
	}

    fillInfo() {
		// do nothing
    }
}

global["CerberusGetLastInfo"]=CerberusGetLastInfo;