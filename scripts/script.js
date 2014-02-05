
/*
    TABLE TITLE:
    Schedule title and schedule description, schedule date, active & inactive (blnActive).

*/

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

    /*
        Property: evntSchdl
        Description: Similar to a C-like constructor, returns an object of null properties
                     helpful for the programmer to produce these objects.
        Inputs: NONE.
        Outputs: Properties object.
    */
    evntSchdl: function () {
        var undef;
        return { //similar to a C-like object constructor, tells me all the properties required for an object.
            blnActive: undef,
            dtDateAdded: undef,
            dtOnLineFilledEndDate: undef,
            dtOnLineFilledStartDate: undef,
            dtScheduleDate: undef,
            indxOrganizationEventID: undef,
            indxPhotographerID: undef,
            indxScheduleID: undef,
            intNumCameras: undef,
            strScheduleDescription: undef,
            strScheduleTitle: undef,
            strSortOrderDefault: undef,
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
    Variable: template
    Description: Contains functions which returns a JSON string representing HTML.
*/
var template = {
    btn: {
        /*
            Property: del
            Description: Can return HTML for a button which is labeled as "Delete."
            Inputs: NONE, Property.
            Outputs: functions (html, and append).
        */
        del: {
            html: function (div) {
                return '<div class="btn"><button id=' + '"delBtn' + div + '" onclick=' + '"console.debug(\'Clicked!\')"> delete </button></div>';
            },
            append: function (div) {
                $('#'+div).append(template.btn.del.html(div));
            }
        }
    },
    scheduleTbl: function (schdProp) {
        var myDiv = {
            id: undefined !== schdProp.id ? schdProp.id : undefined,
            class: undefined !== schdProp.class ? schdProp.class : undefined,
            title: schdProp.title,
        };
        var blocks = {
            startTag: function() {
                if(undefined !== myDiv.class) {
                    return '<div class="'+myDiv.class+'" id="'+myDiv.id+'" ';
                } else {
                    return '<div id="'+myDiv.id+'" ';
                }
            },
            listener: function () {
                var lstnrs = [
                    'onclick="dataObjs.tblElemClick('+myDiv.id+')()" ',
                ];
                var htmlBlock = '';
                $.each(lstnrs, function () {
                    if(this !== undefined) {
                        htmlBlock += this;
                    }
                });
                return htmlBlock + '>';
            }, 
            endTag: '</div>'
        };
        //blocks.startTag() + blocks.listener() + myDiv.title + template.btn.del.html(myDiv.id) + blocks.endTag;
        return blocks.startTag() + blocks.listener() + myDiv.title + blocks.endTag;
    }
};


/*
    Function: main()
    Description: main function of the web application, call it to begin the application.
    Inputs: NONE.
    Outputs: No returned value, VOID.
*/
function main () {
    var url = 'https://www.mypicday.com/Handlers/ScheduleGetData.aspx?Data=1';
    
    $sql(url).get(function(dta) { //this gets the data from the sql database, code provided in class.js
        var parsed = JSON.parse(dta);
        dataObjs.srvdTbls = parsed;
        $.each(parsed.EventSchedules, function(indx, obj) {
            $('#display-tbls').append(template.scheduleTbl({
                title: obj.strScheduleTitle +
                    ' ' + obj.strScheduleDescription + 
                    ' ' + obj.dtScheduleDate + 
                    ' ' + 'visible: ' + (obj.blnActive ? 'true' : 'false'),
                id: 'foo' + indx,
                class: 'foo',
            }));
            $('#foo'+indx).append(parseMenu(genMenObj({
                title: 'edit',
                id: 'Edit'+indx,
                width: '185px',
            })));
            $('#Edit'+indx).menu({
                theme: 'theme-default',
                transition: 'inside-slide-fade-left',
            });
        });
    });
}

//this is how to tell when the code should start.
$(document).ready(function() {
    main();
});