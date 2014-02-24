
var menuObjROFLCOPTER = {
    type: 'div',
    id: 'fileButton',
    class: 'button',
    text: 'File',
    children: [
        {
            type: 'div',
            id: 'fileMenu',
            class: 'theme-theme2',
            children: [
                {
                    type: 'div',
                    class: 'compactanchor',
                    
                }    
            ]
        }    
        
    ]
};


var parsetypeSandBox = function (type) {
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
        },
        menu: function (element) {
            var html = {
                start: '<ul',
                end: '></ul>',
            };
            return html.start + ico(element) + html.end;
        },
        menuButton: function (element) {
            var html = {
                start: '<li',
                end: undefined !== element.text ? '>' + element.text + '</li>' : '></li>',
            };
            return html.start + ico(element) + html.end;
        }
    };
    return undefined !== options[type] ? options[type] : undefined;
};