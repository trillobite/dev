var jsonObj = function (input) {
    var container = {
        type: 'div',
        id: undefined !== input.id ? input.id : undefined,
        class: undefined !== input.class ? input.class : undefined,
        text: undefined,
        children: [],
    };
    $.each(input.children, function() {
        container.children[container.children.length] = this;
    });
};