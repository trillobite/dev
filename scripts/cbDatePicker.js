
var jsonDtPkr = function (prop) {
    return {
        id: prop.id,
        class: undefined !== prop.class ? prop.class : undefined,
        title: undefined !== prop.title ? prop.title : undefined,
        div: [
            {
                //datePicker
                id: 'dpDtPkr',
                class: undefined,
                title: undefined,
                css: function () {
                    $('#'+jsonDtPkr(prop).div[0].id).css({
                        'width': '100%',
                        'height': '50%',
                        'text-align': 'inherit',
                    });
                },
                functions: [
                    function () { //what to execute after div is added.
                        $('#'+jsonDtPkr(prop).div[0].id).datepicker();
                    },
                ],
            },
            {
                //submit button
                id:'btnSubmit',
                class: undefined,
                title: undefined,
                css: function() {
                    $('#'+jsonDtPkr(prop).div[1].id).css({
                        'width': '100%',
                        'height': '30px',
                        'text-align': 'inherit',
                    });
                },
                button: {
                    id: 'submitBtn0',
                    title: 'submit',
                    onclick: 'console.log($(\'#dpDtPkr\').datepicker(\'getDate\'))',
                },
                functions: [
                    function() {
                        $('#submitBtn0').css({
                            'width': '100px',
                            'height': '30px',
                        });
                    },
                ],
            }
        ],
        css: function () {
            $('#'+jsonDtPkr(prop).id).css({
                'width': '300px',
                'height': '200px',
                'text-align': 'center',
                'background-color':'#A0C400',
            });
        },
        functions: undefined, //what to execute after div is added.
    };
};

var parseDpJson = function (dpJson) {
    var prop = {
        id: dpJson.id !== undefined ? 'id="'+dpJson.id+'"' : '',
        class: dpJson.class !== undefined ? 'class="'+dpJson.class+'"' : '',
        title: dpJson.title !== undefined ? dpJson.title : '',
        css: dpJson.css !== undefined ? dpJson.css : undefined,
        functions: dpJson.functions !== undefined ? dpJson.functions : undefined,
    };
    var htmlDivs = '';
    $.each(dpJson.div, function () {
        htmlDivs += undefined !== this.id ? '<div id="'+this.id+'"' : '<div';
        htmlDivs += undefined !== this.class ? ' class="'+this.class+'">' : '>';
        htmlDivs += undefined !== this.title ? this.title : '';

        if(undefined !== this.button) {
            var btnHTML = '';
            btnHTML += undefined !== this.button.class ? '<button id="'+this.button.id+'" class="'+this.button.class : '<button id="'+this.button.id;
            btnHTML += undefined !== this.button.onclick ? '" onclick="'+this.button.onclick+'">' : ' >';
            btnHTML += undefined !== this.button.title ? this.button.title + '</button>' : '</button>';
            htmlDivs += btnHTML;
        }
    });
    var html = function () {
        return '<div '+prop.id+prop.class+'>'+prop.title+htmlDivs+'</div>';
    };
    var retDef = {
        html: html(),
        functions: [],
        css: [],
    };
    if(undefined !== dpJson.css) {
        retDef.css[retDef.css.length] = dpJson.css;
    }
    if(undefined !== dpJson.functions) {
        $.each(dpJson.functions, function () {
            retDef.functions[retDef.functions.length] = this; 
        });
    }
    $.each(dpJson.div, function() {
        if(undefined !== this.functions) {
            $.each(this.functions, function () {
                retDef.functions[retDef.functions.length] = this; 
            });
        }
        if(undefined !== this.css) {
            retDef.css[retDef.css.length] = this.css;
        }
    });
    return retDef;
};
