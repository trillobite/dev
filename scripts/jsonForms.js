/*
    File: jsonForms.js
    Description: Contains all of the json type objects which will be converted into html.
                 they are templates aka "Forms."
*/
var colors = function() {
    return {
        blue: '#3287CC',
        darkBlue: '#205480',
        purple: '#5233A6',
        gray: '#CCCCCC',
    };
};

var dpToggle = 1;

var previousTxt;
function tgglTxtBx(id, dbVal, defVal) {
    var object = function (val, color) {
        if(undefined !== val) {
            if(undefined !== color) {
                $('#'+id).css({
                    'color': color,
                });
            }
            $('#'+id)[0].value = val;
        } else {
            return { //if both parameters were undefined, returns this object.
                color: cmd.rgbToHex($('#'+id)[0].style['color']).toUpperCase(), 
                value: $('#'+id)[0].value,
            };
        }
    };
    $('#'+id).focus(function() {
        if(object().color == colors().purple) { //if this entry has been edited, by user or by function.
            previousTxt = object().value;
            object('');
        } else {
            object('', colors().purple);
        }
    }).blur(function() {
        if(object().color == colors().purple) { //purple if the entry was edited!
            if(undefined !== dbVal && '' !== dbVal && null !== dbVal) {
                if(object().value === '') {
                    object(undefined !== previousTxt ? previousTxt : dbVal);
                }
            } else {
                if(previousTxt !== defVal && undefined !== previousTxt) {
                    if(object().value === '') {
                        object(previousTxt, colors().purple);
                    }
                } else {
                    if(object().value === '') {
                        object(defVal, colors().gray);
                    }
                }
            }
        }
        previousTxt = undefined;
    });
}

