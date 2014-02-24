

var genMenObj = function (prop) {
    return {
        id: prop.id,
        title: prop.title,
        width: prop.width,
        options: [
            {
                title: 'Active', //Text for parent option.
                options: [
                    {
                        title: 'true', //Text for child option.
                        onclick: "toggleActive(\'"+prop.id+"\', true)", //Standard function call just in quotes.
                    },
                    {
                        title: 'false', //Text for child option.
                        onclick: "toggleActive(\'"+prop.id+"\', false)", //Standard function call just in quotes.
                    },
                ],
            },
            {
                title: 'Delete', //Text for parent option.
                options: [
                    {
                        title: 'This', //Text for child option.
                        onclick: "cmd.del("+prop.index+")", //Standard function call just in quotes.
                    },
                    /*{
                        title: 'Time', //Text for child option.
                        onclick: "console.log('Delete Time button')", //Standard function call just in quotes.
                    },*/
                ],
            },
            {
                title: 'New', //Text for parent option.
                options: [
                    /*{
                        title: 'Event', //Text for child option.
                        onclick: "defaultColorbox('newEvent', 'createEventMinimal', { width: '350px', height: '370px' })",
                        //onclick: "cmd.create()", //Standard function call just in quotes.
                    },*/
                    {
                        title: 'Time', //Text for child option.
                        onclick: "console.log('New Time button')", //Standard function call just in quotes.
                    },
                ],
            },
            {
                title: 'Replace',
                options: [
                    {
                        title: 'Date',
                        onclick: "dateEdit("+prop.index+")",
                    },
                    {
                        title: 'Description',
                        onclick: "descriptionEdit("+prop.index+")",
                    },
                    {
                        title: 'Title',
                        onclick: "titleEdit("+prop.index+")",
                    },
                ],
            }
        ],
    };
};

//for the date picker.
var dateFunc = function () {
    var htmlJson = parseDpJson(jsonDtPkr({ //generate the html.
        id: 'dp0',
    }));
    $.colorbox({html:htmlJson.html, width: '320px', height: '350px'});
    if(undefined !== htmlJson.css) { //uses jQuery to assign css in cbDatePicker.js.
        $.each(htmlJson.css, function () {
            this();
        });
    }
    if(undefined !== htmlJson.functions) { //executes each function for each div in cbDatePicker.js
        $.each(htmlJson.functions, function () {
            this(); 
        });
    }
};

//opens a colorbox to edit the date of one of the events.
var dateEdit = function (indx) {
    $.colorbox({html: '<div id="cbDateEdit"></div>', width: '350', height: '410px'});
    appendHTML(forms['datePicker'](indx), 'cbDateEdit');
};

//opens a colorbox to edit the title of one of the events.
var titleEdit = function (indx) {
    $.colorbox({html:'<div id="cbTitleEdit"></div>', width: '300px', height: '150px'});
    appendHTML(forms['editTitle'](indx), 'cbTitleEdit');
};

//opens a colorbox to edit the description of one of the events.
var descriptionEdit = function (indx) {
    $.colorbox({html: '<div id="cbDescriptionEdit"></div>', width: '300px', height: '150px'});
    appendHTML(forms['editDescription'](indx), 'cbDescriptionEdit');
};

//sets whether the event is active or not.
var toggleActive = function (obj, bool) {
    var indx = parseInt(obj.substring(4, obj.length), 10);
    console.log(obj, indx);
    if(bool != $v().events()[indx].blnActive) {
        $v().events()[indx].blnActive = bool;
        cmd.update(indx);
    } 
};

//creates all the html for the menu.
var parseMenu = function (menu) {
	var optionsHTML = [];
	$.each(menu.options, function(indx0, LyrOption0) {
		optionsHTML[indx0] = '<li><a href="#">'+LyrOption0.title+'</a>';
        $.each(LyrOption0.options, function(indx1, secndLyrOpts) {
            if(indx1 === 0) {
                optionsHTML[indx0] += '<ul>';
            }
            optionsHTML[indx0] += '<li><a href="#" onclick="'+secndLyrOpts.onclick+'">'+secndLyrOpts.title+'</a></li>';
        });
        optionsHTML[indx0] += '</ul></li>';
	});
	var html = '<div class="container" style="width:'+menu.width+';"><div id="'+menu.id+'"><div class="compactanchor"><button class="editBtn">'+menu.title+'</button></div><ul>';
	$.each(optionsHTML, function() {
		html += this;
	});
	return html + '</ul></div></div>';
};


