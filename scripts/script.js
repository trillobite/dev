
/*
    TABLE TITLE:
    Schedule title and schedule description, schedule date, active & inactive (blnActive).

*/

var id = {
    photographer: undefined,
    event: undefined,
};

//colors used most often in this project. colors can be tweaked here.
var $p = function (obj) {
    var options = {
        blue: '#3287CC',  
        darkBlue: '#205480',
        gray: '#CCCCCC',
        purple: '#5233A6',
        red: '#A8150D',
        color: function (id) {
            return cmd.rgbToHex($('#'+id)[0].style['color']).toUpperCase();
        },
    };
    return undefined !== options[obj] ? options[obj] : undefined;
};

var $v = function (obj) {
    return {
        events: function () {
            return dataObjs.srvdTbls.EventSchedules;  
        },
        times: function () {
            return dataObjs.evntTimes.EventScheduleItems;
        },
        html: function () {
            return $('#'+obj)[0];
        },
        clear: function () {
            $('#'+obj).empty();  
        },
    };  
};
var undef;
/*
    Object: dataObjs
    Description: Global properties variable, holds common data.
*/
var dataObjs = {
    slctdObj: undefined,
    slctdDiv: undefined,
    srvdTbls: [], //Array, the names of the tables in which the user will edit.
    evntTimes: [], //Array, the times for the event (srvdTbls).
    tblsData: [], //Array, the data contained in each table from the DB.
    currTblElemns: [], //Array, an array of div id's for the dynamically created tables.
    currDtaElemens: [], //Array, an array of div id's for the dynamically created times/table data.
    
    clearTime: function (dateTime) {
        dateTime.setHours(0);
        dateTime.setMinutes(0);
        dateTime.setSeconds(0);
        return dateTime;
    },
    timeMidnight: function (dateTime) {
        dateTime.setHours(23);
        dateTime.setMinutes(55);
        return dateTime;
    },
    /*
        Property: evntSchdl
        Description: Similar to a C-like constructor, returns an object of null properties
                     helpful for the programmer to produce these objects.
        Inputs: NONE.
        Outputs: Properties object.
    */
    evntSchdl: { //similar to a C-like object constructor, tells me all the properties required for an object.
            blnActive: true,
            dtDateAdded: undef,
            dtOnLineFilledEndDate: undef,
            dtOnLineFilledStartDate: function () { return dataObjs.clearTime(new Date()) },
            dtScheduleDate: undef,
            indxOrganizationEventID: undef,
            indxPhotographerID: undef,
            indxScheduleID: undef,
            intNumCameras: 1,
            strScheduleDescription: undef,
            strScheduleTitle: undef,
            strSortOrderDefault: '',
    },
    evntTime: function () { //returns a partially pre-filled new event time object.
        var event = dataObjs.srvdTbls.EventSchedules[parseInt(dataObjs.slctdObj.substring(3, dataObjs.slctdObj.length), 10)];
        return {
            indxPhotographerID: event.indxPhotographerID,
            indxOrganizationEventID: event.indxOrganizationEventID,
            indxScheduleID: event.indxScheduleID,
            indxScheduleDateID: 0,
            dtDateTime: event.dtScheduleDate.toLocaleTimeString, //executes as a function later
            blnOnlineFilledAllowed: true,
            blnOnlineFilled: false,
            indxOrganizationEventGroupInfoID: 0,
            strGroupName: "",
            strOrganizationEventGroupName: "", //handled by server
            strScheduleOverRideGroupName: "", //handled by server
            strGroupDivision: "",
            strScheduleOverRideGroupDivision: "", //handled by server
            strOrganizationEventGroupDivision: "", //handled by server
            strGroupInstructor: "",
            strScheduleOverRideGroupInstructor: "", //handled by server
            strOrganizationEventGroupInstructorName: "", //handled by server
            strOrganizationEventGroupCode: "",
            intScheduleOverRideNumPaticipants: 0,
            blnCheckedIn: false,
            strNotes: "",
        };
    },
    /*
        Function: tblElemClick()
        Description: Used by createDivElemens(array, string); returns a function which will fire
                     when the use clicks the div element.
        Inputs: NONE.
        Outputs: function. 
    */
    tblElemClick: function(div) {
        return function () { //ANOTHER GET FUNCTION WOULD GO HERE!
            slctdObj = div;
            console.debug('element clicked!', slctdObj);
        };
    },
};

