class Utils {
	static setInputDate(elmt, date) {
		let now = date;

		let day = ("0" + now.getDate()).slice(-2);

		let monthNumber = now.getMonth() + 1;
		let month = (monthNumber<10 ? "0":"") + monthNumber;

		let today = now.getFullYear()+"-"+(month)+"-"+(day) ;

		$(elmt).val(today);
	}

	static formatDate(date) {
		let now = date;

		let day = ("0" + now.getDate()).slice(-2);

		let monthNumber = now.getMonth() + 1;
		let month = (monthNumber<10 ? "0":"") + monthNumber;

		let today = (day) + "/" + (month) + "/" + now.getFullYear();

		return today;
	}

	static findGetParameter(parameterName) {
		var result = null,
			tmp = [];
		location.search
		.substr(1)
			.split("&")
			.forEach(function (item) {
			tmp = item.split("=");
			if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
		});
		return result;
	}

	static getLastMondayAndSunday() {
		let beginDateStr = Utils.findGetParameter("beginDate");
		let endDateStr = Utils.findGetParameter("endDate");
		let beginDateCodeReviewStr=Utils.findGetParameter("beginDateCodeReview");
		let endDateCodeReviewStr=Utils.findGetParameter("endDateCodeReview");

		let monday;
		let sunday;
		let mondayCodeReview;
		let sundayCodeReview;

		if(beginDateStr != null && endDateStr!=null) {
			monday = new Date(beginDateStr);
			sunday = new Date(endDateStr);
		} else {
			monday = Utils.getLastMonday();

			// create new date of day before
			sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
		}

		if(beginDateCodeReviewStr != null && endDateCodeReviewStr!=null) {
			mondayCodeReview = new Date(beginDateCodeReviewStr);
			sundayCodeReview = new Date(endDateCodeReviewStr);
		} else {
			mondayCodeReview= new Date(monday.getTime());
			mondayCodeReview.setDate(mondayCodeReview.getDate()- 7);
			sundayCodeReview= new Date(mondayCodeReview.getFullYear(), mondayCodeReview.getMonth(), mondayCodeReview.getDate() + 6);
		}

		let res = new Object();
		res.monday = monday;
		res.sunday = sunday;
		res.mondayCodeReview = mondayCodeReview;
		res.sundayCodeReview = sundayCodeReview;

		return res;
	}


	static getLastMonday() {
	  let d = new Date();
	  var day = d.getDay(),
		  diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
		  diff = diff - 7;
		let monday = new Date(d.setDate(diff));

	  return monday;
	}


	static diffdate(d1,d2){
		var WNbJours = d2.getTime() - d1.getTime();
		return Math.ceil(WNbJours/(1000*60*60*24));
	}

	static getSmiley(figure, levelMedium,levelBad) {

		if(figure < levelBad) {
			return "fa-frown-o";
		} else if(figure < levelMedium) {
			return "fa-meh-o";
		} else {
			return "fa-smile-o";
		}

	}
	static getTrendColor(trend) {
		if(isNaN(trend)) {
			return "medium";
		}else if(trend < -5) {
			return "bad";
		} else if(trend < 0) {
			return "medium";
		} else {
			return "nice";
		}

	}




	static modifyTrend(projectElmt, attribut, trend) {
		if(isNaN(trend)) {
			projectElmt.find("[name='" + attribut + "']").first().text("No data");
		} else {
			projectElmt.find("[name='" + attribut + "']").first().text((trend >= 0 ? "+":"") + trend);
		}
	}

	static modifyElmt(projectElmt, attribut, text) {
		projectElmt.find("[name='" + attribut + "']").first().text(text);
	}

	static modifyChartOneValue(elmt, value) {
        if(isNaN(value) || value == null) {
            Chartist.Pie(elmt, {
                labels: ['No Data',' '],
                series: [0,100]
            });
        } else {
            Chartist.Pie(elmt, {
                labels: [value + '%', ' '],
                series: [value, 100 - value]
            });
        }
	}
	
}
