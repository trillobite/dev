var csvData;

var projFuncs = {
	findColumn: function(input) {
		function tst() { //returns an array that describes each column type.
			var selections = [];
			for(var i = 0; i < $('#selectionRow')[0].children.length; ++i) {
		  		var txt = $('#selectionRow')[0].children[i].value;
		    	if(txt !== undefined && txt != 'Select Column Type') {
		      		selections[selections.length] = txt;
		    	}
		  	}
		  	return selections;
		}
		var retIndx = -1;
		$.each(tst(), function(indx, obj) {
			if(obj == input) {
				retIndx = indx;
			}
		});
		return retIndx;
	},
	convertTime: function(input) {
		var checkTime = function(input) {
		    var badChars = ['b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'n', 'o', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '/', '?'];
		    for(var i = 0; i < badChars.length; ++i) {
		        if(input.indexOf(badChars[i]) > 0) {
		            return false;
		        }
		    }
		    return true;
		}
		if(checkTime(input)) {
			return cmd.time.parse(input);
		}
		return false;
	},
	convertTimeCells: function(column) {
		$('[name*="'+column+'"]').each(function() {
			if(projFuncs.convertTime(this.value) && this.value !== "") {
				this.value = projFuncs.convertTime(this.value).toLocaleTimeString();
				this.style['color'] = 'black';
			} else {
				//this.style['background-color'] = 'red';
				this.style['color'] = 'red';
			}
		})
	},
	readFile: function(file, startByte, endByte) {
		var dfd = new $.Deferred();
		var reader = new FileReader();
		reader.onloadend = function(evt) {
			if(evt.target.readyState == FileReader.DONE) {
				dfd.resolve(evt.target); //resulting object is put into the resolve.
			}
		}
		var blob = file.slice((parseInt(startByte) || 0), (parseInt(endByte) || file.size + 1) + 1);
		reader.readAsText(blob, 'UTF-8');
		return dfd.promise();
	},
	dropDown: function(tmpId) {
		function makeOption(input) {
			return $jConstruct('option', {
				text: input,
				value: input,
			});
		}
		return $jConstruct('select', {
			id: tmpId,
			title: 'Select row type',
		})
		.addChild(makeOption('Select Column Type'))
		.addChild(makeOption('time'))
		.addChild(makeOption('name'))
		.addChild(makeOption('division'))
		.addChild(makeOption('coach'))
		.addChild(makeOption('number of cameras'))
		.addChild(makeOption('group code'))
		.addChild(makeOption('num participants'))
		.addChild(makeOption('Note'))
		.event('change', function() {
			//console.log('triggered');
			if($('#'+this.id)[0].value == 'time') {
				var i = projFuncs.findColumn('time');
				console.log(i);
				if(i != -1) {
					projFuncs.convertTimeCells('column'+i);
				}
			} else {
				console.log($('#'+this.id)[0].value);
			}
		});
	},
	createGrid: function(arrData) {
		var grid = $jConstruct('div');
		var j = -1;
		$.each(arrData, function() {
			var obj = $jConstruct('div'); //row
			var i = -1;
			$.each(this, function() {
				var tb = $jConstruct('textbox', { //text box
					text: this,
					name: 'column' + (++i),
				}).addFunction(function() {
					//id, dbVal, defVal, updateFunc
					toolKit().tgglTxtBx(tb.id, tb.text, tb.text, function(id) {
						console.log(id);
						var name = $('#'+id).attr('name');
						var column = parseInt(name.substring(6, name.length));

						var row = function() {
							var pos = undefined;
							$("[name*='"+name+"']").each(function(indx, obj) {
							    if($('#'+id)[0] == obj) {
							        pos = indx;
							    }
							});	
							return pos;					
						};

						csvData[row()][column] = $('#'+id)[0].value;
						//$('#'+id).css('color', 'black'); //return the color from red back to black to show that it has updated.
					});
				}).event('click', function() {
					console.log(this.name);
				});
				obj.addChild(tb); 
			});
			var cb = ($jConstruct('div', { //close button
				id: 'closeBtnHotSauce' + (++j),
				class: 'closeBtn',
				name: j.toString(),
				title: 'Remove row',
				text: 'X',
			}).css({
				'cursor': 'pointer',
				'color': 'red',
				'width': '20px',
				'border': '1px solid black',
				'float': 'right',
			})).event('click', function() {
				obj.remove();
				csvData.splice(parseInt($(this).attr('name')), 1);
				var l = -1;
				$(".closeBtn").each(function() {
					$(this).attr('name', (++l).toString()); //change the number in the html attribute so that it is correct.
				});
			});
			obj.addChild(cb);
			grid.addChild(obj);
						
		});

		return grid;
	},
	draw: function(droppableBox) {
		var grid = projFuncs.createGrid(csvData);
		$('#container').remove();
		var ch = $jConstruct('div', {
			id: 'selectionRow',
		}).css({ //row
			'text-align': 'left',
		});
		for(var i = 0; i < csvData[0].length; ++i) {
			var tmp = new projFuncs.dropDown('typeSelect' + i); //cell
			tmp.css({
				'width': ((100 / csvData[0].length) - (((100 / csvData[0].length) / 100) * (20 / csvData[0].length))).toString() + '%', //set proper cell size.
				'margin-left': '2px',
			}).event('change', function() {
				var num = (parseInt(this.id.substring(this.id.indexOf('typeSelect') + 10, this.id.length))).toString();
				$("[name*='column" + num + "']").css({ //if selection made, change all column cells green.
					'background-color': (function() {
						if($('#typeSelect'+num)[0].value == 'Select Column Type') {
							return 'white';
						} else {
							return '#C7E18D';
						}
					})(),
					//'color': '#B0B0B0',
				});
			});
			ch.addChild(tmp);
		}
		ch.addChild($jConstruct('div').css({ //helps with alignment, this is a filter since all other rows have a close button.
			'width': '25px',
			'float': 'right',
		}));

		droppableBox.children = grid.children;
		//droppableBox.functions = grid.functions;
		$.each(grid.functions, function() {
			droppableBox.addFunction(this);
		});
		droppableBox.refresh().state.done(function(response) {
			if(response) {
				console.log(response);
			}
			ch.appendTo('#'+droppableBox.id, 'prepend');
		});
	},

}

function csvSubmitFormAppendTo(container) {
	var main = $jConstruct('div').css({
		'text-align': 'center',
		'width': '100%',
		'height': '100%',
	});

	var drpZone = $jConstruct('div', {
		id: 'drop_zone',
	}).css({
		'background-color': '#C4C4C4',
		'font-family': 'Sans-serif',
		'margin': '0 auto',
		//'border': '1px solid black',
		'border-radius': '3px',
		'display': 'inline-block',
		'overflow': 'hidden',
		/*'width': '300px',
		'height': '200px',*/
		
	}).addChild($jConstruct('div', {
		id: 'container',
		text: 'Drag and drop your CSV file here.',
	}).css({
		'text-align': 'center',
		'width': '300px',
		'height': '300px',
	})).event('filedrop', {
		maxfiles: 1,
		maxfilesize: 5,
		beforeSend: function(f) {
			projFuncs.readFile(f).done(function(obj) {
				csvData = $.csv.toArrays(obj.result);
				projFuncs.draw(drpZone); //just refresh this object with the grid in it.
			});
		}
	});
	main.addChild(drpZone);
	main.appendTo(container);

	var submitProcess = function(json) {
		console.log(json);
		var dfd = new $.Deferred();
        function getText(value, defVal) {
            return value !== defVal ? value : "";
        }
        //generate the proper json object to send to the create function.
        var strJson = dataObjs.templates.schedule();
        strJson.blnOnlineFilledAllowed = false;
        strJson.strGroupName = json.name ? json.name : "";
        strJson.strGroupInstructor = json.coach ? json.coach : "";
        strJson.strOrganizationEventGroupCode = json['group code'] ? json['group code'] : "";
        strJson.strGroupDivision = json.division ? json.division : "";
        strJson.intScheduleOverRideNumPaticipants = parseInt(json['num participants']) ? json['num participants'] : 0;
        strJson.strNotes = json.note ? json.Note : "";
        if(json.time !== "") {
            strJson.dtDateTime = cmd.time.IEremoveISOTimeZone($dt.parse(json.time), false).toISOString();
            console.log( json.time, strJson.dtDateTime);
        }
        $project.create('scheduleItem')(strJson).done(function() { //make the new schedule item (aka time).
            cmd.events.checkStatus(0, true).done(function() {
                dfd.resolve();
            });
            //$.colorbox.close(); //close the color box.
        });
        return dfd.promise();
	}

	var btnSubmit = $jConstruct('button', {
		text: 'Submit',
	}).event('click', function() {
		function stuff() {
		  var arrObj = [];
		  $.each($('#drop_zone').children(), function(indx0, val0) {
		    arrObj[indx0] = [];
		    $.each(val0.children, function(indx, val) {
		      //console.log(val.style.backgroundColor == "");
		      if(val.style.backgroundColor !== "") {
		        arrObj[indx0][indx] = val.value;
		        //console.log(val.value);
		      }
		    });
		  });
		  return arrObj;
		}
		//ALL I HAVE TO DO IS IMPLEMENT THE SUBMIT SCHEDULE DATA HANDLER.
		function tst() { //returns an array that describes each column type.
			var selections = [];
			for(var i = 0; i < $('#selectionRow')[0].children.length; ++i) {
		  		var txt = $('#selectionRow')[0].children[i].value;
		    	if(txt !== undefined && txt != 'Select Column Type') {
		      		selections[selections.length] = txt;
		    	}
		  	}
		  	return selections;
		}

		var columns = tst();
		var rawData = stuff();
		var json = {};
		var indx = 1;
		console.log(rawData);
		var submitData = function() {
			if(rawData[indx]) {
				$.each(columns, function(indx1, currColumn) {
					console.log('data:', rawData[indx], rawData[indx][indx1]);
					json[currColumn] = rawData[indx][indx1];
				});
			}
			indx++;
			console.log('pushing to db', json);
			submitProcess(json).done(function() {
				if(rawData[indx] && indx < 128) { //stop the loop
					submitData();
					$('#closeBtnHotSauce'+(indx - 2).toString()).css({
						'background-color': 'green',
					});
				}
			});
		}
		submitData();
		/*$.each(rawData, function(indx, dataObj) {
			$.each(columns, function(indx1, currColumn) {
				json[currColumn] = dataObj[indx1];
			})
			submitProcess(json);
		});*/
	});

	var btnCancel = $jConstruct('button', {
		text: 'Cancel',
	}).event('click', function() {
		$.colorbox.close();
	});

	var btnContainer = $jConstruct('div').addChild(btnSubmit).addChild(btnCancel).css({
		'display': 'inline-block',
		'margin': '0 auto',
	});

	$jConstruct('div').addChild(btnContainer).css({
		'text-align': 'center',
	}).appendTo(container);
}
