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
                        onclick: "console.log('Active true button')", //Standard function call just in quotes.
                    },
                    {
                        title: 'false', //Text for child option.
                        onclick: "console.log('Active false button')", //Standard function call just in quotes.
                    },
                ],
            },
            {
                title: 'Date', //Text for parent option.
                options: [
                    {
                        title: 'Pick Date', //Text for child option.
                        onclick: "dateFunc()", //Standard function call just in quotes.
                    },
                ],
            },
            {
                title: 'Delete', //Text for parent option.
                options: [
                    {
                        title: 'This', //Text for child option.
                        onclick: "console.log('Delete This button')", //Standard function call just in quotes.
                    },
                    {
                        title: 'Time', //Text for child option.
                        onclick: "console.log('Delete Time button')", //Standard function call just in quotes.
                    },
                ],
            },
            {
                title: 'New', //Text for parent option.
                options: [
                    {
                        title: 'Event', //Text for child option.
                        onclick: "console.log('New Event button')", //Standard function call just in quotes.
                    },
                    {
                        title: 'Time', //Text for child option.
                        onclick: "console.log('New Time button')", //Standard function call just in quotes.
                    },
                ],
            },
        ],
    };
};

var dateFunc = function () {
    var htmlJson = parseDpJson(jsonDtPkr({
        id: 'dp0',
    }));
    $.colorbox({html:htmlJson.html, width: '310px', height: '310px'});
    if(undefined !== htmlJson.css) {
        $.each(htmlJson.css, function () {
            this();
        });
    }
    if(undefined !== htmlJson.functions) {
        $.each(htmlJson.functions, function () {
            this(); 
        });
    }
};

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