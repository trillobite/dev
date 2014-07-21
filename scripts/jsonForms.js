/*
    File: jsonForms.js
    Description: Contains all of the json type objects which will be converted into html.
                 they are templates aka "Forms."
*/
var colors = function() { //depricated use $p('color');
    return {
        blue: $p('blue'),
        darkBlue: $p('darkBlue'),
        purple: $p('purple'),
        gray: $p('gray'),
    };
};

var dpToggle = 1;

var previousTxt;
//this function is for the schedule time textboxes.
function tgglTxtBx(id, dbVal, defVal, updateEnabled) {
    var object = function (val, color) { //getter setter awesomeness!!!
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

    var focus = function() {
        dataObjs.slctdDiv = id;
        if(object().color == $p('purple')) { //if this entry has been edited, by user or by function.
            previousTxt = object().value;
            //object('');
        } else {
            object('', $p('purple'));
        }
        //$('#'+id).select(); //so that the text (time) is hilighted.
    };

    var blur = function() {
        if(object().color == $p('purple')) { //purple if the entry was edited!
            if(undefined !== dbVal && '' !== dbVal && null !== dbVal) {
                if(object().value === '') {
                    object(undefined !== previousTxt ? previousTxt : dbVal);
                }
            } else {
                if(previousTxt !== defVal && undefined !== previousTxt) {
                    if(object().value === '') {
                        object(previousTxt, $p('purple'));
                    }
                } else {
                    if(object().value === '') {
                        object(defVal, $p('gray'));
                    }
                }
            }
        }
        if(updateEnabled) {
            if(previousTxt != object().value && dbVal != object().value) {
                if('' !== previousTxt && '' !== object().value && object().value != previousTxt && object().value != defVal) { //if it's been edited and does not match the db.
                    object(object().value, $p('red'));
                }
            } 
        }
        previousTxt = undefined;
    };
    var hasfocus = false;
    $('#'+id).focus(function() {
        focus();
        //hasfocus = true;
        //$('#'+id).select();
    }).blur(function() {
        blur();
        hasfocus = false;
    }).click(function() {
        if(!hasfocus) {
            $('#'+id).select();
            hasfocus = false;
        }
        hasfocus = true;
    });
}

function toggleTxtBx(id, txt) {
    if( $('#'+id)[0].value == txt ) {
        //$('#'+id)[0].value = '';
        $('#'+id).css({
            'color': $p('purple'),
        });
    } else {
        if( $('#'+id)[0].value === '' ) {
            $('#'+id)[0].value = txt;
            $('#'+id).css({
                'color': $p('gray'),
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
    createEventMinimal: function() { //converted to jsonHTML v0.8-beta standard.
        return $jConstruct('div', {
            id: 'createForm',
        }).css({
            'font-family': 'sans-serif',
        }).addChild(function() {
            return $jConstruct('textbox', {
                id: 'scheduleTitle',
                text: 'Schedule Title',
            }).css({
                'color': $p('gray'),
            }).event('click', function() {
                toggleTxtBx('scheduleTitle', 'Schedule Title');
            }).event('blur', function() {
                toggleTxtBx('scheduleTitle', 'Schedule Title');
            });
        }).addChild(function() {
            return $jConstruct('textbox', {
                id: 'scheduleDescription',
                text: 'Schedule Description',
            }).css({
                'color': $p('gray'),
            }).event('click', function() {
                toggleTxtBx('scheduleDescription', 'Schedule Description');
            }).event('blur', function() {
                toggleTxtBx('scheduleDescription', 'Schedule Description');
            });
        }).addChild(function() {
            return $jConstruct('div', {
                id: 'mkSchedDtPkr',
            }).addFunction(function() {
                $('#mkSchedDtPkr').datepicker();
            }).addChild(function() {
                return $jConstruct('div', {
                    id: 'date',
                });
            });
        }).addChild(function() {
            return $jConstruct('div', {
                id: 'buttonContainer',
            }).css({
                'width': '50%',
                'float': 'left',
            }).addChild(function() {
                return $jConstruct('button', {
                    id: 'formSubmit',
                    text: 'submit',
                }).event('click', function() {
                    var obj = dataObjs.evntSchdl;
                    var t = cmd.time;

                    obj.dtDateAdded = t.today().toISOString();
                    obj.dtOnLineFilledStartDate = t.midnightAm(t.today()).toISOString(); //12:00AM
                    obj.strScheduleTitle = $('#scheduleTitle')[0].value;
                    obj.strScheduleDescription = $('#scheduleDescription')[0].value;
                    obj.dtScheduleDate = $('#mkSchedDtPkr').datepicker('getDate').toISOString();
                    obj.dtOnLineFilledEndDate = t.midnightPm($('#mkSchedDtPkr').datepicker('getDate')).toISOString(); //11:55PM

                    var url = 'https://www.mypicday.com/Handlers/ScheduleCreateData.aspx?Data='+JSON.stringify(obj);
                    $sql(url).get(function(data){
                        var parsed = JSON.parse(data);
                        dataObjs.srvdTbls.EventSchedules[dataObjs.srvdTbls.EventSchedules.length] = parsed;
                        $v('display-tbls').clear();
                        cmd.events.drawJSON(dataObjs.srvdTbls);
                        $.colorbox.close();
                    });
                });
            }).addChild(function() {
                return $jConstruct('button', {
                    id: 'formCancel',
                    text: 'cancel',
                }).event('click', function() {
                    $.colorbox.close();
                });
            });
        });
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
                if(dataObjs.slctdObj == prop.id) { //if there was an update, the object would be hilighted blue.
                    $('#'+prop.id).css({
                        'background-color': $p('gray'),
                    });
                }
                $('#'+prop.id).mouseover(function () {
                    $('#'+prop.id).css({
                        'background-color': $p('blue'),
                    });
                }).mouseout(function () {
                    if(prop.id != dataObjs.slctdObj) {
                        $('#'+prop.id).css({
                            'background-color': 'white',
                        });
                    }
                }).click(function() {
                    cmd.scheduleFocus(prop.id, prop.evntID);
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
                            appendHTML(forms.mTxt({ //mutates to this.
                                id: 'evntEditBx',
                                text: prop.pt1.raw,
                                css: function() {
                                    $('#evntEditBx').css({
                                        'width': 'inherit',
                                        'text-align': 'left',
                                        'color': $p('purple'),
                                    });
                                },
                                event: function () {
                                    $('#evntEditBx').focus(function() {
                                        //$('#evntEditBx')[0].value = '';
                                        $('#evntEditBx').select();
                                        dataObjs.slctdObj = prop.id+'pt1';
                                    }).blur(function () {
                                        if($('#evntEditBx')[0].value != prop.pt1.raw && $('#evntEditBx')[0].value !== '') {
                                            $v().events()[prop.indx].strScheduleTitle = $('#evntEditBx')[0].value; //edit object title.
                                            cmd.update(prop.indx, prop.id); //comment out if debugging so db wont be hit. <-- saves current state to the db.
                                        } else {
                                            $('#evntEditBx').remove(); //if no changes to be made, simply return the original object state.
                                            appendHTML(forms.genEvnt(prop).children[0], '#'+prop.id+"pt1"); //add back original object.
                                        }
                                    });
                                }
                            }), '#'+prop.id+"pt1");
                            $('#evntEditBx').focus();
                        });
                    }
                }),

                {
                    type: 'div',
                    id: prop.id + 'pt15',
                    functions: [function () {
                        $('#'+prop.id+'pt15').css({
                            'width': '25%',
                            'height': '50%',
                            'text-align': 'left',
                            'float': 'left',
                        });
                        appendHTML({ //strange bug, cannot use jQuery append function directly here, must use appendHTML.
                            type: 'div', //div that opens the date picker.
                            id: 'pt1Date'+prop.id,
                            text: '<a>' + prop.pt15.text + '</a>', //surround in a tags for jQuery to know exactly what to grab.
                            functions:[function () {
                                $('#pt1Date'+prop.id+' a').click(function() { //opens date picker object when the text is clicked.
                                    $.colorbox({html: '<div id="cbDateEdit"></div>', width: '350', height: '410px'});
                                    appendHTML(forms['datePicker'](prop.indx), '#cbDateEdit');
                                });
                            }]
                        }, '#'+prop.id+'pt15');
                    }]
                },
                
                //the close button
                $jConstruct('div', {
                    id: prop.id + 'pt2',
                    text: undefined !== prop.pt2.text ? '<a>'+prop.pt2.text+'</a>' : undefined,
                }).addChild(
                    $jConstruct('div', {
                        id: 'btnRemove' + prop.id,
                        class: 'maxMinBtn',
                        text: '<b>X</b>',
                    }).event('click', function() {
                        console.log('close button clicked!', prop.indx);
                        confirmDel(prop.indx);
                    }).css({
                        'background-color': 'red',
                    })
                ).event('click', function() {
                    $v().events()[prop.indx].blnActive = !($v().events()[prop.indx].blnActive);
                    cmd.update(prop.indx);
                }).css({
                    'width': '20%',
                    'height': '50%',
                    'float': 'right',
                }),
                
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
                            appendHTML(forms.mTxt({ //mutates to this.
                                id: 'descriptEditBx',
                                text: prop.pt0.raw,
                                css: function() {
                                    $('#descriptEditBx').css({
                                        'width': '70%',
                                        'text-align': 'left',
                                        'color': $p("purple"),
                                    });
                                },
                                event: function () {
                                    $('#descriptEditBx').focus(function() {
                                        /*$('#descriptEditBx')[0].value = '';*/
                                        $('#descriptEditBx').select();
                                        dataObjs.slctdObj = prop.id+'pt0';
                                    }).blur(function () {
                                        if($('#descriptEditBx')[0].value != prop.pt0.raw && $('#descriptEditBx')[0].value !== '') {
                                            $v().events()[prop.indx].strScheduleDescription = $('#descriptEditBx')[0].value; //edit object description.
                                            cmd.update(prop.indx); //comment out if debugging so db wont be hit. <-- saves current state to the db.
                                        } else {
                                            $('#descriptEditBx').remove(); //if no edits to be made, just return the original state.
                                            appendHTML(forms.genEvnt(prop).children[3], '#' + prop.id + 'pt0'); //add back original object.
                                        }
                                    });
                                }
                            }), '#' + prop.id+"pt0");
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
                            'color': $p('purple'),
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
                                    $v().events()[indx].dtScheduleDate = $dt.write(d);
                                    $v().events()[indx].dtOnLineFilledEndDate = $dt.write(dataObjs.timeMidnight(d));
                                    cmd.update(indx, $v().events()[indx].indxScheduleID); //updates the data, second parameter focuses the object.
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
        return $jConstruct('div', {
                id: 'cbDel',
                class: 'container',
                text: properties.text,
            }).addChild($jConstruct('button', { //The Yes button
                id: 'btnOk',
                text: 'Yes',
            }).event('click', function() {
                properties.func();
            })).addChild($jConstruct('button', { //The Cancel button
                id: 'btnCancel',
                text: 'Cancel',
            }).event('click', function() {
                $.colorbox.close();
            }));
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
                            'color': $p('gray'),
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
                            'color': $p('gray'),
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
                'border-top': '1px solid '+$p('darkBlue'),
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
                        'background-color': $p('blue'),//'#D6B318'
                        'border': '1px solid '+$p('darkBlue'),
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
                        'width': '155px',
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
                        'width': '45px',
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
                        'background-color': $p('blue'),
                        'border': '1px solid '+$p('darkBlue'),
                        'margin-right': '5px',
                        'color': 'white',
                        'width': '100px',
                        'height': '23px',
                        'float': 'right',
                        'cursor': 'pointer',
                    });
                    $('#btnAddTimeToEvent').click(function() {
                        $.colorbox({html: '<div id="tmp"></div>', width: '350px', height: '450px'});
                        appendHTML(forms['addTimeForm']({
                            indx: 0,
                        }), '#tmp');                    
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
                        'background-color': $p('blue'),
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
                                        $('#chkdIn'+options.cnt).toggle(this.checked);
                                    }
                                }
                            }]
                        },
                    ]
                },

                {
                    type: 'div',
                    id: 'resrvd' + options.cnt,
                    class: 'reservationKey',
                    text: '<b>R</b>',
                    functions: [function() {
                        if(undefined !== options.reserved) {
                            if(options.reserved) { //switches the color of the reservation key.
                                $('#resrvd'+options.cnt).css({
                                    'background-color': $p('blue'),
                                    'border': ('1px solid '+$p('darkBlue')),
                                });
                            } else {
                                $('#resrvd'+options.cnt).css({
                                    'background-color': $p('gray'),
                                    'border': ('1px solid'+$p('darkBlue')),
                                });
                            }
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
                        { //dtDateTime
                            type: 'textbox',
                            id: 'txtBxTime' + options.cnt,
                            class: 'txtBxTimes',
                            text: 'time',
                            functions: [function() {
                                var date = new Date($dt.read(options.time));
                                tgglTxtBx('txtBxTime' + options.cnt, $dt.write(date).toLocaleTimeString(), 'time', true);
                                if(undefined !== $dt.read(options.time) && '' !== $dt.read(options.time) && null !== $dt.read(options.time)) {
                                    $('#txtBxTime'+options.cnt)[0].value = $dt.write(date).toLocaleTimeString();
                                    $('#txtBxTime'+options.cnt).css({
                                        'color': $p('purple'),
                                    });
                                }
                                $('#txtBxTime'+options.cnt).blur(function () {
                                    if($dt.write(date).toLocaleTimeString() != $('#txtBxTime'+options.cnt)[0].value) {
                                        //var dtTime = $dt.parse($('#txtBxTime5')[0].value);
                                        var dtTime = $dt.parse($('#txtBxTime'+options.cnt)[0].value);
                                        if(cmd.rgbToHex($('#txtBxTime'+options.cnt)[0].style['color']).toUpperCase() == $p('red')){ //if it changed!
                                            if(dtTime.toLocaleTimeString() != "Invalid Date") {
                                                var type = cmd.detectBrowser();
                                                type = type.substring(0, type.indexOf(' '));
                                                //IE tries several times to add time zone hours to time... this stops it from doing that
                                                if(type == 'IE') {
                                                    dtTime = new Date(dtTime.getTime() - (dtTime.getTimezoneOffset() * 60000));
                                                }
                                                //turn to ISO string and remove the .000Z from the string.
                                                dtTime = dtTime.toISOString();
                                                dtTime = dtTime.substring(0, dtTime.indexOf('Z')-4) + dtTime.substring(dtTime.indexOf('Z')+1, dtTime.length);
                                                $project.update('scheduleItemTextBoxUpdater')({ //does the update for me.
                                                    color: $p('purple'),
                                                    indx: options.cnt,
                                                    property: 'dtDateTime',
                                                    txtBxID: 'txtBxTime'+options.cnt,
                                                    dt: dtTime, //send it.
                                                });
                                            }
                                            //update the text box containing the time.
                                            $('#txtBxTime'+options.cnt)[0].value = $dt.read(new Date(dtTime)).toLocaleTimeString();
                                        }
                                    }
                                });
                            }]
                        },
                        //WORKING HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
                         //strGroupName
                        $jConstruct('textbox', {
                            id: 'txtBxName' + options.cnt,
                            class: 'txtBxTimes',
                            text: 'name',
                        }).css({
                            'width': '155px',
                        }).addFunction(function() {
                            if(!(options.reserved)) {
                                tgglTxtBx('txtBxName'+options.cnt, options.name, 'name', true); //set true for editable
                            } else {
                                $('#txtBxName'+options.cnt).attr('disabled', 'disabled').css({
                                    'color': $p('gray'),
                                });
                            }
                            if(undefined !== options.name && '' !== options.name && null !== options.name) {
                                $('#txtBxName'+options.cnt)[0].value = options.name;
                                $('#txtBxName'+options.cnt).css({
                                    'color': $p('purple'),
                                });
                            }
                        }).event('blur', function() {
                            if($p('color')('txtBxName'+options.cnt) == $p('red')) {
                                $project.update('scheduleItemTextBoxUpdater')({ //does the update for me.
                                    color: $p('purple'),
                                    indx: options.cnt,
                                    property: 'strGroupName',
                                    txtBxID: 'txtBxName'+options.cnt,
                                });
                            }
                        }),

                        //strGroupDivision
                        $jConstruct('textbox', {
                            id: 'txtBxDivision' + options.cnt,
                            class: 'txtBxTimes',
                            text: 'division',
                        }).addFunction(function() {
                            if(!(options.reserved)) {
                                tgglTxtBx('txtBxDivision'+options.cnt, options.division, 'division', true); //set true for editable
                            } else {
                                $('#txtBxDivision'+options.cnt).attr('disabled', 'disabled').css({
                                    'color': $p('gray'),
                                });
                            }
                            if(undefined !== options.division && '' !== options.division && null !== options.division) {
                                $('#txtBxDivision'+options.cnt)[0].value = options.division;
                                $('#txtBxDivision'+options.cnt).css({
                                    'color': $p('purple'),
                                });
                            }
                        }).event('blur', function() {
                            if($p('color')('txtBxDivision'+options.cnt) == $p('red')) {
                                $project.update('scheduleItemTextBoxUpdater')({
                                    color: $p('purple'),
                                    indx: options.cnt,
                                    property: 'strGroupDivision',
                                    txtBxID: 'txtBxDivision'+options.cnt,
                                });
                            }
                        }),

                        //strGroupInstructor
                        $jConstruct('textbox', {
                            id: 'txtBxCoach' + options.cnt,
                            class: 'txtBxTimes',
                            text: 'coach',
                        }).addFunction(function() {
                            if(!(options.reserved)) {
                                tgglTxtBx('txtBxCoach'+options.cnt, options.coach, 'coach', true); //set true for editable
                            } else {
                                $('#txtBxCoach'+options.cnt).attr('disabled', 'disabled').css({
                                    'color': $p('gray'),
                                });
                            }
                            if(undefined !== options.coach && '' !== options.coach && null !== options.coach) {
                                $('#txtBxCoach' + options.cnt)[0].value = options.coach;
                                $('#txtBxCoach'+options.cnt).css({
                                    'color': $p('purple'),
                                });
                            }
                        }).event('blur', function() {
                            if($p('color')('txtBxCoach'+options.cnt) == $p('red')) {
                                $project.update('scheduleItemTextBoxUpdater')({
                                    color: $p('purple'),
                                    indx: options.cnt,
                                    property: 'strGroupInstructor',
                                    txtBxID: 'txtBxCoach'+options.cnt,
                                });
                            }
                        }),

                        //intScheduleOverRideNumPaticipants
                        $jConstruct('textbox', {
                            id: 'txtBxID' + options.cnt,
                            class: 'txtBxTimes',
                            text: "0",
                        }).addFunction(function() {
                            if(!(options.reserved)) {
                                tgglTxtBx('txtBxID'+options.cnt, options.id, "0", true); //set true for editable
                            } else {
                                $('#txtBxID'+options.cnt).attr('disabled', 'disabled').css({
                                    'color': $p('gray'),
                                });
                            }
                                
                            $('#txtBxID' + options.cnt).css({
                                'width': '60px',
                            });
                            //if not undefined, not empty string, not null, not 0
                            if(undefined !== options.id && '' !== options.id && null !== options.id && 0 !== options.id) {
                                $('#txtBxID'+options.cnt)[0].value = options.id;
                                $('#txtBxID'+options.cnt).css({
                                    'color': $p('purple'),
                                });
                            }
                        }).event('blur', function() {
                            if($p('color')('txtBxID'+options.cnt) == $p('red')) {
                                $project.update('scheduleItemTextBoxUpdater')({
                                    color: $p('purple'),
                                    indx: options.cnt,
                                    property: 'intScheduleOverRideNumPaticipants',
                                    txtBxID: 'txtBxID'+options.cnt,
                                });
                            }
                        }),

                        //event time close button
                        $jConstruct('div', {
                            id: 'closeBtn' + options.cnt,
                            class: 'maxMinBtn',
                            text: '<b>X</b>',
                        }).css({
                            'background-color': 'red',
                        }),

                        //event time maximize button.
                        $jConstruct('div', {
                            id: 'maximizeBtn' + options.cnt,
                            class: 'maxMinBtn',
                            text: '<b>[_]</b>',
                        }).css({
                            'background-color': 'green',
                        }),
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
                                        $('#notesBox').hide();
                                    } else {
                                        $('#groupNameBox').show();
                                        $('#divisionBox').show();
                                        $('#coachBox').show();
                                        $('#groupInstructorBox').show();
                                        $('#groupCodeBox').show();
                                        $('#notesBox').show();
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
                                    'color': $p("gray"),
                                })
                                tgglTxtBx('groupNameBox', /*'Group Name',*/ undefined, 'Group Name');
                            }]
                        },
                        {//strGroupInstructor
                            type: 'textbox',
                            id: 'groupInstructorBox',
                            text: 'Group Instructor',
                            functions:[function () {
                                $('#groupInstructorBox').css({
                                    'color': $p("gray"),
                                });
                                tgglTxtBx('groupInstructorBox', undefined, 'Group Instructor');
                            }],
                        },
                        {//strOrganizationEventGroupCode
                            type: 'textbox',
                            id: 'groupCodeBox',
                            text: 'Group Code',
                            functions: [function () {
                                $('#groupCodeBox').css({
                                    'color': $p("gray"),
                                });
                                tgglTxtBx('groupCodeBox', undefined, 'Group Code');
                            }],
                        },
                        {//StrGroupDivision
                            type: 'textbox',
                            id: 'divisionBox',
                            //class: 'txtCenter',
                            text: 'Group Division',
                            functions: [function () {
                                $('#divisionBox').css({
                                    'color': $p("gray"),
                                });
                                tgglTxtBx('divisionBox', undefined, 'Group Division');
                            }]
                        },
                        {//strGroupInstructor
                            type: 'textbox',
                            id: 'coachBox',
                            text: 'Coach',
                            functions: [function () {
                                $('#coachBox').css({
                                    'color': $p("gray"),
                                });
                                tgglTxtBx('coachBox', undefined, 'Coach');
                            }],
                        },
                        
                        {//dtDateTime <--update time part.
                            type: 'textbox',
                            id: 'timeBox',
                            name: 'time',
                            text: 'click to set time.',
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
                                }).css({
                                    'color': $p('purple'),
                                });
                            }]
                        },

                        {//strNotes
                            type: 'textarea',
                            id: 'notesBox',
                            text: 'Notes...',
                            rows: '6',
                            cols: '20',
                            functions: [function () {
                                $('#notesBox').css({
                                    'color': $p("gray"),
                                });
                                tgglTxtBx('notesBox', undefined, 'Notes...');

                            }]
                        },
                        {//intScheduleOverRideNumPaticipants
                            type: 'spinner',
                            id: 'numParticipantsSpnr',
                            text: 'Participants',
                            min: 0,
                            max: 100,
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
                                $('#submitBtn').click(function() { //submit the form data to the data base... make sure to pull the selected object div id.
                                    function getText(value, defVal) {
                                        return value !== defVal ? value : "";
                                    }
                                    //generate the proper json object to send to the create function.
                                    var strJson = dataObjs.templates.schedule();
                                    strJson.blnOnlineFilledAllowed = $('#reservedCheckBox')[0].checked;
                                    strJson.strGroupName = getText($('#groupNameBox')[0].value, 'Group Name');
                                    strJson.strGroupInstructor = getText($('#groupInstructorBox')[0].value, 'Group Instructor');
                                    strJson.strOrganizationEventGroupCode = getText($('#groupCodeBox')[0].value, 'Group Code');
                                    strJson.strGroupDivision = getText($('#divisionBox')[0].value, 'Group Division');
                                    strJson.strGroupInstructor = getText($('#coachBox')[0].value, 'Coach');
                                    strJson.intScheduleOverRideNumPaticipants = $('#numParticipantsSpnr')[0].value;
                                    strJson.strNotes = getText($('#notesBox')[0].value, 'Notes...');
                                    var d = new Date(strJson.dtDateTime);
                                    if(getText($('#timeBox')[0].value, 'time') !== "") {
                                        d.setTime(cmd.time.format($('#timeBox')[0].value));
                                        strJson.dtDateTime = $dt.write(d).toISOString();
                                    }
                                    $project.create('scheduleItem')(strJson).done(function() { //make the new schedule item (aka time).
                                        $.colorbox.close(); //close the color box.
                                    });
                                });
                            }]
                        },
                        {//close the colorbox, ignore everything button.
                            type: 'button',
                            id: 'cancelBtn',
                            text: 'cancel',
                            functions: [function () {
                                $('#cancelBtn').click(function () {
                                    $.colorbox.close(); //close the colorbox.
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
    $.colorbox({html:'<div id="'+id+'"></div>', width: dimens.width, height: dimens.height});
    appendHTML(forms[obj], '#'+id);
}