/*
    example json parsing, type this into chrome console:
    
    appendHTML(jsonObj({
        id: 'helloWorld',
    }), 'id if blank div element here in quotes');
*/

//Returns a small chunk of HTML as a string back to the parent function.
//Can produce HTML for a button, text box, or a div element.
var parsetype = function (type) {
    function ico(element) {
        var html = {
            id: undefined !== element.id ? ' id="'+element.id+'"' : '',
            class: undefined !== element.class ? ' class="'+element.class+'"' : '',
            onclick: undefined !== element.onclick ? ' onclick="'+element.onclick+'"' : '',
            onblur: undefined !== element.onblur ? ' onblur="' + element.onblur + '"' : '',
            onfocus: undefined !== element.onfocus ? ' onfocus="' + element.onfocus + '"' : '',
            max: undefined !== element.max ? ' max="' + element.max + '"' : '',
            min: undefined !== element.min ? ' min="' + element.min + '"' : '',
            name: undefined !== element.name ? ' name="' + element.name + '"' : '',
            readonly: undefined !== element.readonly ? ' readonly="' + element.readonly + '"' : '',
            rows: undefined !== element.rows ? ' rows="' + element.rows + '"' : '',
            cols: undefined !== element.cols ? ' cols="' + element.cols + '"' : '',
        }; 
        var retVal = "";
        $.each(html, function () { //for each property.
            retVal += this;
        });
        return retVal;
    }
    var options = {
        button: function (element) {
            var html = {
                start: '<button type="button"',
                end: undefined !== element.text ? '>' + element.text + '</button>' : '></button>',
            };
            return html.start + ico(element) + html.end;
        },
        checkbox: function (element) {
            var html = {
                start: '<input type="checkbox"',
                end: '>' + (undefined !== element.text ? element.text : '') + '<br>',
            };
            return html.start + ico(element) + html.end;
        },
        div: function (element) {
            var html = {
                start: '<div',
                end: undefined !== element.text ? '>' + element.text + '</div>' : '></div>',
            };
            return html.start + ico(element) + html.end;
        },
        html: function (element) {
            return element.data;
        },
        spinner: function (element) {
            var html = {
                start: undefined !== element.text ? element.text+'<input type="number"' : '<input type="number"',
                end: '/>',
            };
            return html.start + ico(element) + html.end;
        },
        textarea: function (element) {
            var html = { 
                start: '<textarea ',
                end: undefined !== element.text ? '>' + element.text + '</textarea>' : '></textarea>',
            };
            return html.start + ico(element) + html.end;
        },
        textbox: function (element) {
            var html = {
                start: '<input type="text"',
                end: undefined !== element.text ? ' value="' + element.text + '">' : '>',
            };
            return html.start + ico(element) + html.end;
        },

    };
    return undefined !== options[type] ? options[type] : undefined;
};

//recursive function, simply loops until there are no more children objects,
//uses jQuery to append to the parent object (usually a div element).
function appendHTML(jsonObj, container) {
    if(typeof jsonObj == 'function'){
        jsonObj = jsonObj();
    }
    $('#'+container).append(parsetype(jsonObj.type)(jsonObj));
    if(undefined !== jsonObj.children) {
        $.each(jsonObj.children, function () {
            appendHTML(this, jsonObj.id);
        });
    }
    if(undefined !== jsonObj.functions) {
        $.each(jsonObj.functions, function () {
            this();
        });
    }
}

