/*Last Updated: 09/11/2014 @9:04AM*/

var csvData;

var projFuncs = {
	findColumn: function(input) {
		function tst() { //returns an array that describes each column type.
			var selections = [];
			for(var i = 0; i < $('#selectionRow')[0].children.length; ++i) {
		  		var txt = $('#selectionRow')[0].children[i].value;
		      	selections[selections.length] = txt;
		  	}
		  	return selections;
		}
		console.log(tst());
		var retIndx = -1;
		$.each(tst(), function(indx, obj) {
			console.log(indx, obj);
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
		var options = [
			'Select Column Type',
			'time',
			'name',
			'division',
			'coach',
			'number of cameras',
			'num participants',
			'note',
		];

		//checks if input option is valid
		function getOption(str) {
			str = str.toLowerCase();
			if(str.substring(str.length - 1, str.length) == ' ') {
				str = str.substring(0, str.length - 1);
			}

			var retVal;
			$(options).each(function() {
				if(str.toString() == this.toString()) {
					console.log(str.toString(), this.toString());
					retVal = this.toString();
				}
			});
			if(retVal) {
				return retVal;
			}
			return false;
		}

		function makeOption(input) {
			return $jConstruct('option', {
				text: input,
				value: input,
			});
		}

		var selection = $jConstruct('select', {
			id: tmpId,
			title: 'Select row type',
		}).event('change', function() {
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

		$(options).each(function() {
			selection.addChild(makeOption(this));
		});

		selection.select = function(str) {
			if(getOption(str)) {
				console.log('id:', tmpId);
				
				var type = cmd.detectBrowser();
		        type = type.substring(0, type.indexOf(' '));
		        
		        if(type != 'IE') {
		        	$('#'+tmpId)[0].value = getOption(str);
		        } else {
		        	$('#'+tmpId).val(getOption(str));
		        }

				return true;
			}
			return false;
		};

		return selection;
	},
	createGrid: function(arrData) {
		var grid = $jConstruct('div');
		var j = -1;
		var row = -1;
		var rowsRemoved = 0;
		var columnsRemoved = 0;

		$.each(arrData, function() { //for every row...
			var obj = $jConstruct('div', {
				row: (++row).toString(), //show which row it is
			}); //row
			var i = -1;
			$.each(this, function() { //for every column...
				var tb = $jConstruct('textbox', { //text box
					text: this,
					column: (++i).toString(), //show which column it is.
					name: 'column' + i.toString(),
				}).css({
					'width': ((100 / csvData[0].length) - (((100 / csvData[0].length) / 100) * (50 / csvData[0].length))).toString() + '%', //set proper cell size.
				}).addFunction(function() {
					//id, dbVal, defVal, updateFunc
					toolKit().tgglTxtBx(tb.id, tb.text, tb.text);
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
				rowsRemoved++;
			});
			obj.addChild(cb);
			grid.addChild(obj);


			grid.getRow = function(index) {
				var rowIndex = parseInt(index) + rowsRemoved;
				return $("[row='" + rowIndex + "']");
			};
			grid.getColumn = function(index) {
				var columnIndex = parseInt(index) + columnsRemoved;
				return $("[name='column" + columnIndex + "']");
			};		
			grid.removeRow = function(index) {
				var dfd = new $.Deferred();
				var rowIndex = parseInt(index) + rowsRemoved;
				var removal = function() {
					$("[row='" + rowIndex + "']").each(function() {
						$('#'+this.id).remove();
						//this.remove();
						rowsRemoved++;
					});
					dfd.resolve();
				};
				removal();
				return dfd.promise();
			};	
			grid.removeColumn = function(index) {
				var dfd = new $.Deferred();
				var columnIndex = parseInt(index) + columnsRemoved;
				var removal = function() {
					$("[name='column" + columnIndex + "']").each(function() {
						$('#'+this.id).remove();
						//this.remove();
					});
					columnsRemoved++;
					dfd.resolve();
				};
				removal();
				return dfd.promise();
			}
		});
		
		return grid;
	},
	draw: function(droppableBox) {
		var grid = projFuncs.createGrid(csvData);

		$('#container').remove();

		var ch = $jConstruct('div', {
			id: 'selectionRow',
		}).css({ //row
			'width': '100%',
			'margin-left': ((100 / csvData[0].length) - csvData[0].length).toString() + 'px',
		});

		var tmpArr = [];

		for(var i = 0; i < csvData[0].length; ++i) {
			var tmp = new projFuncs.dropDown('typeSelect' + i); //cell
			tmpArr[tmpArr.length] = tmp;
			tmp.css({
				'float': 'left',
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
					'color': (function() {
						if($('#typeSelect'+num)[0].value != 'time') {
							return 'black';
						}
					})(),
				});
			});
			ch.addChild(tmp);
		}

		droppableBox.children = grid.children;
		$.each(grid.functions, function() {
			droppableBox.addFunction(this);
		});
		droppableBox.refresh().state.done(function(response) { //after droppable box becomes a table,
			if(response) {
				console.log(response);
			}

			ch.appendTo('#'+droppableBox.id, 'prepend').state.done(function() { //after the header selection box is appended to the top of the table,
				var w = $("[name*='column0']").css('width').toString();
				var width = parseInt(w.substring(0, w.indexOf('px')));

				$("[parent*='selectionRow']").each(function() { //change the size of the selectable header boxes.
					this.style["width"] = (width + 4).toString() + 'px';
				});


				var selFrmFrstRw = $jConstruct('checkbox', {
					text: 'Get column types from first row',
				}).event('change', function() {
					if(this.checked) {
						$(grid.getRow(0)[0].children).each(function(indx, obj) {
							if(obj.value !== undefined) {
								tmpArr[indx].select(obj.value);
							}
						});

						grid.removeRow(0).done(function() {
							$(tmpArr).each(function() {
								$('#'+this.id).trigger('change');
							});
						});

					}
				});

				selFrmFrstRw.appendTo('#'+droppableBox.id, 'prepend').state.done(function() {
					//resize the colorbox to fit the inner content.
		            var w = $('#cbDateEdit').width();
		            var h = $('#cbDateEdit').height();
		            console.log(w, h);
		            $.colorbox.resize({width:w, height:h});
				});


			});
		});
	},

}

function csvSubmitFormAppendTo(container) {
	var dfd = new $.Deferred();
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
		'border-radius': '3px',
		'display': 'inline-block',
		
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
		},
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
        });
        return dfd.promise();
	}

	var btnSubmit = $jConstruct('button', {
		text: 'Submit',
	}).event('click', function() {
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

		function stuff() {
		  	var arrObj = [];
		  	if($('#drop_zone').children()[0].innerHTML != "Drag and drop your CSV file here.") { //make sure a csv file was actually uploaded.
			  	$.each($('#drop_zone').children(), function(indx0, val0) {
			    	arrObj[indx0] = [];
			    	$.each(val0.children, function(indx, val) {
				      	if(val.style.backgroundColor !== "") {
				        	arrObj[indx0][arrObj[indx0].length] = val.value;
				      	}
			    	});
			  	});
		  	} else {
		  		console.log('no csv data!');
		  	}
		  	if(arrObj.length > 0) { //filter the array.
		  		$.each(arrObj, function(indx, obj) {
		  			if(obj === undefined || obj === [] || obj === [[]] || obj.length <= 0) {
		  				arrObj.splice(indx, 1);
		  			}
		  		});
		  	}
		  	console.log(arrObj);
		  	return arrObj;
		}

		var columns = tst();
		var rawData = stuff();
		var json = {};
		var indx = 1;

		var progress = $jConstruct('div', { //construct the progress bar div.
			id: 'progressbar',
			text: 'Uploading data...',
		}).event('progressbar', {
			value: 5,
		});

		if(tst().length > 0) { //make sure rows are selected before actually doing anything.
			console.log('debug ln325:', tst());
			$.colorbox({html: '<div id="cbDateEdit"></div>', width: '350px', height: '100px'});
			progress.appendTo('#cbDateEdit'); //append it to a new colorbox.

			var submitData = function() {
				if(rawData[indx]) {
					$.each(columns, function(indx1, currColumn) {
						json[currColumn] = rawData[indx][indx1];
					});
					indx++;
					console.log('pushing:', json);
					submitProcess(json).done(function() {
						if(indx < 128) {
							submitData();
							$('#'+progress.id).progressbar({
								value: (((indx-2) / rawData.length) * 100),
							});
						} else {
							$.colorbox.close();
						}
					});
				} else {
					$.colorbox.close();
				}
			};
			submitData();
		} else {
			alert('No columns selected!');
		}
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
	}).appendTo(container).state.done(function() {
		dfd.resolve();
	});

	container.state = dfd.promise();
	return container;
}
