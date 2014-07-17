

var $time = function(input) {
	input = input.toUpperCase(); //make sure what is input is all in a good format.
	return (function() {
		var time = {
			hour: 12,
			min: 0,
			sec: 0,
			timeDay: 'AM',
			toShortHand: parsers.toShortHand(input),
			toISOString: parsers.toISOString(input),
			toString: function(arg) {
				//if there is no data, return current time.
			}
		};

		var shortHand = {
			one: function(arg) {

			},
			two: function(arg) {

			},
			three: function(arg) {

			}, 
			four: function(arg) {

			},
		};

		var parsers = {
			getTimeDay: function(arg) {
				return arg.substring(arg.indexOf('M') - 1, arg.indexOf('M') + 1);
			},
			toShortHand: function(arg) {
	            arg = arg.replace(':', ''); //just remove the colon, and operate as if none ever existed.
	            if(arg.indexOf('M') >= 0) {
	            	if(arg.indexOf(':') >= 0) {

	            		arg = arg.substring(0, arg.indexOf(':')); //if seconds is included, destroy it.
	            	}
	            	arg += parsers.getTimeDay(arg);
	            }
				return arg;	
			},
		};

		return time;
	})();
};

