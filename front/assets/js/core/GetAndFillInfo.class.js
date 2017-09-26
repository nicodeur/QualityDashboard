
/**
 * Abstract class
 */
class GetAndFillInfo {
	getInfo() {

		if(!this.checkPluginAvailable()) return; // if plugin is not available, do nothing!

		let url = this.getUrl();

		let thisObject = this;

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
				let result = thisObject.getResult(msg);
				thisObject.fillInfo(result);
			}
		});
	}

	fillInfo(info) {
		throw new TypeError("fillInfo must be override by child class");
	}

	getUrl() {
		throw new TypeError("fillInfo must be override by child class");
	}

	getResult(msg) {
		throw new TypeError("fillInfo must be override by child class");
	}

    /**
	 * Allow to know if plugin mut be display or nots
     * @returns {boolean}
     */
    checkPluginAvailable() {
		return true;
	}

	hidePanel(msg) {
		//throw new TypeError("fillInfo must be override by child class");
	}
}
