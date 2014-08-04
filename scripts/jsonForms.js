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

var confirmDel = function (indx) {
    $.colorbox({html: '<div id="cbConfirm"></div>', width: '460px', height: '140px'});
    appendHTML(forms['confirmPopUp']({
        text: '<h3> Are you sure you wish to delete this entire schedule? </h3>',
        func: function () {
            cmd.del(indx);
            //$.colorbox.close(); 
        },
    }), '#cbConfirm');
};

var confirmTimeDel = function(indx) {
    $.colorbox({html: '<div id="cbConfirm"></div>', width: '465px', height: '120px'});
    appendHTML(forms['confirmPopUp']({
        text: '<h3> Are you sure you wish to delete this Event Time? </h3>',
        func: function() {
            var data = dataObjs.evntTimes.EventScheduleItems[indx].indxScheduleDateID;
            var data2 = dataObjs.evntTimes.EventScheduleItems[indx].indxOrganizationEventID;
            $project.remove('scheduleItem')('Data='+data+'&Data2='+data2).done(function(dta) {
                cmd.events.checkStatus(0, true).done(function() {
                    $.colorbox.close();
                    $v('display-tblInfo').clear();
                    $project.draw('scheduleItems')($v().events()[parseInt(dataObjs.slctdObj.substring(3, dataObjs.slctdObj.length))].indxScheduleID);
                });
                
            });
        }
    }), '#cbConfirm');

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
/*function getForm(id) {
    var retForm;
    $.each(forms, function () {
       if(this.id == id) {
           retForm = this;
       } 
    });
    return retForm;
}*/
/*function dynFoo(prop) {
    form = forms['foo'];
    form.id = 'foo'+prop.indx;
    form.children[0].text = prop.text;
    form.children[1].children[0].id = 'edit'+prop.indx;
    return form;
}*/
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

                    function addDays(date, days) {
                        var result = new Date(date);
                        result.setDate(date.getDate() + days);
                        return result;
                    }

                    obj.dtDateAdded = t.today().toISOString();
                    
                    obj.strScheduleTitle = $('#scheduleTitle')[0].value;
                    obj.strScheduleDescription = $('#scheduleDescription')[0].value;
                    obj.dtScheduleDate = $('#mkSchedDtPkr').datepicker('getDate').toISOString();
                    obj.dtOnLineFilledStartDate = cmd.time.removeISOTimeZone(t.today()).toISOString(); //12:00AM
                    obj.dtOnLineFilledEndDate = cmd.time.removeISOTimeZone(addDays(t.midnightPm($('#mkSchedDtPkr').datepicker('getDate')), 1)).toISOString(); //11:55PM
                    obj.indxOrganizationEventID = id.event;
                    obj.indxPhotographerID = id.photographer;
                    console.log(obj);
                    var url = 'https://www.mypicday.com/Handlers/ScheduleCreateData.aspx?Data='+JSON.stringify(obj);
                    $sql(url).get(function(data){
                        console.log(data);
                        var parsed = JSON.parse(data);
                        var len;
                        
                        if(undefined !== dataObjs.srvdTbls.EventSchedules) {
                            dataObjs.srvdTbls.EventSchedules[dataObjs.srvdTbls.EventSchedules.length] = parsed;
                            $v('display-tbls').clear();
                        } else {
                            dataObjs.srvdTbls.EventSchedules = [];
                            dataObjs.srvdTbls.EventSchedules[0] = parsed;
                        }
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
                    $('#'+prop.id+'fromDate').css({
                        'color': 'white',
                    });
                    $('#'+prop.id+'toDate').css({
                        'color': 'white',
                    });
                }).mouseout(function () {
                    if(prop.id != dataObjs.slctdObj) {
                        $('#'+prop.id).css({
                            'background-color': 'white',
                        });
                        $('#'+prop.id+'fromDate').css({
                            'color': $p('amber'),
                        });
                        $('#'+prop.id+'toDate').css({
                            'color': $p('amber'),
                        });

                    }
                }).click(function() {
                    cmd.scheduleFocus(prop.id, prop.evntID);
                });
            }],
            children: [
                //title
                forms.mDiv({
                    id: prop.id + 'pt1',
                    text: '<div id="pt1Obj'+prop.id+'">' + (undefined !== prop.pt1.text ? prop.pt1.text : undefined) + '</div>',
                    css: function () {
                        $('#'+prop.id+'pt1').css({
                            'width': '45%',
                            'height': '30px',
                            'text-align': 'left',
                            'float': 'left',
                            //'border': '1px solid black',
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
                                            cmd.update(prop.indx); //comment out if debugging so db wont be hit. <-- saves current state to the db.
                                        } else {
                                            $('#evntEditBx').remove(); //if no changes to be made, simply return the original object state.
                                            appendHTML(forms.genEvnt(prop).children[0], '#'+prop.id+"pt1"); //add back original object.
                                            cmd.events.checkStatus(prop.indx, true);
                                        }
                                    });
                                }
                            }), '#'+prop.id+"pt1");
                            $('#evntEditBx').focus();
                        });
                    }
                }),
                
                //date object 
                $jConstruct('div', {
                    id: prop.id + 'pt15',
                }).css({
                    'width': '25%',
                    'height': '30px',
                    'text-align': 'left',
                    'float': 'left',
                    //'border': '1px solid black',
                }).addChild($jConstruct('div', {
                    id: 'pt1Date' + prop.id,
                    text: '<a>' + prop.pt15.text + '</a>',
                }).addFunction(function() {
                    $('#pt1Date'+prop.id+' a').click(function() { //opens date picker object when the text is clicked.
                        $.colorbox({html: '<div id="cbDateEdit"></div>', width: '350', height: '410px'});
                        appendHTML(forms['datePicker'](prop.indx), '#cbDateEdit');
                    });
                })),

                //close button
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
                        'background-color': $p('lightAmber'),
                    })
                ).event('click', function() {
                    $v().events()[prop.indx].blnActive = !($v().events()[prop.indx].blnActive);
                    //cmd.update(prop.indx);
                }).css({
                    'width': '20%',
                    'height': '30px',
                    'float': 'right',
                    //'border': '1px solid black',
                }),

                //description
                forms.mDiv({
                    id: prop.id + 'pt0',
                    text: '<div id="description'+prop.id+'"><a>' + (undefined !== prop.pt0.text ? prop.pt0.text : undefined) + '</a></div>',
                    css: function () {
                        $('#'+prop.id+'pt0').css({
                            'width': '100%',
                            'height': '25px',
                            'text-align': 'left',
                            'float': 'left',
                            'padding-left': '10px',
                            //'border': '1px solid black',
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
                                            cmd.events.checkStatus(prop.indx, true);
                                        }
                                    });
                                }
                            }), '#' + prop.id+"pt0");
                            $('#descriptEditBx').focus();
                        });
                    }
                }),
                
                //two dates.
                $jConstruct('div', {
                    id: prop.id + 'reservationRange',
                }).addChild($jConstruct('div', {
                    text: 'Schedule reservation active through:',
                }).css({
                    'float': 'left',
                    'font-size': '10px',
                    'width': '100%',
                    'height': '15px',
                    //'margin': '0 auto',
                })).addChild($jConstruct('div', {
                    id: prop.id + 'fromDate',
                    text: cmd.time.removeISOTimeZone(prop.dates[0], true).toDateString().substring(4, 10) + ', ' + cmd.time.removeISOTimeZone(prop.dates[0], true).toLocaleTimeString(),
                }).css({
                    'float': 'left',
                    'margin-right': '20px',
                    'color': $p('amber'),
                    //'margin-left': '10px',
                }).event('click', function() {
                    $.colorbox({html: '<div id="cbDateEdit"></div>', width: '350', height: '145px'});
                    appendHTML(forms['dateTimeAlpha']('pick a new start date', function(dt) {
                        //dt.setDate(dt.getDate()-1); //offset the change.
                        $v().events()[prop.indx].dtOnLineFilledStartDate = dt.toISOString();
                        cmd.update(prop.indx, $v().events()[prop.indx].indxScheduleID); //updates the data, second parameter focuses the object.
                        $.colorbox.close();
                    }), '#cbDateEdit');
                })).addChild($jConstruct('div', {
                    id: prop.id + 'filler',
                    text: '-',
                }).css({
                    'float': 'left',
                    'margin-right': '20px',
                })).addChild($jConstruct('div', {
                    id: prop.id + 'toDate',
                    text: cmd.time.removeISOTimeZone(prop.dates[1], true).toDateString().substring(4, 10) + ', ' + cmd.time.removeISOTimeZone(prop.dates[1], true).toLocaleTimeString(),
                }).css({
                    'float': 'left',
                    'color': $p('amber'),
                }).event('click', function() {
                    $.colorbox({html: '<div id="cbDateEdit"></div>', width: '350', height: '145px'});
                    appendHTML(forms['dateTimeAlpha']('pick a new end date', function(dt) {
                        $v().events()[prop.indx].dtOnLineFilledEndDate = dt.toISOString(); //11:55PM
                        cmd.update(prop.indx, $v().events()[prop.indx].indxScheduleID); //updates the data, second parameter focuses the object.
                        $.colorbox.close();
                    }), '#cbDateEdit');
                })).css({
                    
                    //'float': 'left',
                    //'border': '1px solid black',
                    'width': '265px',
                    'height': '40px',
                    'margin': '0 auto',
                    'font-size': '12px',
                    'visibility': 'hidden',
                }),

            ]
        };
    },

    genericDTPKR: function(obj, func, additionalDiv) {
        var dPicker = $jConstruct('div').event('datepicker');

        var submitBtn = $jConstruct('button', {
            text: 'submit',
        }).event('click', function() {
            func($('#'+dPicker.id).datepicker('getDate'));
        });

        var cancelBtn = $jConstruct('button', {
            text: 'cancel',
        }).event('click', function() {
            $.colorbox.close();
        });

        var dPBtns = $jConstruct('div').addChild(submitBtn).addChild(cancelBtn);
        
        return (function() {
            if(additionalDiv) {
                return $jConstruct('div', {
                    'text': '<h4>' + obj + '</h4>',
                }).css({
                    'text-align': 'center',
                }).addChild(dPicker).addChild(additionalDiv).addChild(dPBtns);
            } else {
                return $jConstruct('div', {
                    text: '<h4>' + obj + '</h4>',
                }).css({
                    'text-align': 'center',
                }).addChild(dPicker).addChild(dPBtns);            
            }
        })();
    },

    datePicker: function (indx) {
        return forms.genericDTPKR('Pick your new event date', function(dt) {
            var d = dataObjs.clearTime(new Date(dt));
            $v().events()[indx].dtScheduleDate = $dt.write(d);
            $v().events()[indx].dtOnLineFilledEndDate = $dt.write(dataObjs.timeMidnight(d));
            cmd.update(indx, $v().events()[indx].indxScheduleID); //updates the data, second parameter focuses the object.
            $.colorbox.close();

        });
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
                        title: 'If visible, and checked, coach/parent check-in is complete',
                        functions: [function() {
                            $('#chkdIn').prop('checked', true);
                        }]
                    },
                ]
            },

            {
                type: 'div',
                id: 'resrvd',
                class: 'reservationKey',
                text: '<b>R</b>',
                title: 'If blue, schedule time is a reservation style.',
                functions: [function() {
                    $('#resrvd').css({
                        //'color': 'white',
                        'background-color': $p('blue'),//'#D6B318'
                        'border': '1px solid '+$p('darkBlue'),
                        //'border-radius': '5px',
                        //'text-align': 'center',
                        //'width': '25px',
                        //'height': '23px',
                        //'float': 'left',
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
                type: 'button',
                id: 'btnAddTimeToEvent',
                text: 'Add Time',
                title: 'Add a time to the schedule.',
                functions: [function() {
                    $('#btnAddTimeToEvent').css({
                        'border-radius': '5px',
                        'background-color': $p('blue'),
                        //'border': '1px solid '+$p('darkBlue'),
                        'margin-right': '5px',
                        'color': 'white',
                        'width': '100px',
                        'height': '23px',
                        'float': 'right',
                        'cursor': 'pointer',
                        'line-height': '20px',
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
            title: 'Applies to: ' + $v().events()[parseInt(dataObjs.slctdObj.substring(3, dataObjs.slctdObj.length))].strScheduleTitle + '  ' + new Date($v().events()[parseInt(dataObjs.slctdObj.substring(3, dataObjs.slctdObj.length))].dtScheduleDate).toLocaleDateString(),
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
                            title: options.checked ? 'Has been checked.' : 'Has NOT been checked.',
                            functions: [function() {
                                if(undefined !== options.checked) { //makes sure there are not any bugs.
                                    if(options.checked) {
                                        $('#chkdIn'+options.cnt).show(); //make sure it is visible.
                                        $('#chkdIn'+options.cnt).attr('checked','checked');
                                    } else {
                                        $('#chkdIn'+options.cnt).hide(); //dont show the checkbox at all.
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
                    title: options.reserved ? 'Reserved' : 'NOT Reserved',
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
                            'background-color': $p('lightAmber'),
                        }).event('click', function() {
                            confirmTimeDel(options.cnt);
                        }),

                        //event time maximize button.
                        $jConstruct('div', {
                            id: 'maximizeBtn' + options.cnt,
                            class: 'maxMinBtn',
                            text: '<b>i</b>',
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
                        /*{//how many times to repeat the data.
                            type: 'spinner',
                            id: 'duplicateSpnr',
                            text: 'copies:',
                            min: 0,
                            max: 30,
                            functions: [function () {
                                $('#duplicateSpnr')[0].value = "1";
                            }]
                        },*/
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
                                    if(getText($('#timeBox')[0].value, 'time') !== "") {
                                        strJson.dtDateTime = cmd.time.IEremoveISOTimeZone($dt.parse($('#timeBox')[0].value), false).toISOString();
                                        console.log( $('#timeBox')[0].value, strJson.dtDateTime);
                                    }
                                    $project.create('scheduleItem')(strJson).done(function() { //make the new schedule item (aka time).
                                        cmd.events.checkStatus(0, true).done(function() {
                                            $.colorbox.close(); //close the loading screen.
                                        });
                                        //$.colorbox.close(); //close the color box.
                                    });
                                });
                            }]
                        },
                        $jConstruct('button', { //written in JSONHTML v0.9 - Beta
                            id: 'multiPostBtn',
                            text: 'Reservation Range',
                        }).event('click', function() {
                            //$.colorbox.close();
                            defaultColorbox('multiPostCB', 'multiPost', {
                                width: '400px',
                                height: '220px',
                            });
                        }),
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
    },

    //form repsonsible for creating multiple time objects on the fly.
    multiPost: function() { //written in JSONHTML v0.9 - Beta
        var boxCSS = {
            'color': $p('gray'),
        };

        //textboxes to fill
        var startTimeDateBox = $jConstruct('textbox', {
            text: 'Start Time',
            name: 'time0',
        }).addFunction(function() {
            $('input[name="time0"]').ptTimeSelect();
        }).css(boxCSS).event('focus', function() {
            $('#'+startTimeDateBox.id).css({
                'color': $p('purple'),
            });
            $('#cboxOverlay').css({ //so the time select will appear over the shadow.
                'z-Index': '8',
            });
            $('#colorbox').css({ //so the time select will appear over the colorbox.
                'z-Index': '9',
            });
        });

        var endTimeDateBox = $jConstruct('textbox', {
            text: 'End Time',
            name: 'time1',
        }).addFunction(function() {
            $('input[name="time1"]').ptTimeSelect();
        }).css(boxCSS).event('focus', function() {
            $('#'+endTimeDateBox.id).css({
                'color': $p('purple'),
            });
            $('#cboxOverlay').css({ //so the time select will appear over the shadow.
                'z-Index': '8',
            });
            $('#colorbox').css({ //so the time select will appear over the colorbox.
                'z-Index': '9',
            });
        });

        var numintervalBox = $jConstruct('textbox', {
            text: 'Minutes Interval',
        }).css(boxCSS).addFunction(function() {
            tgglTxtBx(numintervalBox.id, 'Minutes Interval', 'Minutes Interval', false);
        });

        var numSlotsBox = $jConstruct('textbox', {
            text: 'How many Slots',
        }).css(boxCSS).addFunction(function() {
            tgglTxtBx(numSlotsBox.id, 'How many Slots', 'How many Slots', false);
        });


        //buttons for functionality.
        var btnClose = $jConstruct('button', {
            //class: 'editBtn',
            text: 'cancel',
        }).event('click', function() {
            //$('#'+post.id).remove();
            $.colorbox.close(); //close the colorbox.
        });
        var btnSubmit = $jConstruct('button', {
            //class: 'editBtn',
            text: 'submit',
        }).event('click', function() {
            //this would submit the stuff
            //console.log($('#'+startTimeDateBox.id)[0].value, $('#'+endTimeDateBox.id)[0].value, $('#'+numintervalBox.id)[0].value, $('#'+numSlotsBox.id)[0].value);
            var obj = {
                ScheduleID: $v().events()[parseInt(dataObjs.slctdObj.substring(3, dataObjs.slctdObj.length))].indxScheduleID,
                EventID: id.event,
                StartTimeDate: cmd.time.IEremoveISOTimeZone($dt.parse($('#'+startTimeDateBox.id)[0].value), false).toISOString(),
                EndTimeDate: cmd.time.IEremoveISOTimeZone($dt.parse($('#'+endTimeDateBox.id)[0].value), false).toISOString(),
                TimeInterval: $('#'+numintervalBox.id)[0].value,
                Slots: $('#'+numSlotsBox.id)[0].value,
                PhotographerID: id.photographer,
            }
            console.log(obj);
            $project.insert('scheduleItem')(obj).done(function(data) {
                if(data) {
                    console.log(data);
                }
                console.log('done');
                cmd.events.checkStatus(0, true).done(function() {
                    $project.draw('scheduleItems')($v().events()[parseInt(dataObjs.slctdObj.substring(3, dataObjs.slctdObj.length))].indxScheduleID);
                    $.colorbox.close(); //close the loading screen.
                });
                //$.colorbox.close();
                
            });
        });
                    
        //containers to contain the objects in a div.
        var textBoxContainer = $jConstruct('div').css({
            'text-align': 'center',
        }).addChild($jConstruct('div').addChild(startTimeDateBox)).addChild($jConstruct('div').addChild(endTimeDateBox)).addChild($jConstruct('div').addChild(numintervalBox)).addChild($jConstruct('div').addChild(numSlotsBox));
        var buttonContainer = $jConstruct('div').addChild(btnClose).addChild(btnSubmit);
                    
        //main div to contain everything.
        return $jConstruct('div', {
            text: '<h3> Set Reservation Range Settings</h3>',
        }).css({
            'text-align': 'center',
        }).addChild(textBoxContainer).addChild(buttonContainer);
    },
    helpWindow: function() {

        var okBtn = $jConstruct('button', {
            text: 'ok',
        }).event('click', function() {
            $.colorbox.close();
        }).css({
            'float': 'right',
            'width': '60px',
            'height': '25px',
        });

        return $jConstruct('div', {
            text: '<h3> Need Help? </h3>',
        }).css({
            'text-align': 'center',
        }).addChild($jConstruct('div', {
            text: 'Check back here later, training videos are coming soon!',
        })).addChild(okBtn);
    },

    /*
        USE:
        $.colorbox({html: '<div id="tmp"></div>', width: '350px', height: '145px'});
        forms.dateTimeAlpha('pick stuff', function(dt) { 
          console.log(dt.toISOString());
        }).appendTo('#tmp');
    */ 
    dateTimeAlpha: function(title, func) {
        var datePicker = $jConstruct('textbox', {
            text: 'Click to pick a date',
        }).event('datepicker');

        var timePicker = $jConstruct('textbox', {
            text: 'Click to pick a time',
        }).event('ptTimeSelect').event('click', function() {
            $('#cboxOverlay').css({ //so the time select will appear over the shadow.
                'z-Index': '8',
            });
            $('#colorbox').css({ //so the time select will appear over the colorbox.
                'z-Index': '9',
            });
        });

        var btnSubmit = $jConstruct('button', {
            text: 'submit',
        }).event('click', function() {
            var d = $('#'+datePicker.id).datepicker('getDate');
            //for some reason if PM, adds another day!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            var t = $dt.parse($('#'+timePicker.id)[0].value, d);
            console.log(t.toLocaleTimeString());
            /*if(t.getHours() < 12) { //if the time is PM, this will keep the day of the month correct.
                console.log('executing time correction');
                d.setDate(d.getDate() - 1);
            }*/
            //d.setHours(t.toLocaleTimeString().substring(0, t.toLocaleTimeString().indexOf(':')));
            //d.setHours(t.getHours());
            //d.setMinutes(t.getMinutes());
            func(t);
        });

        var btnCancel = $jConstruct('button', {
            text: 'cancel',
        }).event('click', function() {
            $.colorbox.close();
        })

        var btnContainer = $jConstruct('div').css({
            'float': 'right',
        }).addChild(btnSubmit).addChild(btnCancel);

        var pickerContainer = $jConstruct('div').css({
            'margin': '0 auto',
        }).addChild(datePicker).addChild(timePicker);

        return $jConstruct('div', {
            text: '<h4>' + title + '</h4>',
        }).css({
            'text-align': 'center',
        }).addChild(pickerContainer).addChild(btnContainer);

    },

};

function defaultColorbox(id, obj, dimens) {
    $.colorbox({html:'<div id="'+id+'"></div>', width: dimens.width, height: dimens.height});
    appendHTML(forms[obj], '#'+id);
}
