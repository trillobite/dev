
/*
    TABLE TITLE:
    Schedule title and schedule description, schedule date, active & inactive (blnActive).

*/

var $v = function (div) {
    return {
        events: function () {
            return dataObjs.srvdTbls.EventSchedules;  
        },
        eventTimes: function () {
            return dataObjs.tblsData;
        },
        html: function () {
            return $('#'+div);
        },
        clear: function () {
            $('#'+div).empty();  
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
    srvdTbls: [], //Array, the names of the tables in which the user will edit.
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

//example json parsing, type this into chrome console:
/*
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
        }; 
        return html.id + html.class + html.onclick + html.onblur + html.onfocus;
    }
    var options = {
        textbox: function (element) {
            var html = {
                start: '<input type="text"',
                end: undefined !== element.text ? ' value="' + element.text + '">' : '>',
            };
            return html.start + ico(element) + html.end;
        },
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
                end: '>' + element.text + '<br>',
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
        }
    };
    return undefined !== options[type] ? options[type] : undefined;
};

//recursive function, simply loops until there are no more children objects,
//uses jQuery to append to the parent object (usually a div element).
function appendHTML(jsonObj, container) {
    if($m(jsonObj).typ == 'function'){
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

var cmd = {
    
    //each pt- is a sub div inside the element.
    createEvent: function (obj) {
        return {
            id: 'foo' + obj.cntr,
            class: 'foo',
            indx: obj.cntr,
            pt0: {
                text: '<font color="#554899">Description: ' + obj.data.strScheduleDescription + '</font>',
            },
            pt1: {
                text: '<b><u>' + obj.data.strScheduleTitle + '</b></u>',
            },
            pt15: {
                text: '<font color="white">'+obj.data.dtScheduleDate+'</font>',  
            },
            pt2: {
                text: 'active: ' + (obj.data.blnActive ? 'true' : '<font color="#993300"><b>false</font></b>'),
            }
        };
    }, 

    events: { //display-tbls DIV.
        drawJSON: function (jsonDta) {
            $.each(jsonDta.EventSchedules, function(indx, obj) {
                appendHTML(forms['genEvnt'](cmd.createEvent({
                    cntr: indx,
                    data: obj,
                })), 'display-tbls');
            });
        },
    },
    eventTimes: { //display-tblInfo DIV.
        drawJSON: function () {
            console.log('undefined');
        },
    },
    create: function () {
        $.colorbox({html:'<div id="createForm0"></div>', width: '350px', height: '400px'});
        appendHTML(forms['createEvent'],'createForm0');
    },
    update: function (indx) {
        var jStr = JSON.stringify($v().events()[indx]);
        //jStr = jStr.replace(/"/g, '\\"');
        //var url = "https://www.mypicday.com/Handlers/ScheduleUpdateData.aspx?Data='"+jStr+"'";
        var url = 'https://www.mypicday.com/Handlers/ScheduleUpdateData.aspx?Data='+jStr;
        console.log(jStr);
        console.log(url);
        $sql(url).get(function(dta) {
            console.log(dta);
            cmd.get();
        });
    },
    get: function () {
        var url = 'https://www.mypicday.com/Handlers/ScheduleGetData.aspx?Data=1';
        $sql(url).get(function(dta) {
            //console.log(dta);
            var parsed = JSON.parse(dta);
            dataObjs.srvdTbls = parsed;
            $v('display-tbls').clear();
            dataObjs.evntSchdl.indxPhotographerID = parsed.EventSchedules[0].indxPhotographerID;
            dataObjs.evntSchdl.indxOrganizationEventID = parsed.EventSchedules[0].indxOrganizationEventID;
            dataObjs.evntSchdl.indxScheduleID = parsed.EventSchedules[0].indxScheduleID;
            cmd.events.drawJSON(parsed);
        });
    },
    del: function (indx) {
        console.log(indx, dataObjs.srvdTbls.EventSchedules[indx]);
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
};

//this is how to tell when the code should start.
$(document).ready(function() {
    cmd.get();
});