var $db = {
    schedules: {
        create: function (json, func) {
            var url = 'https://www.mypicday.com/Handlers/ScheduleCreateData.aspx?Data='+JSON.stringify(json);
            $sql(url).get(function (data) {
                func(data);
            });
        },
        get: function(indx, func) {
            var url = 'https://www.mypicday.com/Handlers/ScheduleGetData.aspx?Data=' + indx; //id.event
            $sql(url).get(function (data) {
                func(data);
            });
        },
        remove: function(json, func) { //$v().events()[indx]
            var url = 'https://www.mypicday.com/Handlers/ScheduleDeleteData.aspx?Data=' + json.indxScheduleID;
            url += '&Data2=' + json.indxOrganizationEventID;
            $sql(url).get(function (data) {
                func(data);
            });
        },
        update: function(json, func) {
            var url = 'https://www.mypicday.com/Handlers/ScheduleUpdateData.aspx?Data='+JSON.stringify(json);
            $sql(url).get(function (data) {
                func(data);
            });
        },
    },
    scheduleItems: {
        create: function (json, func) {
            var url = 'https://www.mypicday.com/Handlers/ScheduleInsertItemData.aspx?Data='+JSON.stringify(json);
            $sql(url).get(function (data) {
                func(data);
            });
        },
        get: function (indx, func) {
            var url = 'https://www.mypicday.com/Handlers/ScheduleGetItemData.aspx?Data='+indx; //evntID
            $sql(url).get(function (data) {
                func(data);
            });
        },
        remove: function(json, func) {
            //not created yet.
        },
        update: function(json, func) {
            var url = 'https://www.mypicday.com/Handlers/ScheduleUpdateItemData.aspx?Data='+JSON.stringify(json);
            $sql(url).get(function (data) {
                func(data);
            });
        },
    },
};
//$project.draw('scheduleItems')();
var $project = {
    create: function(selection) {
        var objects = {
            schedules: function (json) {
                $db.schedules.create(json, function(data) {

                });
            },
            scheduleItems: function (json) {
                $db.scheduleItems.create(json, function(data) {

                });
            }
        };
        return undefined !== objects[selection] ? objects[selection] : undefined;
    },
    draw: function(selection) {
        var objects = {
            schedules: function (indx) { //event id, and current selected schedule, if any.
                var dfd = new $.Deferred();
                $db.schedules.get(indx, function(data) {
                    var parsed = JSON.parse(data);
                    dataObjs.srvdTbls = parsed;
                    if(undefined !== dataObjs.evntSchdl) {
                        $v('display-tbls').clear();
                        dataObjs.evntSchdl.indxPhotographerID = id.photographer;
                        dataObjs.evntSchdl.indxOrganizationEventID = id.event;
                        dataObjs.evntSchdl.indxScheduleID = parsed.EventSchedules[0].indxScheduleID;
                        if(undefined !== indx) {
                            cmd.events.drawJSON(parsed, indx);
                        } else {
                            cmd.events.drawJSON(parsed);
                        }
                    }
                    dfd.resolve(); //everything is done here.
                    /*if(slctdEvent) { //select the current selected schedule.
                        cmd.scheduleFocus('foo'+indx, $v().events()[indx].indxScheduleID);
                    }*/
                });
                return dfd.promise();
            },
            scheduleItems: function (indx) {
                var dfd = new $.Deferred();
                $db.scheduleItems.get(indx, function (data) {
                    dataObjs.evntTimes = JSON.parse(data);
                    dataObjs.evntTimes.EventScheduleItems.sort(function(a,b) { //sort by time.
                        return new Date(a.dtDateTime).getTime() - new Date(b.dtDateTime).getTime(); 
                    });
                    $v('display-tblInfo').clear(); //clears the div in case there is existing data.
                    appendHTML(forms['defaultEvntTime'], 'display-tblInfo');
                    $.each(dataObjs.evntTimes.EventScheduleItems, function(count, obj) {
                        var prop = {
                            cnt: count,
                            reserved: obj.blnOnlineFilledAllowed,
                            checked: obj.blnCheckedIn,
                            time: obj.dtDateTime,
                            name: obj.strGroupName,
                            division: obj.strGroupDivision,
                            coach: obj.strGroupInstructor,
                            id: obj.intScheduleOverRideNumPaticipants,
                        };
                        appendHTML(forms['defEvntTimes'](prop), 'display-tblInfo');
                    });
                    dfd.resolve(); //everything is done here.
                });
                return dfd.promise();
            }
        };
        return undefined !== objects[selection] ? objects[selection] : undefined;
    },
    update: function(selection) { //$project.update('scheduleItem')('{json}', function () {});
        var objects = {
            schedule: function (json, func) {
                $db.schedules.update(json, func);
            },
            scheduleItem: function (json, func) {
                $db.scheduleItems.update(json, func);
            },
            scheduleTextBoxUpdater: function (obj) {
                var txtBxData = $('#'+obj.txtBxID)[0].value;
                if($v().events()[obj.indx][obj.property] != txtBxData) {
                    $v().events()[obj.indx][obj.property] = txtBxData; //update the data in the existing object.
                    $project.update('schedule')($v().events()[obj.indx], function(data) {
                        if(data) { //if the data returned is not 0, undefined, null, [], etc...
                            if(JSON.parse(data)[obj.property] == txtBxData) {
                                console.log('OK!', data); //success.
                                /*$project.draw('schedules')(id.event).done(function() {

                                });*/


                                /*$('#'+obj.txtBxID).css({
                                    'color': obj.color, //change color of text after update.
                                });*/
                            } else {
                                console.log('error1: Retured data from db does not match entry.', data); //new data was not entered.
                            }
                        } else {
                            console.log('error0: Update failure, bad data entry formt or bad update string.', data); //bad update string.
                        }
                    })
                }
            },
            scheduleItemTextBoxUpdater: function (obj) {
                var txtBxData = undefined == obj.dt ? $('#'+obj.txtBxID)[0].value : obj.dt; //if there is a date time object in the input, update that.
                if($v().times()[obj.indx][obj.property] != txtBxData) {
                    $v().times()[obj.indx][obj.property] = txtBxData; //update the data in the existing object.
                    $project.update('scheduleItem')($v().times()[obj.indx], function (data) {
                        if(data) { //if the data returned is not 0, undefined, null, [], etc...
                            if(JSON.parse(data)[obj.property] == txtBxData) {
                                console.log('OK!', data); //success.
                                $('#'+obj.txtBxID).css({
                                    'color': obj.color, //change color of text after update.
                                });
                            } else {
                                console.log('error1: Returned data from db does not match entry.', data); //new data was not entered.
                            }
                        } else {
                            console.log('error0: Update failure, bad data entry formt or bad update string.', data); //bad update string.
                        }
                    });
                }
            },
        };
        return undefined !== objects[selection] ? objects[selection] : undefined;
    },
    remove: function(selection) {
        var objects = {
            schedule: function (json, func) {
                $db.schedules.remove(json, func);
            },
            scheduleItem: function (json, func) {
                $db.scheduleItems.remove(json, func);
            }
        };
        return undefined !== objects[selection] ? objects[selection] : undefined;
    },
}

