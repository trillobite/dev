
//example json object, type this into chrome console:
/*
    appendHTML(jsonObj({
        id: 'helloWorld',
    }), 'id if blank div element here in quotes');
*/
var jsonObj = function (input) {
    return { //always needs a container, and is always a div.
        type: 'div',
        id: undefined !== input.id ? input.id : undefined,
        class: undefined !== input.class ? input.class : undefined,
        text: undefined,
        onclick: undefined,
        functions: [function () {
            $('#'+input.id).css({
                'width': '85%',
                'height': '40px',
                'border': '1px solid black',
            });
        }],
        children: [
            {
                type: 'button',
                id: 'btnTest0',
                class: undefined,
                text: 'hello world!',
                onclick: "console.debug('you clicked the button!')",
                functions: [function () {
                        console.debug('executed after button clicked!');
                }], 
            },    
            {
                type: 'div',
                id: 'textboxDiv',
                class: undefined, 
                text: undefined,
                onclick: undefined,
                functions: [function () {
                    $('#'+'textboxDiv').css({
                        'width': '100%',
                        'height': 'auto',
                        'border': '1px solid black',
                    });
                }],
                children: [
                    {
                        type: 'textbox',
                        id: 'textbox0',
                        class: undefined,
                        text: undefined,
                        onclick: undefined,
                        functions: undefined,
                    }    
                ],
            },
        ],
    };
};

//Returns a small chunk of HTML as a string back to the parent function.
//Can produce HTML for a button, text box, or a div element.
var parsetype = function (type) {
    function ico(element) {
        var html = {
            id: undefined !== element.id ? ' id="'+element.id+'"' : '',
            class: undefined !== element.class ? ' class="'+element.class+'"' : '',
            onclick: undefined !== element.onclick ? ' onclick="'+element.onclick+'"' : '',
        };
        return html.id + html.class + html.onclick;
    }
    var options = {
        textbox: function (element) {
            var html = {
                start: '<input type="text"',
                end: '><input />',
            };
            return html.start + ico(element) + html.end;
        },
        button: function (element) {
            var html = {
                start: '<button type="button"',
                end: element.text ? '>' + element.text + '</button>' : '></button>',
            };
            return html.start + ico(element) + html.end;
        },
        div: function (element) {
            var html = {
                start: '<div',
                end: element.text ? '>' + element.text + '</div>' : '></div>',
            };
            return html.start + ico(element) + html.end;
        },
    };
    return undefined !== options[type] ? options[type] : undefined;
};

//recursive function, simply loops until there are no more children objects,
//uses jQuery to append to the parent object (usually a div element).
function appendHTML(jsonObj, container) {
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
