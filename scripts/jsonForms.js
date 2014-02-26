var dpData = {
    /*{
                        onSelect: function(dtTxt, inst) {
                        console.log('datePicker clicked!', dtTxt);
                        $('#dpStartEnd').css({
                            'visibility': 'visible',
                        });
                        if(dpToggle) {
                            console.log('txbStartDt');
                            $('#txbStartDt').css({
                                'color': '#5233A6',
                            })[0].value = dtTxt.toString();
                        } else {
                            console.log('txbEndDt');
                            $('#txbEndDt').css({
                                'color': '#5233A6',
                            })[0].value = dtTxt.toString();
                        }
                        dpToggle = dpToggle ? 0 : 1;
                    }}*/
    start: '',
    end: '',
    toggle: 1,
};


var dpToggle = 1;

function toggleTxtBx(id, txt) {
    if( $('#'+id)[0].value == txt ) {
        $('#'+id)[0].value = '';
        $('#'+id).css({
            'color': '#5233A6',
        });
    } else {
        if( $('#'+id)[0].value === '' ) {
            $('#'+id)[0].value = txt;
            $('#'+id).css({
                'color': '#CCCCCC',
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
    foo: {
        type: 'div',
        id: undefined,
        children: [
            {
                type: 'div',
                text: undefined,
            },
            {
                type: 'div',
                children: [
                    {
                        type: 'button',
                        id: undefined,
                        text: 'edit',
                        onclick: "",
                    }    
                ]
            }
        ]
    },
    
    createEventMaximal: {
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
                    $('#scheduleTitle').focus(function() {
                       toggleTxtBx('scheduleTitle', 'Schedule Title') 
                    });
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
                    $('#scheduleDescription').focus(function() {
                       toggleTxtBx('scheduleDescription', 'Schedule Description') 
                    });
                    
                    $('#scheduleDescription').css({
                        'color': '#CCCCCC',
                    }); 
                }],
            },
            {
                active: false,
                type: 'div',
                id: 'dpStartEnd',
                functions: [function () {
                    $('#dpStartEnd').css({
                        'visibility': 'collapse',
                    });
                }],
                children: [
                    {
                        type: 'textbox',
                        id: 'txbStartDt',
                        text: 'Start Date',
                        functions: [function () {
                            $('#txbStartDt').css({
                                'visibility': 'collapse',
                                'color': '#CCCCCC',
                            }).click(function() {
                                dpToggle = 1;
                                toggleTxtBx('txbStartDt', 'Start Date');
                            });
                        }]
                    },
                    {
                        type: 'textbox',
                        id: 'txbEndDt',
                        text: 'Click again for end date!',
                        functions: [function () {
                            $('#txbEndDt').css({
                                'visibility': 'collapse',
                                'color': '#AD021B',
                            }).click(function() {
                                dpToggle = 0;
                                toggleTxtBx('txbEndDt', 'End Date');
                            });
                        }]
                    }
                ],
            },
            {
                type: 'div',
                id: 'mkSchedDtPkr',
                functions: [function () {
                    $('#mkSchedDtPkr').datepicker({
                        onSelect: function(dtTxt, inst) {
                        console.log('datePicker clicked!', dtTxt);
                        $('#dpStartEnd').css({
                            'visibility': 'visible',
                        });
                        if(dpToggle) {
                            console.log('txbStartDt');
                            $('#txbStartDt').css({
                                'color': '#5233A6',
                            })[0].value = dtTxt.toString();
                        } else {
                            console.log('txbEndDt');
                            $('#txbEndDt').css({
                                'color': '#5233A6',
                            })[0].value = dtTxt.toString();
                        }
                        dpToggle = dpToggle ? 0 : 1;
                    }});
                }],
                children: [
                    {
                        type: 'div',
                        id: 'date',
                    },
                ]
            },
            {
                type: 'div',
                id: 'checkboxContainer',
                functions: [function () {
                    $('#checkboxContainer').css({
                        'width': '50%',
                        'text-align': 'center',
                        'float': 'right',
                    });
                }],
                children: [
                    {
                        type: 'checkbox',
                        id: 'checkboxActive',
                        text: 'Make Active',
                        functions: [function () {
                            $('#checkboxActive')[0].checked = true;
                        }]
                    }
                ]
            },
            {
                type: 'div',
                id: 'buttonContainer',
                functions: [function () {
                    $('#buttonContainer').css({
                        'width': '50%',
                        'float': 'left',
                    });
                }],
                children: [
                    {
                        type: 'button',
                        id: 'formSubmit',   
                        text: 'submit',
                        functions: [function() {
                            $('#formSubmit').click(function () {
                                console.log({
                                   strScheduleTitle: $('#scheduleTitle')[0].value,
                                   strScheduleDescription: $('#scheduleDescription')[0].value,
                                   dtScheduleDate: $('#mkSchedDtPkr').datepicker('getDate').toString(),
                                   //blnActive: $('#checkboxActive')[0].checked,
                                });
                            });
                        }]
                    }
                ]
            },
        ],        
    },
    
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
            {
                type: 'div',
                id: 'buttonContainer',
                functions: [function () {
                    $('#buttonContainer').css({
                        'width': '50%',
                        'float': 'left',
                    });
                }],
                children: [
                    {
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
                    }
                ]
            },
        ],        
    },
    
    defEvntOptions: {
        type: 'div',
        id: 'options',
        text: '<h3>Options<h3>',
        functions:[function () {
            $('#options').css({
                
            });
        }]
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
                        'border': '1px solid #3287CC',
                    });
                }).mouseout(function () {
                    $('#'+prop.id).css({
                        'background-color': '#ABABAB',
                        'border': '1px solid #D6B318',
                    });
                });
            }],
            children: [
                {
                    type: 'div',
                    id: prop.id + 'pt1',
                    text: '<div style="padding-left: 10px">' + (undefined !== prop.pt1.text ? prop.pt1.text : undefined) + '</div>',
                    functions:[function () {
                        $('#'+prop.id+'pt1').css({
                            'width': '45%',
                            'height': '50%',
                            //'border': '1px solid black',
                            'text-align': 'left',
                            'float': 'left',
                            'z-index': '0',
                        });
                    }],
                    children: undefined !== prop.pt1.children ? prop.pt1.children : undefined,
                },
                
                {
                    type: 'div',
                    id: prop.id + 'pt15',
                    text: undefined !== prop.pt15.text ? new Date(prop.pt15.text.substring(0, prop.pt15.text.indexOf('T'))).toDateString() : undefined,
                    functions: [function () {
                        $('#'+prop.id+'pt15').css({
                            'width': '25%',
                            'height': '50%',
                            //'border': '1px solid black',
                            'text-align': 'left',
                            'float': 'left',
                            'z-index': '0',
                        })
                    }]
                },
                
                {
                    type: 'div',
                    id: prop.id + 'pt2',
                    text: undefined !== prop.pt2.text ? prop.pt2.text : undefined,
                    functions: [function () {
                        $('#'+prop.id+'pt2').css({
                            'width': '20%',
                            'height': '50%',
                            //'border': '1px solid black',
                            'float': 'right',
                            'z-index': '0',
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
                
                {
                    type: 'div',
                    id: prop.id + 'pt0',
                    text: '<div style="padding-left: 10px">' + (undefined !== prop.pt0.text ? prop.pt0.text : undefined) + '</div>',
                    functions: [function () {
                        $('#'+prop.id+'pt0').css({
                            'width': '100%',
                            'height': '50%',
                            //'border': '1px solid black',
                            'text-align': 'left',
                            'float': 'left',
                            'z-index': '0',
                        });
                    }],
                    children: undefined !== prop.pt0.children ? prop.pt0.children : undefined,
                },
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
                    ],
                },
            ],
        };
    },
    
    cbConfirmDel: {
        type: 'div',
        id: 'cbDel',
        text: '<h3>This will delete everything!</h3>',
        children: [
            {
                type: 'button',
                id: 'btnOk',
                text: 'Ok',
                functions: [function() {
                    console.log('you clicked ok!');
                }],
            },  
        ],
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
    
    defEvntTimes: function (options) {
        return {
            type: 'div',
            id: 'fooTimes' + options.indx,
            class: 'fooTimes',
            children: [
                {
                    //top row
                    type: 'div',
                    id: 'fooTopRow',
                    children: [
                        {
                            type: 'textbox',
                            id: 'txtBxTime',
                            text: 'time',
                            functions: [function() {
                                $('#txtBxTime').css({
                                    'color': '#5C0964',
                                });
                            }],
                        },
                    ],
                },
            ],
        };
    },

};

function defaultColorbox(id, obj, dimens) {
    console.log(id);
    console.log(forms[obj]);
    console.log(dimens);
    $.colorbox({html:'<div id="'+id+'"></div>', width: dimens.width, height: dimens.height});
    appendHTML(forms[obj], id);
}
