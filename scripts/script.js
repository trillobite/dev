
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
        amber: '#A62334',
        lightAmber: '#CC2B40',
        color: function (id) {
            return cmd.rgbToHex($('#'+id)[0].style['color']).toUpperCase();
        },
    };
    return undefined !== options[obj] ? options[obj] : undefined;
};

var $v = function (obj) {
    var retObj = {
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
    return retObj;
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
    
    templates: {
        schedule: function() {
            var currentScheduleItem = $v().events()[parseInt(dataObjs.slctdObj.substring(3, dataObjs.slctdObj.length), 10)];
            return {
                indxPhotographerID: currentScheduleItem.indxPhotographerID,
                indxOrganizationEventID: currentScheduleItem.indxOrganizationEventID,
                indxScheduleID: currentScheduleItem.indxScheduleID,
                indxScheduleDateID: 0,
                dtDateTime: currentScheduleItem.dtScheduleDate.toLocaleTimeString, //executes as a function later
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

        scheduleTime: {             
            blnActive: true,
            dtDateAdded: undefined,
            dtOnLineFilledEndDate: undefined,
            dtOnLineFilledStartDate: function () { return dataObjs.clearTime(new Date()); },
            dtScheduleDate: undefined,
            indxOrganizationEventID: undefined,
            indxPhotographerID: undefined,
            indxScheduleID: undefined,
            intNumCameras: 1,
            strScheduleDescription: undefined,
            strScheduleTitle: undefined,
            strSortOrderDefault: '',
        },

    },

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
            dtDateAdded: undefined,
            dtOnLineFilledEndDate: undefined,
            dtOnLineFilledStartDate: function () { return dataObjs.clearTime(new Date()); },
            dtScheduleDate: undefined,
            indxOrganizationEventID: undefined,
            indxPhotographerID: undefined,
            indxScheduleID: undefined,
            intNumCameras: 1,
            strScheduleDescription: undefined,
            strScheduleTitle: undefined,
            strSortOrderDefault: '',
    },

    evntTime: function () { //returns a partially pre-filled new event time object.
        var currentScheduleItem = $v().events()[parseInt(dataObjs.slctdObj.substring(3, dataObjs.slctdObj.length), 10)];
        return {
            indxPhotographerID: currentScheduleItem.indxPhotographerID,
            indxOrganizationEventID: currentScheduleItem.indxOrganizationEventID,
            indxScheduleID: currentScheduleItem.indxScheduleID,
            indxScheduleDateID: 0,
            dtDateTime: currentScheduleItem.dtScheduleDate.toLocaleTimeString, //executes as a function later
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
/*    tblElemClick: function(div) {
        return function () { //ANOTHER GET FUNCTION WOULD GO HERE!
            slctdObj = div;
            console.debug('element clicked!', slctdObj);
        };
    },*/
};

/*
    this function will take a date time object, and remove the time zone changes. Currently,
    the data which is being stored as ISO time, does not account for time zone differences.
    therefore, $dt will calculate to compensate for when javaScript tries to add or subtract
    time zone differences between ISO time and Local time. When the database is updated so that
    all of the data is set to true ISO Zulu time, modify this function so that it simply returns
    the input without modifications.
*/
var $dt = {
    read: function (date) {
        if(typeof(date) == 'object') {
            date = date.toISOString();
        } 

        var type = cmd.detectBrowser();
        type = type.substring(0, type.indexOf(' '));
        
        if(type != 'IE') {
            date = date.replace('T', ' ');
            date = date.replace('Z', '');
            if(date.indexOf('.') >= 0) {
                date = date.substring(0, date.indexOf('.'));
            }
        }
        return new Date(date);
    },
    write: function(date) {
        return new Date(date); //just returns what was entered as a javaScript date object.
    },
    parse: function(time) {
        var type = cmd.detectBrowser();
        if(type.substring(0, type.indexOf(' ')) != 'IE') {
            return cmd.time.removeISOTimeZone($dt.write(cmd.time.parse(time))); //parse a string time in text box, and remove the time zone differences.
        } else {
            return $dt.write(cmd.time.parse(time));
        }
        
    }
};

var $db = {
    //modifies the xmlHttpSend URL to include a random parameter so that Internet Explorer will not cache the data.
    preventCache: function(url) {
        return url + '&Rand='+Math.floor((Math.random() * 1000) + 1).toString();
    },

    schedules: {
        create: function (json, func) {
            var url = 'https://www.mypicday.com/Handlers/ScheduleCreateData.aspx?Data='+JSON.stringify(json);
            $sql($db.preventCache(url)).get(function (data) {
                func(data);
            });
        },
        get: function(indx, func) {
            var url = 'https://www.mypicday.com/Handlers/ScheduleGetData.aspx?Data=' + indx; //id.event
            $sql($db.preventCache(url)).get(function (data) {
                func(data);
            });
        },
        remove: function(json, func) { //$v().events()[indx]
            var url = 'https://www.mypicday.com/Handlers/ScheduleDeleteData.aspx?Data=' + json.indxScheduleID;
            /*url += '&Data2=' + json.indxOrganizationEventID;*/
            $sql($db.preventCache(url)).get(function (data) {
                func(data);
            });
        },
        update: function(json, func) {
            var url = 'https://www.mypicday.com/Handlers/ScheduleUpdateData.aspx?Data='+JSON.stringify(json);
            $sql($db.preventCache(url)).get(function (data) {
                func(data);
            });
        },
    },
    scheduleItems: {
        create: function (json, func) {
            var url = 'https://www.mypicday.com/Handlers/ScheduleInsertItemData.aspx?Data='+JSON.stringify(json);
            $sql($db.preventCache(url)).get(function (data) {
                func(data);
            });
        },
        get: function (indx, func) {
            var url = 'https://www.mypicday.com/Handlers/ScheduleGetItemData.aspx?Data='+indx; //evntID
            $sql($db.preventCache(url)).get(function (data) {
                func(data);
            });
        },
        insert: function(str, func) {
            var url = 'https://www.mypicday.com/Handlers/ScheduleAddReservationRange.aspx?' + str;
            $sql($db.preventCache(url)).get(function(data) {
                func(data);
            });
        },
        remove: function(str, func) {
            //https://www.mypicday.com/Handlers/ScheduleDeleteItemData.aspx?Data=74521&Data2=1
            var url = 'https://www.mypicday.com/Handlers/ScheduleDeleteItemData.aspx?' + str;
            $sql($db.preventCache(url)).get(function (data) {
                func(data);
            });
        },
        update: function(json, func) {
            var url = 'https://www.mypicday.com/Handlers/ScheduleUpdateItemData.aspx?Data='+JSON.stringify(json);
            $sql($db.preventCache(url)).get(function (data) {
                func(data);
            });
        },
    },
};
//$project.draw('scheduleItems')();
var $project = {
    create: function(selection) {
        var objects = {
            schedule: function (json) {
                var dfd = new $.Deferred();
                $db.schedules.create(json, function(data) {
                    $project.draw('schedules')(json.indxScheduleID).done(function() {
                        dfd.resolve(data);
                    });
                });
                return dfd.promise();
            },
            //i think i need to produce a random number here to keep IE from caching!!!!
            scheduleItem: function (json) {
                var dfd = new $.Deferred();
                $db.scheduleItems.create(json, function(data) {
                    $project.draw('scheduleItems')(json.indxScheduleID).done(function() {
                        dfd.resolve(data);
                    });
                });
                return dfd.promise();
            }
        };
        return undefined !== objects[selection] ? objects[selection] : undefined;
    },
    draw: function(selection) {
        var objects = {
            schedules: function (indx) { //event id, and current selected schedule, if any.
                var dfd = new $.Deferred();
                $db.schedules.get(indx, function(data) {
                    if(JSON.parse(data).EventSchedules != "") {
                        var parsed = JSON.parse(data);
                        dataObjs.srvdTbls = [];
                        dataObjs.srvdTbls = parsed;
                        if(undefined !== dataObjs.evntSchdl) {
                            //$v('display-tbls').clear();
                            var myNode = document.getElementById('display-tbls');
                            while(myNode.firstChild) {
                                myNode.removeChild(myNode.firstChild);
                            }

                            dataObjs.evntSchdl.indxPhotographerID = id.photographer;
                            dataObjs.evntSchdl.indxOrganizationEventID = id.event;
                            dataObjs.evntSchdl.indxScheduleID = parsed.EventSchedules[0].indxScheduleID;
                            if(undefined !== indx) {
                                cmd.events.drawJSON(parsed, indx);
                            } else {
                                cmd.events.drawJSON(parsed);
                            }
                        }
                    } else {
                        alert('There is currently no data, please try the Add Schedule button');
                    }
                    dfd.resolve(); //everything is done here.
                });
                return dfd.promise(); //.done to determine when finished drawing.
            },
            scheduleItems: function (indx) {
                var dfd = new $.Deferred();
                $db.scheduleItems.get(indx, function (data) {
                    dataObjs.evntTime = [];
                    dataObjs.evntTimes = JSON.parse(data);
                    dataObjs.evntTimes.EventScheduleItems.sort(function(a,b) { //sort by time.
                        return new Date(a.dtDateTime).getTime() - new Date(b.dtDateTime).getTime(); 
                    });
                    //clears the div in case there is existing data.
                    var myNode = document.getElementById('display-tblInfo');
                    while(myNode.firstChild) {
                        myNode.removeChild(myNode.firstChild);
                    }
                    appendHTML(forms['defaultEvntTime'], '#display-tblInfo');
                    $.each(dataObjs.evntTimes.EventScheduleItems, function(count, obj) {
                        var prop = {
                            cnt: count,
                            reserved: obj.blnOnlineFilledAllowed,
                            checked: obj.blnCheckedIn,
                            time: cmd.time.removeISOTimeZone( $dt.read(obj.dtDateTime).toISOString() ), //javaScript tries to add the time zone when data comes from the db... this removes it.
                            name: obj.strGroupName,
                            division: obj.strGroupDivision,
                            coach: obj.strGroupInstructor,
                            id: obj.intScheduleOverRideNumPaticipants,
                        };
                        appendHTML(forms['defEvntTimes'](prop), '#display-tblInfo');
                    });
                    dfd.resolve(); //everything is done here.
                });
                return dfd.promise(); //.done to determine when finished drawing.
            }
        };
        return undefined !== objects[selection] ? objects[selection] : undefined;
    },
    update: function(selection) { //$project.update('scheduleItem')('{json}', function () {});
        var objects = {
            textBoxUpdater: function (obj, type) { //super, super, super generic updater for schedules/events and schedule items/times.
                var arrtype = type == 'schedule' ? 'events' : 'times'; //if it's a schedule, use the events array, if it's not, use the times array.
                var dfd = new $.Deferred();
                var txtBxData = undefined == obj.dt ? $('#'+obj.txtBxID)[0].value : obj.dt; //if there is a date time object in the input, update that.
                if($v()[arrtype]()[obj.indx][obj.property] != txtBxData) {
                    $v()[arrtype]()[obj.indx][obj.property] = txtBxData; //update the data in the existing object.
                    $project.update(type)($v()[arrtype]()[obj.indx], {
                        property: obj.property,
                        check: txtBxData,
                    }).done(function(data) {
                        dfd.resolve(data);
                    });
                }
                return dfd.promise();
            },
            updateCheck: function(data, obj) { //A generic quick check which returns the status of the update, if it's good or not.
                var returnData = {
                    dta: JSON.parse(data),
                };
                if(data) { //if the data returned is not 0, undefined, null, [], etc...
                    if(obj) {
                        if(JSON.parse(data)[obj.property] == obj.check) { //make sure that the data in the db is the same as current.
                            returnData.msg = 'OK!';
                        } else {
                            returnData.msg = 'error1: Returned data from db does not match entry.';
                        }
                    } else {
                        returnData.msg = 'warning: Cannot check data integrity, no "obj" parameter provided.';
                    }
                } else {
                    returnData.msg = 'error0: Update failure, bad data entry format or bad update string.';
                }
                return returnData;
            },
            schedule: function (json, obj) { //update a schedule object.
                var dfd = new $.Deferred();
                $db.schedules.update(json, function(data) {
                    var message = $project.update('updateCheck')(data, obj);
                    dfd.resolve(message.dta); //finished.
                });
                return dfd.promise();
            },
            scheduleItem: function (json, obj) { //update a schedule item / time object.
                var dfd = new $.Deferred();
                $db.scheduleItems.update(json, function(data) {
                    var message = $project.update('updateCheck')(data, obj);
                    dfd.resolve(message.dta); //finished.
                });
                return dfd.promise();
            },
            scheduleTextBoxUpdater: function (obj) { //using a text box, a proprietary / non generic, update schedule function.
                var dfd = new $.Deferred();
                $project.update('textBoxUpdater')(obj, 'schedule').done(function(data) {
                    dfd.resolve(data);
                });
                return dfd.promise();
            },
            scheduleItemTextBoxUpdater: function (obj) { //using a text box, a proprietary / non generic, update schedule item / time function.
                var dfd = new $.Deferred();
                $project.update('textBoxUpdater')(obj, 'scheduleItem').done(function(data) {
                    $('#'+obj.txtBxID).css({
                        'color': obj.color, //change the color of the text to show the user it was successfully updated.
                    });
                    dfd.resolve(data);
                });
                return dfd.promise();
            },
        };
        return undefined !== objects[selection] ? objects[selection] : undefined;
    },
    //batch inserts.
    insert: function(selection) {
        var objects = {
            schedule: function(json) {
                //this would probably be used if the user submits a whole spreadsheet for upload.
            },
            scheduleItem: function(json) {
                var addDatas = function() {
                    url = "";
                    url = url + 'Data='   + json.ScheduleID.toString();
                    url = url + '&Data2=' + json.EventID.toString();
                    url = url + '&Data3=' + json.StartTimeDate.toString();
                    url = url + '&Data4=' + json.EndTimeDate.toString();
                    url = url + '&Data5=' + json.TimeInterval.toString();
                    url = url + '&Data6=' + json.Slots.toString();
                    url = url + '&Data7=' + json.PhotographerID.toString();
                    return url;
                };
                var dfd = new $.Deferred();
                $db.scheduleItems.insert(addDatas(), function(data) {

                    dfd.resolve(data);
                });
                return dfd.promise();
            },
        };
        return undefined !== objects[selection] ? objects[selection] : undefined;
    },
    remove: function(selection) {
        var objects = {
            removeCheck: function(data) {
                var returnData = {
                    dta: JSON.parse(data),
                };
                if(data) {
                    returnData.msg = 'OK!'; //if returned was anything but 0.
                } else {
                    returnData.msg = 'error!'; //if returned was 0.
                }
                return returnData;
            },
            schedule: function (json) {
                var dfd = new $.Deferred();
                $db.schedules.remove(json, function(data) {
                    var message = $project.remove('removeCheck')(data);
                    dfd.resolve(message.dta);
                });
                return dfd.promise();
            },
            scheduleItem: function (json) {
                var dfd = new $.Deferred();
                $db.scheduleItems.remove(json, function(data) {
                    var message = $project.remove('removeCheck')(data);
                    dfd.resolve(message.dta);
                });
                return dfd.promise();
            }
        };
        return undefined !== objects[selection] ? objects[selection] : undefined;
    },
}

var cmd = { //project commands sorted alphabetically.
    detectBrowser: function () {
        return (function(){
            var ua= navigator.userAgent, tem, 
                M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
                if(/trident/i.test(M[1])){
                    tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
                    return 'IE '+(tem[1] || '');
                }
                if(M[1]=== 'Chrome'){
                    tem= ua.match(/\bOPR\/(\d+)/)
                    if(tem!= null) return 'Opera '+tem[1];
                }
                M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
                if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
                return M.join(' ');
            })();
        
    },
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
        console.log(obj);
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
                text: $dt.read(d).toLocaleDateString(),  
                raw: obj.data.dtScheduleDate, //the data without html tags.
            },
            pt2: {
                text: 'active: ' + (obj.data.blnActive ? 'true' : '<font color="#993300"><b>false</font></b>'),
                raw: obj.data.blnActive, //the data without html tags.
            },
            dates: [obj.data.dtOnLineFilledStartDate, obj.data.dtOnLineFilledEndDate],
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
                })), '#display-tbls');
            });
            if(undefined !== idSelect) { //can specify which object to have focus after drawing the json data.
                $.each($v().events(), function (index, obj) {
                    if(obj.indxScheduleID == idSelect) {
                        //$('#foo'+index).focus();
                        cmd.scheduleFocus('foo'+index, obj.indxScheduleID);
                    }
                });
            }
        },
    },
    del: function (indx) { //DEPRICATED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        var rmObj = $v().events()[indx];
        var url = 'https://www.mypicday.com/Handlers/ScheduleDeleteData.aspx?Data=' + rmObj.indxScheduleID;
        url += '&Data2=' + rmObj.indxOrganizationEventID;
        
        $sql(url).get(function(dta) {
            if(dta) {
                dataObjs.srvdTbls.EventSchedules.splice(indx, 1);
            }
            $v('display-tblInfo').clear();
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
                if(this.id == dataObjs.slctdObj) { //change the color only if the object is not the one selected.
                    $('#'+this.id+'fromDate').css({
                        'color': $p('amber'),
                    });
                    $('#'+this.id+'toDate').css({
                        'color': $p('amber'),
                    });
                }
            });
            $project.draw('scheduleItems')(evntID); //had to be placed here, since if the user hit the edit menu, every menu item would produce a sql call.
        }
        $('#'+id).css({
            'background-color': $p('blue'),
        });

        dataObjs.slctdObj = id;
    },
    update: function (indx) { //DEPRICATED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        $project.update('schedule')($v().events()[indx]).done(function(data) {
            $project.draw('schedules')(id.event).done(function() {
                $.each($v().events(), function(cnt, obj) {
                    if(obj.strScheduleTitle == data.strScheduleTitle) {
                        cmd.selectSchedule('foo'+cnt);
                    }
                });
            });
        });
    },
    //Use: rgbToHex($('#foo0')[0].style.backgroundColor.substring(4, $('#foo0')[0].style.backgroundColor.length-1).split(', '));
    rgbToHex: function (rgb) { //converts rgb color definition to HEX.
        var arrRGB = rgb.substring(4, rgb.length-1).split(', ');
        return "#" + ((1 << 24) + ( parseInt(arrRGB[0]) << 16) + ( parseInt(arrRGB[1]) << 8) + parseInt(arrRGB[2]) ).toString(16).slice(1);
    },
    time: {
        /*
            if recieving time, in which the database did not account for time zones, set add to true, else leave undefined or false.
            data from db: cmd.time.removeISOTimeZone(dateTime.toISOString(), true);
            data to db:   cmd.time.removeISOTimeZone(dateTime.toISOString());
                                            or
                          cmd.time.removeISOTimeZone(dateTime.toISOString(), false);
        */
        removeISOTimeZone: function(isoTime, add) {
            var type = cmd.detectBrowser();
            type = type.substring(0, type.indexOf(' '));
            var d = new Date(isoTime);

            if(type == 'Chrome' || type == 'Opera') {
                if(add) {
                    return new Date(d.getTime() + (d.getTimezoneOffset() * 60000));
                } else {
                    return new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
                }
            } 

            return d;
        },
        IEremoveISOTimeZone: function(isoTime, add) {
            var type = cmd.detectBrowser();
            type = type.substring(0, type.indexOf(' '));
            var d = new Date(isoTime);

            if(type == 'IE') {
                if(add) {
                    return new Date(d.getTime() + (d.getTimezoneOffset() * 60000));
                } else {
                    return new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
                }
            } 

            return d;
        },
        getRelevantDate: function() {
            return $dt.read($v().events()[parseInt(dataObjs.slctdObj.substring(3, dataObjs.slctdObj.length))].dtScheduleDate);
        },
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
            var valid = parseInt(timeStore.hour) >= 0 && parseInt(timeStore.hour) <= 12 ? true : false; //if it's anything but 0, and not greater than 24, it is valid;
            valid = valid ? parseInt(timeStore.minutes) >= 0 && parseInt(timeStore.minutes) <= 60 ? true : false : false; //minutes is not a negative, and no more than 60.
            var dt = cmd.time.getRelevantDate();
            function to24(tHour) {
                if(!(timeStore.morning) && parseInt(tHour) != 12) { //it's assumed if one enteres 12, they mean noon unless specified.
                    var tHour = parseInt(tHour) + 12;
                }else if(timeStore.morning && parseInt(tHour) == 12) { //if it's midnight (12) specified am.
                    var tHour = 0; //will be 00 in 24hr time.
                }
                return tHour.toString();
            }
            timeStore.hour = valid ? to24(timeStore.hour) : 'e'; //force return error invalid date if time is not valid, by inserting char to make it invalid.
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
            timeStore.morning = cmd.time.strDayTimeCheck(input); //first identify if am or pm.
            input = cmd.time.removeDayTime(input).toString();
            var tmp = "";
            //IE compatibility, makes sure the string has no errors.
            for(var i = 0; i < input.length; ++i) {
                if(parseInt(input[i]).toString() != "NaN") {
                    tmp = tmp + parseInt(input[i]).toString();
                }
            }
            input = tmp;
            if(parseInt(input.length / 2) == 1) { //after alphabetical removed, still has 2 or 3 digits.
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
                timeStore.hour = input.substring(0, 2);
                timeStore.minutes = input.substring(2, input.length);
            } else if(input.length == 1) { //after alphabetical removed, still has only has one digit.
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
        //cmd.time.parse($('#txtBxTime5')[0].value);
        parse: function(input) {
            input = input.toLowerCase(); //very first thing, make sure all characters are lowercase.
            var timeStore = cmd.time.obj;
            timeStore.reset();
            if(input.indexOf(':') >= 0) { //has colon
                var tmp = cmd.time.toShortHand(input);
                input = tmp.str;
                timeStore.morning = tmp.daytime;
            }
            timeStore = cmd.time.parseShorthand(input, timeStore);
            //console.log(timeStore);
            return cmd.time.mkTimeStr(timeStore);
        },
        format: function(input) { //converts to 24 hour, then returns the number of milliseconds since midnight Jan 1, 1970.
            var date = cmd.time.getRelevantDate();
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

var setup = function() {
            //sets up the static div's
    $jConstruct('div', {
        id: 'display',
    }).addChild($jConstruct('div', {
        id: 'defaultMenu',
    })).addChild($jConstruct('div', {
        id: 'display-tbls',
    })).addChild($jConstruct('div', {
        id: 'display-tblInfo',
    })).appendTo('#mvpTool');

    //Add Schedule button
    $jConstruct('button', {
        id: 'btnNwEvnt',
        class: 'button',
        title: 'Add a new schedule to this event',
        text: 'Add Schedule',
    }).css({
        'float': 'left',
        'width': '115px',
        'line-height': '20px',
        'border-radius': '5px',
    }).event('click', function() {
        defaultColorbox('newEvent', 'createEventMinimal', {
            'width': '350px',
            'height': '370px',
        });
    }).appendTo('#defaultMenu');

    //Help button.
    $jConstruct('button', {
        id: 'btnHelp',
        class: 'button',
        text: 'Help',
    }).css({
        'float': 'left',
        'line-height': '20px',
        'border-radius': '5px',
    }).event('click', function() {
        defaultColorbox('winHelp','helpWindow', {
            'width': '350px',
            'height': '150px',
        });
    }).appendTo('#defaultMenu');
};

//cut and paste this anywhere, and modify the ID's below. Has not been tested for bugs extensively yet.
//this is the object to properly call this project.
$(document).ready(function() {
    setup();
    id.photographer = 7; //override photographer ID here.
    id.event = 1; //override event ID here. 659
    $project.draw('schedules')(id.event);
});