var cmd = { //project commands sorted alphabetically.
    /*reportSelected: function (id) {
        var checkStatus = function() {
            console.log(id);
            var d = new $.Deferred();
            if(dataObjs.slctdDiv !== id) {
                d.resolve(dataObjs.slctdDiv);
            }
            return d.promise();
        };
        $.when(checkStatus()).done(function(data) {
            console.log('focus changed!', data); 
            $.ptTimeSelect.closeCntr();
            //$('#ptTimeSelectCntr').hide();
        });
    },*/
    componentToHex: function (c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    },
    create: { //DEPRICATED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        times: function (evntID) {
            $project.draw('scheduleItems')(evntID);
        }
    },
    //each pt- is a sub div inside the element.
    createEvent: function (obj) {
        var d = new Date(obj.data.dtScheduleDate);
        return {
            id: 'foo' + obj.cntr,
            class: 'foo',
            indx: obj.cntr,
            evntID: obj.data.indxScheduleID,
            pt0: {
                text: '<font color="#241DAB">Description: ' + obj.data.strScheduleDescription + '</font>',
                raw: obj.data.strScheduleDescription, //the data without html tags.
            },
            pt1: {
                text: '<b><u>' + obj.data.strScheduleTitle + '</b></u>',
                raw: obj.data.strScheduleTitle,  //the data without html tags.
            },
            pt15: {
                text: d.toLocaleDateString(),  
                raw: obj.data.dtScheduleDate, //the data without html tags.
            },
            pt2: {
                text: 'active: ' + (obj.data.blnActive ? 'true' : '<font color="#993300"><b>false</font></b>'),
                raw: obj.data.blnActive, //the data without html tags.
            },
        };
    }, 
    events: { //display-tbls DIV.
        drawJSON: function (jsonDta, idSelect) {
            jsonDta.EventSchedules.sort(function(a,b) { //sort by date.
                return new Date(a.dtScheduleDate) - new Date(b.dtScheduleDate); 
            });

            $.each(jsonDta.EventSchedules, function(indx, obj) {
                appendHTML(forms['genEvnt'](cmd.createEvent({
                    cntr: indx,
                    data: obj,
                })), 'display-tbls');
            });
            if(undefined !== idSelect) { //can specify which object to have focus after drawing the json data.
                $.each($v().events(), function (index, obj) {
                    if(obj.indxScheduleID == idSelect) {
                        console.log('found', index);
                        //$('#foo'+index).focus();
                        cmd.scheduleFocus('foo'+index, obj.indxScheduleID);
                    }
                });
            }
        },
    },
    del: function (indx) { //DEPRICATED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //console.log(indx, dataObjs.srvdTbls.EventSchedules[indx]);
        var rmObj = $v().events()[indx];
        var url = 'https://www.mypicday.com/Handlers/ScheduleDeleteData.aspx?Data=' + rmObj.indxScheduleID;
        url += '&Data2=' + rmObj.indxOrganizationEventID;
        
        $sql(url).get(function(dta) {
            console.log(dta);
            if(dta) {
                dataObjs.srvdTbls.EventSchedules.splice(indx, 1);
            }
            $v('display-tbls').clear();
            cmd.events.drawJSON(dataObjs.srvdTbls);
        });
    },
    selectSchedule: function(id) {
        if(id != dataObjs.slctdObj) {
            $('.foo').each(function() {
                if(this.id == id) {
                    $('#'+this.id).css({
                        'background-color': $p('blue'),
                    });
                    dataObjs.slctdObj = id;
                } else {
                    $('#'+this.id).css({
                        'background-color': 'white',
                    });
                }
            });
        }
    },
    scheduleFocus: function (id, evntID) { //prop.id, prop.evntID
        if(id != dataObjs.slctdObj) {
            $('.foo').each(function() {
                $('#'+this.id).css({
                    'background-color': 'white',
                });
            });
            //console.log(evntID, dataObjs.slctdObj);
            $project.draw('scheduleItems')(evntID); //had to be placed here, since if the user hit the edit menu, every menu item would produce a sql call.
        }
        $('#'+id).css({
            'background-color': $p('blue'),
        });
        dataObjs.slctdObj = id;
    },
    update: function (indx) { //DEPRICATED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        $db.schedules.update($v().events()[indx], function(data) {
            $project.draw('schedules')(id.event).done(function() {
                $.each($v().events(), function(cnt, obj) { //make sure after update, if objects resorted, correct schedule is still in focus.
                    if(obj.strScheduleTitle == JSON.parse(data).strScheduleTitle) {
                        cmd.selectSchedule('foo'+cnt);
                    }
                });
            });
        })
    },
    //Use: rgbToHex($('#foo0')[0].style.backgroundColor.substring(4, $('#foo0')[0].style.backgroundColor.length-1).split(', '));
    rgbToHex: function (rgb) { //converts rgb color definition to HEX.
        var arrRGB = rgb.substring(4, rgb.length-1).split(', ');
        return "#" + ((1 << 24) + ( parseInt(arrRGB[0]) << 16) + ( parseInt(arrRGB[1]) << 8) + parseInt(arrRGB[2]) ).toString(16).slice(1);
    },
    time: {
        obj: {
            hour: 0,
            minutes: 0,
            seconds: 0,
            morning: true, //default AM
            reset: function () {
                cmd.time.obj.hour    = 0;
                cmd.time.obj.minutes = 0;
                cmd.time.obj.seconds = 0;
                cmd.time.obj.morning = true;
            },
            date: function () {
                return cmd.time.mkTimeStr(cmd.time.obj);
            }
        },
        mkTimeStr: function(timeStore) {
            var valid = parseInt(timeStore.hour) && !(parseInt(timeStore.hour) > 12) ? true : false; //if it's anything but 0, and not greater than 24, it is valid;
            valid = valid ? parseInt(timeStore.minutes) >= 0 && parseInt(timeStore.minutes) <= 60 ? true : false : false; //minutes is not a negative, and no more than 60.
            var dt = new Date();
            function to24(tHour) {
                if(!(timeStore.morning) && parseInt(tHour) != 12) { //it's assumed if one enteres 12, they mean noon unless specified.
                    var tHour = parseInt(tHour) + 12;
                }else if(timeStore.morning && parseInt(tHour) == 12) { //if it's midnight (12) specified am.
                    var tHour = 0; //will be 00 in 24hr time.
                }
                return tHour.toString();
            }
            timeStore.hour = valid ? to24(timeStore.hour) : 'e'; //force return error invalid date if time is not valid, by inserting char to make it invalid.
            //console.log(timeStore.hour);
            dt.setHours(parseInt(timeStore.hour));
            dt.setMinutes(parseInt(timeStore.minutes));
            dt.setSeconds(0);
            if(dt == "Invalid Date") {
                alert("check your input time format!");
            }
            return dt;
        },
        removeDayTime: function(str) {
            var removeChars = [ 'a', 'm', 'p', ' ' ];
            $.each(removeChars, function() {
                str = str.replace(this, '');
            });
            return str;
        },
        strDayTimeCheck: function(str) {
            if(str.indexOf('m') >= 0) { //if there is no am or pm marked, skip.
                str = str.substring(str.indexOf('m')-1, str.indexOf('m')+1);
                return str == 'am' ? true : false;
            }
            return true; //default to am.
        },
        parseShorthand: function(input, timeObj) { 
            var timeStore = timeObj;
            //console.log('colon does not exist');
            timeStore.morning = cmd.time.strDayTimeCheck(input); //first identify if am or pm.
            input = cmd.time.removeDayTime(input);
            console.log(input, 'length:', input.length);
            if(parseInt(input.length / 2) == 1) { //after alphabetical removed, still has 2 or 3 digits.
                //console.log('executing two or three digit process');
                if(!(parseInt(input) > 12)) { //user must be implying two digit time.
                    timeStore.hour = input;
                } else { //user must be implying hour and minutes.
                    if(input.length == 2) { //if length is 2, make length 3.
                        input += "0";
                    }
                    timeStore.hour = input.substring(0, 1);
                    timeStore.minutes = input.substring(1, input.length);
                }
            } else if(parseInt(input.length / 2) == 2) { //after alphabetical removed, still has has 4 digits.
                //console.log('executing four digit');
                timeStore.hour = input.substring(0, 2);
                timeStore.minutes = input.substring(2, input.length);
            } else if(input.length == 1) { //after alphabetical removed, still has only has one digit.
                //console.log('executing one digit');
                timeStore.hour = input;
            } //else it's an invalid time.
            return timeStore;
        },
        toTimeJSON: function(input) {

        },
        toShortHand: function(input) {
            var timeStore = {
                morning: true,
            };
            timeStore.morning = cmd.time.strDayTimeCheck(input); //determine if am or pm.
            input = input.replace(':', ''); //just remove the colon, and operate as if none ever existed.
            if(input.indexOf(':') >= 0) {
                input = input.substring(0, input.indexOf(':')); //if seconds is included, destroy it.
                input += timeStore.morning ? 'am' : 'pm'; //if it had seconds, am or pm is likely to have been stripped from time.
            }
            return {
                str: input,
                daytime: timeStore.morning,
            };
        },
        parse: function(input) {
            input = input.toLowerCase(); //very first thing, make sure all characters are lowercase.
            var timeStore = cmd.time.obj;
            timeStore.reset();
            if(input.indexOf(':') >= 0) { //has colon
                var tmp = cmd.time.toShortHand(input);
                input = tmp.str;
                timeStore.morning = tmp.daytime;
                timeStore = cmd.time.parseShorthand(input, timeStore);
            } else { //does not have colon.
                timeStore = cmd.time.parseShorthand(input, timeStore);
            }
            return timeStore.date();
        },
        format: function(input) { //converts to 24 hour, then returns the number of milliseconds since midnight Jan 1, 1970.
            var date = new Date();
            var hour = parseInt(input.substring(0, input.indexOf(':')), 10);
            var minutes = parseInt(input.substring(input.indexOf(':')+1, input.indexOf(' ')), 10);
            var amPm = input.substring(input.indexOf(' ')+1, input.length);
            if(amPm == 'PM') {
                hour += 12;
            }
            date.setHours(hour);
            date.setMinutes(minutes);
            date.setSeconds(0);
            return date.getTime();
        },
        today: function () {
            return new Date();
        },
        midnightAm: function (d) {
            d.setHours(0);
            d.setMinutes(0);
            d.setSeconds(0);
            return d;
        },
        midnightPm: function (d) {
            d.setHours(23);
            d.setMinutes(55);
            d.setSeconds(0);
            return d;
        },
        midnightTonight: function () {
            return cmd.time.midnightPm(cmd.time.today());
        },
        midnightToday: function () {
            return cmd.time.midnightAm(cmd.time.today());
        },
        db2LocaleTime: function(obj) {
            var date = new Date();
            date.setHours(obj.substring(0, obj.indexOf(':')));
            date.setMinutes(obj.substring(obj.indexOf(':')+1, obj.indexOf(':')+3));
            date.setSeconds('0');
            return date.toLocaleTimeString();
        }  
    },
};

//cut and paste this anywhere, and modify the ID's below. Has not been tested for bugs extensively yet.
//this is the object to properly call this project.
$(document).ready(function() {
    id.photographer = 7; //override photographer ID here.
    id.event = 1; //override event ID here.
    $project.draw('schedules')(id.event);
});