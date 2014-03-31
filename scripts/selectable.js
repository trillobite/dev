

var mutables = {
	currSelect: undefined,
	bkgrndMngment: {
		hover: undefined,
		click: undefined,
	},
};

var tools = {
	componentToHex: function (c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    },

    //Use: rgbToHex($('#foo0')[0].style.backgroundColor.substring(4, $('#foo0')[0].style.backgroundColor.length-1).split(', '));
    rgbToHex: function (arrRGB) {
        return '#' + cmd.componentToHex(arrRGB[0]) + cmd.componentToHex(arrRGB[1]) + cmd.componentToHex(arrRGB[2]);
    },

};

var selectable = function (obj) {
	mutables.bkgrndMngment.hover = obj.hover;
	mutables.bkgrndMngment.click = obj.click;
	$('.selectbl').each(function() {
		$('#'+this.id).click(function() {
			mutables.currSelect = this.id;
			//if(this.)
		});
	});
};