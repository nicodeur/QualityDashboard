/**
 * Created by ndeblock on 22/09/2017.
 */
class DeploiementFiguresInfo extends GetAndFillInfo {

    constructor(globalSettings, contextData, contextModuleData) {
        super();
        this.contextData=contextData;
        this.contextModuleData=contextModuleData;

    }

    getInfo() {
        if(this.contextModuleData.module.jenkinsDeploiementPPRODName != undefined) {
            this.updateNumberOfDeploy(this.contextModuleData.module.jenkinsDeploiementPPRODName, "#PPRODDeploy");
        }
        if(this.contextModuleData.module.jenkinsDeploiementPRODName != undefined) {
            this.updateNumberOfDeploy(this.contextModuleData.module.jenkinsDeploiementPRODName, "#PRODDeploy");
        }
    }


    updateNumberOfDeploy(jenkinsJobName, idTextToModify) {
        let url = serverUrl + "/jenkinsDeployInfo?jobName="+ jenkinsJobName + "&endDate=" + this.contextData.mondayAndSunday.monday;

        let thisObject = this;

        $("#dateDeploiement").text("since " + this.contextData.mondayAndSunday.monday + " to " + " today");

        $.ajax({
            type: 'GET',
            dataType: 'jsonp',
            data: {},
            url: url+"&callback=?",
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus + " : " + errorThrown);
                console.log(jqXHR);
            },
            success: function (msg) {
                let result = msg[0];
                let actualValue = $(idTextToModify).text();
                actualValue = parseInt(actualValue);
                actualValue += parseInt(result.numberOfDeploy);
                $(idTextToModify).text(actualValue);

                $(idTextToModify + "Detail").html($(idTextToModify + "Detail").html() + " <strong>" + result.numberOfDeploy + "</strong> on " + thisObject.contextModuleData.module.name + ", ");
            }
        });
    }

}