function toggleTxtBx(id, txt) {
    if( $('#'+id)[0].value == txt ) {
        $('#'+id)[0].value = '';
        $('#'+id).css({
            'color': colors().purple,
        });
    } else {
        if( $('#'+id)[0].value === '' ) {
            $('#'+id)[0].value = txt;
            $('#'+id).css({
                'color': colors().gray,
            });
        }
    }
}
function getForm(id) {
    var retForm;
    $.each(forms, function () {
       if(this.id == id) {
           retForm = this;
       } 
    });
    return retForm;
}
function dynFoo(prop) {
    form = forms['foo'];
    form.id = 'foo'+prop.indx;
    form.children[0].text = prop.text;
    form.children[1].children[0].id = 'edit'+prop.indx;
    return form;
}
var forms = {
    createEventMinimal: {
        type: 'div',
        id: 'createForm',
        functions: [function () {
            $('#createForm').css({
                'font-family': 'sans-serif',
            });
        }],
        children: [
            { 
                type: 'textbox',  
                id: 'scheduleTitle',
                text: 'Schedule Title',
                onclick: "toggleTxtBx('scheduleTitle', 'Schedule Title')",
                onblur: "toggleTxtBx('scheduleTitle', 'Schedule Title')",
                functions: [function () {
                    $('#scheduleTitle').css({
                        'color': '#CCCCCC',
                    }); 
                }],
            },  
            {
                type: 'textbox',
                id: 'scheduleDescription',
                text: 'Schedule Description',
                onclick: "toggleTxtBx('scheduleDescription', 'Schedule Description')",
                onblur: "toggleTxtBx('scheduleDescription', 'Schedule Description')",
                functions: [function () {
                    $('#scheduleDescription').css({
                        'color': '#CCCCCC',
                    }); 
                }],
            },
            {
                type: 'div',
                id: 'mkSchedDtPkr',
                functions: [function () {
                    $('#mkSchedDtPkr').datepicker();
                }],
                children: [
                    {
                        type: 'div',
                        id: 'date',
                    },
                ]
            },
            { //holds the buttons.
                type: 'div',
                id: 'buttonContainer',
                functions: [function () {
                    $('#buttonContainer').css({
                        'width': '50%',
                        'float': 'left',
                    });
                }],
                children: [
                    { //submit button
                        type: 'button',
                        id: 'formSubmit',   
                        text: 'submit',
                        functions: [function() {
                            //All date fields need to exclude GMT.
                            $('#formSubmit').click(function () {
                                var obj = dataObjs.evntSchdl;
                                var dtObj = {
                                    added: new Date().toString(),
                                    filled: obj.dtOnLineFilledStartDate().toString(),
                                    schedule: $('#mkSchedDtPkr').datepicker('getDate').toString(),
                                    end: dataObjs.timeMidnight($('#mkSchedDtPkr').datepicker('getDate')).toString(),
                                }
                                obj.dtDateAdded = dtObj.added.substring(0, dtObj.added.indexOf('GMT') - 1);
                                obj.dtOnLineFilledStartDate = dtObj.filled.substring(0, dtObj.filled.indexOf('GMT') - 1);
                                obj.strScheduleTitle = $('#scheduleTitle')[0].value;
                                obj.strScheduleDescription = $('#scheduleDescription')[0].value;
                                obj.dtScheduleDate = dtObj.schedule.substring(0, dtObj.schedule.indexOf('GMT') - 1);
                                obj.dtOnLineFilledEndDate = dtObj.end.substring(0, dtObj.end.indexOf('GMT') - 1);
                                var jStr = JSON.stringify(obj);
                                var url = 'https://www.mypicday.com/Handlers/ScheduleCreateData.aspx?Data='+jStr;
                                console.log(url);
                                $sql(url).get(function(data){
                                    console.log(dataObjs.srvdTbls.EventSchedules);
                                    var parsed = JSON.parse(data);
                                    dataObjs.srvdTbls.EventSchedules[dataObjs.srvdTbls.EventSchedules.length] = parsed;
                                    $v('display-tbls').clear();
                                    cmd.events.drawJSON(dataObjs.srvdTbls);
                                    $.colorbox.close();
                                });
                            });
                        }]
                    },
                    { //cancel button
                        type: 'button',
                        id: 'formCancel',
                        text: 'cancel',
                        functions: [function () {
                            $('#formCancel').click(function () {
                                $.colorbox.close();//close the pop up and do nothing.
                            })
                        }]
                    }
                ]
            },
        ],        
    },
    
    mDiv: function (element) { //A generic mutable JSON Div.
        return {
            type: 'div',
            id: element.id,
            text: element.text,
            functions: [element.css, element.event],
            children: undefined !== element.children ? element.children : undefined,
        };
    },
    
    mTxt: function (element) { //A generic mutable JSON Text Box.
        return {
            type: 'textbox',
            id: element.id,
            text: element.text,
            functions: [element.css, element.event],
            children: undefined !== element.children ? element.children : undefined,
        };
    },
    
    genEvnt: function (prop) {
        return {
            type: 'div',
            id: undefined !== prop.id ? prop.id : undefined,
            class: undefined !== prop.class ? prop.class : undefined,
            text: undefined !== prop.text ? prop.text : undefined,
            functions: [function () {
                $('#'+prop.id).mouseover(function () {
                    $('#'+prop.id).css({
                        'background-color': '#3287CC',
                    });
                }).mouseout(function () {
                    if(prop.id != dataObjs.slctdObj) {
                        $('#'+prop.id).css({
                            'background-color': 'white',
                        });
                    }
                }).click(function() {
                    if(prop.id != dataObjs.slctdObj) {
                        $('.foo').each(function() {
                            $('#'+this.id).css({
                                'background-color': 'white',
                            });
                        });
                        cmd.create.times(prop.evntID); //had to be placed here, since if the user hit the edit menu, every menu item would produce a sql call.
                    }
                    $('#'+prop.id).css({
                        'background-color': '#3287CC',
                    });
                    dataObjs.slctdObj = prop.id;
                });
            }],
            children: [
                forms.mDiv({
                    id: prop.id + 'pt1',
                    text: '<div id="pt1Obj'+prop.id+'">' + (undefined !== prop.pt1.text ? prop.pt1.text : undefined) + '</div>',
                    css: function () {
                        $('#'+prop.id+'pt1').css({
                            'width': '45%',
                            'height': '50%',
                            'text-align': 'left',
                            'float': 'left',
                        });
                        $('#pt1Obj'+prop.id).css({
                            'padding-left': '10px',
                            'width': 'auto',
                        });
                    },
                    event: function () {
                        $('#pt1Obj'+prop.id+' u').click(function() {  //only when the text is clicked. jQuery wrapped the text object with <u></u>.
                            $('#pt1Obj'+prop.id).remove(); //remove for mutation.
                            console.log(prop);
                            appendHTML(forms.mTxt({ //mutates to this.
                                id: 'evntEditBx',
                                text: prop.pt1.raw,
                                css: function() {
                                    $('#evntEditBx').css({
                                        'width': 'inherit',
                                        'text-align': 'center',
                                        'color': colors().purple,
                                    });
                                },
                                event: function () {
                                    $('#evntEditBx').focus(function() {
                                        $('#evntEditBx')[0].value = '';
                                        dataObjs.slctdObj = prop.id+'pt1';
                                    }).blur(function () {
                                        if($('#evntEditBx')[0].value != prop.pt1.raw && $('#evntEditBx')[0].value !== '') {
                                            $v().events()[prop.indx].strScheduleTitle = $('#evntEditBx')[0].value; //edit object title.
                                            cmd.update(prop.indx); //comment out if debugging so db wont be hit. <-- saves current state to the db.
                                        } else {
                                            $('#evntEditBx').remove(); //if no changes to be made, simply return the original object state.
                                            appendHTML(forms.genEvnt(prop).children[0], prop.id + 'pt1'); //add back original object.
                                        }
                                    });
                                }
                            }), prop.id+"pt1");
                            $('#evntEditBx').focus();
                        });
                    }
                }),

                {
                    type: 'div',
                    id: prop.id + 'pt15',
                    functions: [function () {
                        var d = new Date(prop.pt15.text.substring(0, prop.pt15.text.indexOf('T')));
                        d = d.toDateString();
                        $('#'+prop.id+'pt15').css({
                            'width': '25%',
                            'height': '50%',
                            'text-align': 'left',
                            'float': 'left',
                        });
                        appendHTML({ //strange bug, cannot use jQuery append function directly here, must use appendHTML.
                            type: 'div', //div that opens the date picker.
                            id: 'pt1Date'+prop.id,
                            text: '<a>' + d + '</a>', //surround in a tags for jQuery to know exactly what to grab.
                            functions:[function () {
                                $('#pt1Date'+prop.id+' a').click(function() { //opens date picker object when the text is clicked.
                                    $.colorbox({html: '<div id="cbDateEdit"></div>', width: '350', height: '410px'});
                                    appendHTML(forms['datePicker'](prop.indx), 'cbDateEdit');
                                });
                            }]
                        }, prop.id+'pt15');
                    }]
                },
                
                {
                    type: 'div',
                    id: prop.id + 'pt2',
                    text: undefined !== prop.pt2.text ? '<a>'+prop.pt2.text+'</a>' : undefined,
                    functions: [function () {
                        $('#'+prop.id+'pt2 a').click(function() {
                            $v().events()[prop.indx].blnActive = !($v().events()[prop.indx].blnActive);
                            cmd.update(prop.indx);
                        });
                        $('#'+prop.id+'pt2').css({
                            'width': '20%',
                            'height': '50%',
                            'float': 'right',
                        });
                        $('#'+prop.id + 'pt2').append(parseMenu(genMenObj({
                            title: 'edit', 
                            id: 'Edit'+prop.indx,
                            width: '100%',
                            index: prop.indx,
                        })));
                        $('#Edit'+prop.indx).menu({
                            theme: 'theme-default',
                            transition: 'inside-slide-fade-left',
                        });

                    }],
                    children: undefined !== prop.pt2.children ? prop.pt2.children : undefined,
                },
                
                forms.mDiv({
                    id: prop.id + 'pt0',
                    text: '<div id="description'+prop.id+'"><a>' + (undefined !== prop.pt0.text ? prop.pt0.text : undefined) + '</a></div>',
                    css: function () {
                        $('#'+prop.id+'pt0').css({
                            'width': '100%',
                            'height': '50%',
                            'text-align': 'left',
                            'float': 'left',
                            'padding-left': '10px',
                        });
                    },
                    event: function () {
                        $('#description'+prop.id+' a').click(function () {
                            $('#description'+prop.id).remove(); //remove for mutation.
                            //console.log(prop);
                            appendHTML(forms.mTxt({ //mutates to this.
                                id: 'descriptEditBx',
                                text: prop.pt0.raw,
                                css: function() {
                                    $('#descriptEditBx').css({
                                        'width': '70%',
                                        'text-align': 'center',
                                        'color': colors().purple,
                                    });
                                },
                                event: function () {
                                    $('#descriptEditBx').focus(function() {
                                        $('#descriptEditBx')[0].value = '';
                                        dataObjs.slctdObj = prop.id+'pt0';
                                    }).blur(function () {
                                        if($('#descriptEditBx')[0].value != prop.pt0.raw && $('#descriptEditBx')[0].value !== '') {
                                            $v().events()[prop.indx].strScheduleDescription = $('#descriptEditBx')[0].value; //edit object description.
                                            cmd.update(prop.indx); //comment out if debugging so db wont be hit. <-- saves current state to the db.
                                        } else {
                                            $('#descriptEditBx').remove(); //if no edits to be made, just return the original state.
                                            appendHTML(forms.genEvnt(prop).children[3], prop.id + 'pt0'); //add back original object.
                                        }
                                    });
                                }
                            }), prop.id+"pt0");
                            $('#descriptEditBx').focus();
                        });
                    }
                }),
            ]
        };
    },
    
    datePicker: function (indx) {
        return {
            type: 'div',
            id: 'dpkrContainer',
            children: [
                {
                    type: 'div',
                    id: 'dpkr',
                    text: '<h4>Pick your start date.</h4>',
                    functions: [function () {
                        $('#dpkr').datepicker();
                        $('#dpkr').css({
                            'text-align': 'center',
                            'font-family': 'sans-serif',
                            'color': '#5233A6',
                        });
                    }],
                },
                {
                    type: 'div',
                    id: 'btnContainer',
                    children: [
                        {
                            type: 'button',
                            id: 'dpkrBtn',
                            text: 'submit',
                            functions: [function () {
                                $('#dpkrBtn').click(function(){
                                    var d = dataObjs.clearTime(new Date($('#dpkr').datepicker('getDate')));
                                    console.log(d);
                                    $v().events()[indx].dtScheduleDate = d;
                                    $v().events()[indx].dtOnLineFilledEndDate = dataObjs.timeMidnight(d);
                                    cmd.update(indx);
                                    $.colorbox.close();
                                });
                            }],
                        },  
                        {
                            type: 'button',
                            id: 'dpkrCancelBtn',
                            text: 'cancel',
                            functions: [function() {
                                $('#dpkrCancelBtn').click(function() {
                                    $.colorbox.close();//close the pop up and do nothing.
                                })
                            }]
                        }
                    ],
                },
            ],
        };
    },
    
    confirmPopUp: function(properties) {
        return {
            type: 'div',
            id: 'cbDel',
            class: 'container',
            text: properties.text,
            children: [
                {
                    type: 'button',
                    id: 'btnOk',
                    text: 'Yes',
                    functions: [function() {
                        $('#btnOk').click(function () {
                            properties.func(); //execute the defined function on click.
                        });
                    }],
                },
                {
                    type: 'button',
                    id: 'btnCancel',
                    text: 'Cancel',
                    functions: [function () {
                        $('#btnCancel').click(function() {
                            $.colorbox.close();//close the pop up and do nothing.
                        });
                    }],
                }
            ],
        };
    },
    
    editTitle: function (indx) {
        return {
            type: 'div',
            id: 'cbTitleEdit',
            text: '<h4 style="text-align: center">Insert New Title</h4>',
            children: [
                {
                    type: 'textbox',
                    id: 'titleEditTB',
                    text: 'Enter new Title',
                    functions: [function () {
                        $('#titleEditTB').focus(function () {
                            if($('#titleEditTB')[0].value == 'Enter new Title') {
                                $('#titleEditTB')[0].value = '';
                            }
                        }).blur(function () {
                            if($('#titleEditTB')[0].value === '') {
                                $('#titleEditTB')[0].value = 'Enter new Title';
                            }
                        }).css({
                            'color': 'gray',
                        });
                    }]
                },
                {
                    type: 'button',
                    id: 'titleEditSubmitBtn',
                    text: 'replace',
                    functions: [function () {
                        $('#titleEditSubmitBtn').click(function () {
                            if($('#titleEditTB')[0].value !== '') {
                                $v().events()[indx].strScheduleTitle = $('#titleEditTB')[0].value;
                                cmd.update(indx);
                                $.colorbox.close();
                            }
                        });
                    }]
                },
                {
                    type: 'button',
                    id: 'titleEditCancelBtn',
                    text: 'cancel',
                    functions: [function () {
                        $('#titleEditCancelBtn').click(function () {
                            $.colorbox.close();
                        });
                    }]
                }
            ]
        };
    },
    
    editDescription: function (indx) {
        return {
            type: 'div',
            id: 'cbDescriptionEdit',
            text: '<h4 style="text-align: center">Insert New Description</h4>',
            children: [
                {
                    type: 'textbox',
                    id: 'descriptionEditTB',
                    text: 'Enter new Description',
                    functions: [function () {
                        $('#descriptionEditTB').focus(function () {
                            if($('#descriptionEditTB')[0].value == 'Enter new Description') {
                                $('#descriptionEditTB')[0].value = '';
                            }
                        }).blur(function () {
                            if($('#descriptionEditTB')[0].value === '') {
                                $('#descriptionEditTB')[0].value = 'Enter new Description';
                            }
                        }).css({
                            'color': 'gray',
                        });
                    }],
                },
                {
                    type: 'button',
                    id: 'descriptionEditSubmitBtn',
                    text: 'replace',
                    functions: [function () {
                        $('#descriptionEditSubmitBtn').click(function () {
                            if($('#descriptionEditTB')[0].value !== '') {
                                $v().events()[indx].strScheduleDescription = $('#descriptionEditTB')[0].value;
                                cmd.update(indx);
                                $.colorbox.close();
                            }
                        });
                    }]
                },
                {
                    type: 'button',
                    id: 'descriptionEditCancelBtn',
                    text: 'cancel',
                    functions: [function () {
                        $('#descriptionEditCancelBtn').click(function () {
                            $.colorbox.close();
                        });
                    }],
                },
            ],
        };
    },
    
    defaultEvntTime: { 
        type: 'div',
        id: 'defaultEvent',
        class: 'fooTimes',
        functions:[function() {
            $('#defaultEvent').css({
                'border-top': '1px solid '+colors().darkBlue,
                'background-color': '#C5CCD9',
                'height': '26px',
                'margin-top': '10px',
            });
        }],
        children: [
            {
                type: 'div',
                id: 'statusContainer',
                functions: [function() {
                    $('#statusContainer').css({
                        'float': 'left',
                        //'border': '1px solid black',
                        'text-align': 'center',
                        'width': '30px',
                        'height': 'auto',
                    });
                }],
                children: [
                    {
                        type: 'checkbox',
                        id: 'chkdIn',
                        functions: [function() {
                            $('#chkdIn').prop('checked', true);
                        }]
                    },
                ]
            },

            {
                type: 'div',
                id: 'resrvd',
                text: '<b>R</b>',
                functions: [function() {
                    $('#resrvd').css({
                        'color': 'white',
                        'background-color': colors().blue,//'#D6B318'
                        'border': '1px solid '+colors().darkBlue,
                        'border-radius': '5px',
                        'text-align': 'center',
                        'width': '25px',
                        'height': '23px',
                        'float': 'left',
                    });
                }]
            },

            {
                type: 'div',
                id: 'timebox',
                text: 'Time',
                functions: [function() {
                    $('#timebox').css({
                        'color': 'black',
                        'width': '100px',
                        'text-align': 'center',
                        'float': 'left',
                    });
                }]
            }, 

            {
                type: 'div',
                id: 'namebx',
                text: 'Group Name',
                functions: [function() {
                    $('#namebx').css({
                        'color': 'black',
                        'width': '100px',
                        'text-align': 'center',
                        'float': 'left'
                    });
                }]
            },

            {
                type: 'div',
                id: 'division',
                text: 'division',
                functions: [function() {
                    $('#division').css({
                        'color': 'black',
                        'width': '100px',
                        'text-align': 'center',
                        'float': 'left'
                    });
                }]
            },

            {
                type: 'div',
                id: 'defaultCoach',
                text: 'coach',
                functions: [function() {
                    $('#defaultCoach').css({
                        'color': 'black',
                        'width': '100px',
                        'text-align': 'center',
                        'float': 'left'
                    });
                }]
            },

            {
                type: 'div',
                id: 'defaultID',
                text: '#',
                functions: [function() {
                    $('#defaultID').css({
                        'color': 'black',
                        'width': '100px',
                        'text-align': 'center',
                        'float': 'left'
                    });
                }]
            },

            {
                type: 'div',
                id: 'btnAddTimeToEvent',
                text: 'Add times',
                functions: [function() {
                    $('#btnAddTimeToEvent').css({
                        'border-radius': '5px',
                        'background-color': colors().blue,
                        'border': '1px solid '+colors().darkBlue,
                        'margin-right': '5px',
                        'color': 'white',
                        'width': '100px',
                        'height': '23px',
                        'float': 'right',
                        'cursor': 'pointer',
                    });
                    $('#btnAddTimeToEvent').click(function() {
                        $.colorbox({html: '<div id="tmp"></div>', width: '350px', height: '400px'});
                        appendHTML(forms['addTimeForm']({
                            indx: 0,
                        }), 'tmp');                    
                    });
                }]
            }

        ]
    },

    defEvntTimes: function (options) {
        return {
            type: 'div',
            id: 'fooTimes' + options.cnt,
            class: 'fooTimes',
            functions:[function() {
                $('#fooTimes'+options.cnt).mouseover(function() {
                    $('#fooTimes'+options.cnt).css({
                        'background-color': '#3287CC',
                        //'border-bottom': '1px solid #32B7CC',
                    });
                }).mouseout(function() {
                    $('#fooTimes'+options.cnt).css({
                        'background-color': 'white',
                        //'border-bottom': '1px solid black',
                    });
                }).css({
                    'height': '26px',
                });
            }],
            children: [
                {
                    type: 'div',
                    id: 'statusContainer' + options.cnt,
                    functions: [function() {
                        $('#statusContainer' + options.cnt).css({
                            'float': 'left',
                            //'border': '1px solid black',
                            'text-align': 'center',
                            'width': '30px',
                            'height': 'auto',
                        });
                    }],
                    children: [
                        {
                            type: 'checkbox',
                            id: 'chkdIn' + options.cnt,
                            functions: [function() {
                                if(undefined !== options.checked) {
                                    if(options.checked) {
                                        $('#chkdIn'+options.cnt).prop('checked', true);
                                    }
                                }
                            }]
                        },
                    ]
                },

                {
                    type: 'div',
                    id: 'resrvd' + options.cnt,
                    text: '<b>R</b>',
                    functions: [function() {
                        if(undefined !== options.reserved) {
                            $('#resrvd'+options.cnt).css({
                                'color': 'white',
                                'background-color': colors().blue,
                                'border-radius': '5px',
                                'border': ('1px solid '+colors().darkBlue),
                                'text-align': 'center',
                                'width': '25px',
                                'height': '23px',
                                'float': 'left',
                            });
                        } else {
                            $('#resrvd'+options.cnt).remove();
                        }
                    }]
                },

                {
                    type: 'div',
                    id: 'fooTopRow' + options.cnt,
                    functions: [function() {
                        $('#fooTopRow' + options.cnt).css({
                            //'float': 'left',
                            'text-align': 'left',
                            'width': 'auto',
                            'height': 'auto',
                            //'border-radius': '5px',
                        });
                    }],
                    children: [
                        {
                            type: 'textbox',
                            id: 'txtBxTime' + options.cnt,
                            class: 'txtBxTimes',
                            text: 'time',
                            functions: [function() {
                                var time = undefined !== options.time ? options.time.substring(options.time.indexOf('T')+1, options.time.length) : undefined;
                                tgglTxtBx('txtBxTime' + options.cnt, time, 'time');
                                if(undefined !== options.time && '' !== options.time && null !== options.time) {
                                    $('#txtBxTime'+options.cnt)[0].value = time;
                                    //tgglTxtBx('txtBxTime' + options.cnt);
                                    $('#txtBxTime'+options.cnt).css({
                                        'color': colors().purple,
                                    });
                                }
                            }]
                        },

                        {
                            type: 'textbox',
                            id: 'txtBxName' + options.cnt,
                            class: 'txtBxTimes',
                            text: 'name',
                            functions: [function() {
                                tgglTxtBx('txtBxName'+options.cnt, options.name, 'name');
                                //console.log(options.name);
                                if(undefined !== options.name && '' !== options.name && null !== options.name) {
                                    $('#txtBxName'+options.cnt)[0].value = options.name;
                                    //tgglTxtBx('txtBxName' + options.cnt);
                                    $('#txtBxName'+options.cnt).css({
                                        'color': colors().purple,
                                    });
                                }
                            }]
                        },

                        {
                            type: 'textbox',
                            id: 'txtBxDivision' + options.cnt,
                            class: 'txtBxTimes',
                            text: 'division',
                            functions: [function() {
                                tgglTxtBx('txtBxDivision'+options.cnt, options.division, 'division');
                                if(undefined !== options.division && '' !== options.division && null !== options.division) {
                                    $('#txtBxDivision'+options.cnt)[0].value = options.division;
                                    //tgglTxtBx('txtBxDivision'+options.cnt);
                                    $('#txtBxDivision'+options.cnt).css({
                                        'color': colors().purple,
                                    });
                                }
                            }]
                        },

                        {
                            type: 'textbox',
                            id: 'txtBxCoach' + options.cnt,
                            class: 'txtBxTimes',
                            text: 'coach',
                            functions: [function() {
                                tgglTxtBx('txtBxCoach'+options.cnt, options.coach, 'coach');
                                if(undefined !== options.coach && '' !== options.coach && null !== options.coach) {
                                    $('#txtBxCoach' + options.cnt)[0].value = options.coach;
                                    //tgglTxtBx('txtBxCoach'+options.cnt);
                                    $('#txtBxCoach'+options.cnt).css({
                                        'color': colors().purple,
                                    });
                                }
                            }]
                        },

                        {
                            type: 'textbox',
                            id: 'txtBxID' + options.cnt,
                            class: 'txtBxTimes',
                            text: "0",
                            functions: [function() {
                                tgglTxtBx('txtBxID'+options.cnt, options.id, "0");
                                $('#txtBxID' + options.cnt).css({
                                    'width': '60px',
                                });
                                //if not undefined, not empty string, not null, not 0
                                if(undefined !== options.id && '' !== options.id && null !== options.id && 0 !== options.id) {
                                    $('#txtBxID'+options.cnt)[0].value = options.id;
                                    $('#txtBxID'+options.cnt).css({
                                        'color': colors().purple,
                                    });
                                }
                            }]
                        },

                        {
                            type: 'div',
                            id: 'closeBtn' + options.cnt,
                            class: 'maxMinBtn',
                            text: '<b>X</b>',
                            functions: [function() {
                                $('#closeBtn'+options.cnt).css({
                                    'background-color': 'red',
                                });
                            }]
                        },

                        {
                            type: 'div',
                            id: 'maximizeBtn' + options.cnt,
                            class: 'maxMinBtn',
                            text: '<b>[_]</b>',
                            functions: [function() {
                                $('#maximizeBtn' + options.cnt).css({
                                    'background-color': 'green',
                                });
                            }]
                        },

                    ],
                },
            ],
        };
    },
    
    addTimeForm: function(obj) {
        return {
            type: 'div',
            id: 'addTimeDiv' + obj.indx,
            functions:[function() {
                $('#addTimeDiv'+obj.indx).css({
                    'width': '100%', //100% of colorbox size.
                    'height': '100%', //100% of colorbox size.
                    'font-family': 'sans-serif',
                    'text-align': 'center',
                }); 
            }],
            children: [
                { //header
                    type: 'div',
                    text: '<h3> Add schedule time </h3>'
                },
                {
                    type: 'div',
                    id: 'textboxContainer',
                    functions:[function () {
                        $('#textboxContainer').css({
                            'width': '200px',
                            'text-align': 'left',
                            'margin-left': '30px',
                        })
                    }],
                    children: [
                        { //blnOnlineFilledAllowed
                            type: 'checkbox',
                            id: 'reservedCheckBox',
                            text: 'reservation?',
                            functions: [function () {
                                $('#reservedCheckBox').click(function () {
                                    //if checked, hide all objects that do not have to do with a reservation object.
                                    //else, show all objects that have to do with a static object.
                                    if($('#reservedCheckBox')[0].checked) {
                                        $('#groupNameBox').hide();
                                        $('#divisionBox').hide();
                                        $('#coachBox').hide();
                                        $('#groupInstructorBox').hide();
                                        $('#groupCodeBox').hide();
                                    } else {
                                        $('#groupNameBox').show();
                                        $('#divisionBox').show();
                                        $('#coachBox').show();
                                        $('#groupInstructorBox').show();
                                        $('#groupCodeBox').show();
                                    }
                                })
                            }]
                        },
                        {//StrGroupName
                            type: 'textbox',
                            id: 'groupNameBox',
                            text: 'Group Name',
                            functions:[function () {
                                $('#groupNameBox').css({
                                    //set colors and stuff
                                    'text-align': 'center',
                                });
                                $('#groupNameBox').focus(function() {
                                    //change color to purple, and clear text box
                                }).blur(function () {
                                    //change color back to default if no new data was entered.
                                    //else keep the color purple.
                                });
                            }]
                        },
                        {//strGroupInstructor
                            type: 'textbox',
                            id: 'groupInstructorBox',
                            class: 'txtCenter',
                            text: 'Group Instructor',
                            //functions:[],
                        },
                        {//strOrganizationEventGroupCode
                            type: 'textbox',
                            id: 'groupCodeBox',
                            class: 'txtCenter',
                            text: 'Group Code',
                            //functions: [],
                        },
                        {//StrGroupDivision
                            type: 'textbox',
                            id: 'divisionBox',
                            class: 'txtCenter',
                            text: 'Group Division',
                            functions: [function () {
                                $('#divisionBox').focus(function() {
                                    //change color to purple, and clear text box.
                                }).blur(function() {
                                    //change color back to default if no new data was entered.
                                    //else keep the color purple.
                                });
                            }]
                        },
                        {//dtDateTime <--update time part.
                            type: 'textbox',
                            id: 'timeBox',
                            class: 'txtCenter',
                            name: 'time',
                            text: 'time',
                            functions: [function () {
                                $('input[name="time"]').ptTimeSelect();
                                $('#timeBox').focus(function () {
                                    //change color to purple, and clear the box.
                                    $('#cboxOverlay').css({ //so the time select will appear over the shadow.
                                        'z-Index': '8',
                                    });
                                    $('#colorbox').css({ //so the time select will appear over the colorbox.
                                        'z-Index': '9',
                                    });
                                }).blur(function () {
                                    //change color back to default if no new data was entered.
                                    //check the time format, format correctly if possible, throw error else.
                                    //else keep the color purple.
                                });
                            }]
                        },
                        {//input name of coach.
                            type: 'textbox',
                            id: 'coachBox',
                            class: 'txtCenter',
                            text: 'Coach',
                            functions: [function () {
                            }],
                        },
                        {//input how many are participating.
                            type: 'spinner',
                            id: 'numParticipantsSpnr',
                            text: 'Participants',
                            min: 0,
                            max: 10000,
                            functions: [function () {
                                $('#numParticipantsSpnr')[0].value = "0";
                            }]
                        },
                        {//how many times to repeat the data.
                            type: 'spinner',
                            id: 'duplicateSpnr',
                            text: 'copies:',
                            min: 0,
                            max: 30,
                            functions: [function () {
                                $('#duplicateSpnr')[0].value = "1";
                            }]
                        },
                    ]
                },
                {
                    type: 'div',
                    id: 'buttonContainer',
                    //functions: [],
                    children: [
                        {//submit the form.
                            type: 'button',
                            id: 'submitBtn',
                            text: 'submit',
                            functions: [function () {
                                $('#submitBtn').click(function() {
                                    //submit the form data to the data base... make sure to pull the selected object div id.
                                });
                            }]
                        },
                        {//close the colorbox, ignore everything.
                            type: 'button',
                            id: 'cancelBtn',
                            text: 'cancel',
                            functions: [function () {
                                $('#cancelBtn').click(function () {
                                    //close the colorbox.
                                    $.colorbox.close();
                                });
                            }]
                        },
                    ]
                },
                
            ],
        };
    }
};

function defaultColorbox(id, obj, dimens) {
    console.log(id);
    console.log(forms[obj]);
    console.log(dimens);
    $.colorbox({html:'<div id="'+id+'"></div>', width: dimens.width, height: dimens.height});
    appendHTML(forms[obj], id);
}
