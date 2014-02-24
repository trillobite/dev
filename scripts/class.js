/*

                                                ~MVP CODE LIBRARY~
    DESCRIPTION: A code library to easily manage an HTML5 Canvas using JQuery and Kinetic JS.
                 Most specifically, it is best used to manage image and text objects on the canvas, with the backend
                 being C# and Microsoft SQL.

    AUTHOR: Jesse Parnell

                                        *PROPERTY OF MULTI VISUAL PRODUCTS*
*/

/*
    the almost initial initializer function, must define global variable "stage", and an init variable before running the initializer.

    example: 
    var stage = new Kinetic.Stage();
    var init = {
        container: '#divID',
        length: 800, //if not defined, default is size of div defined in css styles.
        height: 600, //if not defined, default is size of div defined in css styles.
        layers: 5, //if undefined, default is 0.
        background: 'images/nasaSpace.jpg', //if undefined, no background.
    }
    _init(init);
*/
function _init(init) {
    if (undefined != init.width && undefined != init.height) {
        stage.width = init.width;
        stage.height = init.height;
        $(init.container).css({
            'width': init.width,
            'height': init.height,
        });
    }
    stage.container = init.container;
    stage.add(new Kinetic.Layer);
    for (i = 0; i < init.layers - 1; ++i) {
        var lyr = new Kinetic.Layer();
        stage.add(lyr);
    }
    if (undefined != init.background) {
        $(init.container).css({
            'background-image': 'url(' + init.background + ')'
        });
    }
}

//easier call to commonly used mvpCanvas functions.
function $m(obj0, obj1) {
    return {
        get: function (arrObjs) {
            var retObj;
            $.each(arrObjs, function () {
                if (this._id == obj0) {
                    retObj = this;
                }
            });
            return retObj;
        },
        defer: {
            eq: function (afterResolve, beforeResolve) { mvpCanvas().deferEq(obj0, obj1, afterResolve, beforeResolve) },
            ne: function (afterResolve, beforeResolve) { mvpCanvas().defer(obj0, obj1, afterResolve, beforeResolve) },
            neObj: function () { mvpCanvas().deferNe(obj0) },
        },
        track: function (obj0, obj1) {
            if (obj1) {
                if ($m(obj0).typ == 'array') {
                    mvpObjTrack().trackArr(obj0, obj1);
                } else {
                    if ($m(obj0).typ == 'array') {
                        mvpObjTrack().trackArr(obj0);
                    } else {
                        mvpObjTrack().trackObj(obj0, obj1);
                    }
                }
            }
        },
        typ: mvpCanvas().getType(obj0),
        width: mvpCanvas().objGetWidth(obj0),
        height: mvpCanvas().objGetHeight(obj0),
        set: { //$m('#canvasLeft').set.background(imgSrc);
            //background: function (src) { mvpCanvas().chngDivBkgrnd(obj0, src); },
            background: function(tmpStage, callback) { mvpCanvas().bkgrndSet(tmpStage, obj0, callback); },
        },
        add: { //$m(layer).add(img0).img(index, x, y);
            img: function (img, x, y, index) { namespaceImg().simpleAddImg(img, obj0, x, y, index); },
            obj: function (classObj, index) { namespaceImg().imgAddFromObj(classObj, obj0, index); },
            src: function (srcObj, index) { namespaceImg().addFromSrc(srcObj, obj0, index); },
        }, 
        x: mvpCanvas().objGetX(obj0),
        y: mvpCanvas().objGetY(obj0),
        z: mvpCanvas().objGetZ(obj0),
    }
}

function $img(val) { //$img(val).anchors.add(layer);
    return {
        add: {
            img: function () { img().addImg(val); },
            obj: function (layer, index) { namespaceImg().imgAddFromObj(val, layer, index); },
            src: function (layer, index) { namespaceImg().addFromSrc(val, layer, index); },
        },
        anchors: {
            add: function (layer) { attachAnchors(val, layer); },
            reset: function () { rstAnchors(val); },
            remove: function () { rmAnchors(val); },
        },
        Kinetic: {
            img: function (z, index) {
                if (undefined == z) {
                    return namespaceImg().kinImgFromSrc(val); //returns a draggable kinetic image.
                } else {
                    return namespaceImg().mkKinImg0(val, z, index);
                }
            }
        },
        set: {
            name: function (name) { val.setName(name) },
            listeners: function () { namespaceImg().addImageListeners(val); },
        },
    }
}

function $add(val) {
    return {
        img: {
            byImg: function (layer, index, x, y) { $img(val).add.img(layer, index, x, y); },
            byObj: function (layer, index) { $img(val).add.obj(layer, index); },
            bySrc: function (layer, index) { $img(val).add.src(layer, index); },
        },
        menu: function (layer) { layer.add(val); },
        txt: function (layer, index) { namespaceText().addText(val, layer, index); },
    }
}

/*
                                    SQL QUERY OBJECT EXAMPLE.

    //sql execute object example, all possible options.
    var sql = {
        // proposed: db: undefined, //type: int, defines which database to run sql on.
        id: undefined, //type: int, defines the row to edit.
        obj: undefined, //type: object, Kinetic JS object.
        objType: undefined, //type: string, 'text' or 'Image' or 'Group.Image'
        objLayer: undefined, //type: int, defines a specific layer that the object is in.
        queryType: undefined, //type: string, 'sel', 'upd', 'ins', or 'del'
        cols: [], //type: array of string, defines the colums for the select.
        sqlObj: undefined, //SQL string converted object.
        strUsr: undefined, //type: string, the string version of the user name.
        usr: undefined, //int represents the user.
        tb: undefined, //type: int, defines which table to run sql on.
    }
*/

function $sql(obj) {
    return {
        execute: function(callback) { return dataModel().sqlExecute(obj, callback) },
        conv: {
            img: function (imgProps) { return convert.conv2ImgObjs(obj, imgProps); },
            txt: function () { return dataModel().conv2TxtObjs(obj); },
            bkgrnd: function () { return dataModel().conv2BkgrndObjs(obj); },
        },
        get: function (callback) { return mvpCanvas().genericXMLHTTPSend(obj, callback); }, //manage sql directly from the XMLHTTP string.
        toSQL: function () { return dataModel().toSQL(obj); },
    };
}

function $get(obj) {
    return {
        bkgrndClass: function () { return mvpCanvas().backgroundClass(obj); },
        data: function (callback) { return $sql(obj).get(callback); },
        id: function () { return mvpCanvas().objGetId(obj); },
        imgClass: function () { return mvpCanvas().imgClass(obj); },
        layered: function () { return overlap().getAllLayered(); },
        relX: function (parentWidth, objWidth) { return mvpCanvas().calcObjXPos(obj, parentWidth, objWidth) },
        relY: function (parentHeight, objHeight) { return mvpCanvas().calcObjYPos(obj, parentHeight, objHeight) },
        src: function () { return mvpCanvas().objGetSrc(obj); },
        type: function () { return $m(obj).typ; },
        txtClass: function () { return mvpCanvas().txtClass(obj); },
    };
}

function mvpCanvas() {
    return {

        imgClass: function (intID) {
            return {
                intID: intID,
                zIndex: 0,
                imgSrc: null,
                imgPosX: 0,
                imgPosY: 0,
                imgHeight: 0,
                imgWidth: 0,

                getID: function () { return this.intID; },
                getZIndex: function () { return this.zIndex; },
                getSrc: function () { return this.imgSrc; },
                getPos: function () { return this.imgPos; },
                getX: function () { return this.imgPosX; },
                getY: function () { return this.imgPosY; },
                getHeight: function () { return this.imgHeight; },
                getWidth: function () { return this.imgWidth; },

                setZIndex: function (set) { this.zIndex = set; },
                setSrc: function (set) { this.imgSrc = set; },
                setX: function (set) { this.imgPosX = set; },
                setY: function (set) { this.imgPosY = set; },
                setHeight: function (set) { this.imgHeight = set; },
                setWidth: function (set) { this.imgWidth = set; },
                setID: function (set) { this.intID = set; }
            };
        },

        txtClass: function (intID) {
            return {
                intID: intID,
                zIndex: 0,
                text: 'null',
                textPosX: 0,
                textPosY: 0,
                textFont: 'Arial',
                textSize: 12,
                textColor: 'black',

                getID: function () { return this.intID; },
                getZ: function () { return this.zIndex; },
                getText: function () { return this.text; },
                getX: function () { return this.textPosX; },
                getY: function () { return this.textPosY; },
                getFont: function () { return this.textFont; },
                getSize: function () { return this.textSize; },
                getColor: function () { return this.textColor; },

                setZ: function (set) { this.zIndex = set; },
                setText: function (set) { this.text = set; },
                setX: function (set) { this.textPosX = set; },
                setY: function (set) { this.textPosY = set; },
                setFont: function (set) { this.textFont = set; },
                setSize: function (set) { this.textSize = set; },
                setColor: function (set) { this.textColor = set; },
                setID: function (set) { this.intID = set; }
            };
        },


        //Prerequisites: Recommended only for Kinetic JS projects, but not required.
        //defines a Kinetic text object. (javaScript Constructor)


        //defines properties of a background image. (javaScript Constructor)
        backgroundClass: function (id) {
            return {
                imgSrc: undefined,
                divID: 'null',
                id: id,
                getSrc: function () { return this.imgSrc; },
                getDivID: function () { return this.divID; },
                setSrc: function (set) { this.imgSrc = set; },
                setDivID: function (set) { this.divID = set; }
            };
        },

        //calculates the best x quordinate for a menu box, or any rectangular shape
        //by how you want it placed on the canvas.
        calcObjXPos: function (relativePosition, parentWidth, objWidth) {
            var posX = {
                topLeft: 0,
                bottomLeft: 0,
                topRight: (parentWidth - objWidth),
                bottomRight: (parentWidth - objWidth),
                topCenter: ((parentWidth / 2) - (objWidth / 2)),
                bottomCenter: ((parentWidth / 2) - (objWidth / 2)),
                rightCenter: (parentWidth - objWidth),
                leftCenter: 0,
            };
            return posX[relativePosition] ? posX[relativePosition] : 0;
        },

        //calculates the best y quordinate for a menu box, or any rectangular shape
        //by how you want it placed on the canvas.
        calcObjYPos: function (relativePosition, parentHeight, objHeight) {
            var posY = {
                topLeft: 0,
                bottomLeft: (parentHeight - objHeight),
                topRight: 0,
                bottomRight: (parentHeight - objHeight),
                topCenter: 0,
                bottomCenter: (parentHeight - objHeight),
                rightCenter: ((parentHeight / 2) - (objHeight / 2)),
                leftCenter: ((parentHeight / 2) - (objHeight / 2)),
            };
            return posY[relativePosition] ? posY[relativePosition] : 0;
        },

        //Prerequisites: Recommended only for Kinetic JS projects, but not required.
        //tests all known possible ways to get width. If one method works, it makes sure that
        //there is not another method which returns a value not equal to 0.
        objGetWidth: function (tmpObj) {
            var width = 0;
            var undef = undefined;
            if (undef != tmpObj) {
                try {
                    width = tmpObj.getWidth() != undef ? tmpObj.getWidth() : 0;
                    width = width == 0 || width == undef ? tmpObj.width : width;
                    width = width == 0 || width == undef ? tmpObj.attrs.width : width;
                    width = width == 0 || width == undef ? tmpObj.attrs.getWidth() : width;
                    width = width == 0 || width == undef ? tmpObj.clientWidth : width;
                } catch (w) {
                    try {
                        width = tmpObj.width != undef ? tmpObj.width : 0;
                        width = width == 0 || width == undef ? tmpObj.attrs.width : width;
                        width = width == 0 || width == undef ? tmpObj.attrs.getWidth() : width;
                        width = width == 0 || width == undef ? tmpObj.clientWidth : width;
                    } catch (x) {
                        try {
                            width = tmpObj.attrs.width != undef ? tmpObj.attrs.width : 0;
                            width = width == 0 || width == undef ? tmpObj.attrs.getWidth() : width;
                            width = width == 0 || width == undef ? tmpObj.clientWidth : width;
                        } catch (y) {
                            try {
                                width = tmpObj.attrs.getWidth() != undef ? tmpObj.attrs.getWidth() : 0;
                                width = width == 0 || width == undef ? tmpObj.clientWidth : width;
                            } catch (z) {
                                try {
                                    width = tmpObj.clientWidth != undef ? tmpObj.clientWidth : 0;
                                } catch (a) {
                                    if (width == 0) {
                                        //console.debug('ERROR:', z); //object must not of had any contained width methods.
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return width;
        },

        //Prerequisites: Recommended only for Kinetic JS projects, but not required.
        //tests all known possible ways to get height. If one method works, it makes sure
        //there is not another method which returns a value not equal to 0.
        objGetHeight: function (tmpObj) {
            var height = 0;
            var undef = undefined;
            if (undef != tmpObj) {
                try {
                    height = tmpObj.getHeight() != undef ? tmpObj.getHeight() : 0;
                    height = height == 0 || height == undef ? tmpObj.height : height;
                    height = height == 0 || height == undef ? tmpObj.attrs.height : height;
                    height = height == 0 || height == undef ? tmpObj.attrs.getHeight() : height;
                    height = height == 0 || height == undef ? tmpObj.clientHeight : height;
                } catch (w) {
                    try {
                        height = tmpObj.height != undef ? tmpObj.height : 0;
                        height = height == 0 || height == undef ? tmpObj.attrs.height : height;
                        height = height == 0 || height == undef ? tmpObj.attrs.getHeight() : height;
                        height = height == 0 || height == undef ? tmpObj.clientHeight : height;
                    } catch (x) {
                        try {
                            height = tmpObj.attrs.height != undef ? tmpObj.attrs.height : 0;
                            height = height == 0 || height == undef ? tmpObj.attrs.getHeight() : height;
                            height = height == 0 || height == undef ? tmpObj.clientHeight : height;
                        } catch (y) {
                            try {
                                height = tmpObj.attrs.getHeight() != undef ? tmpObj.attrs.getHeight() : 0;
                                height = height == 0 || height == undef ? tmpObj.clientHeight : height;
                            } catch (z) {
                                try { 
                                    height = tmpObj.clientHeight != undef ? tmpObj.clientHeight : 0;
                                } catch (e) {
                                    if (height == 0) {
                                        //console.debug('ERROR:', z); //object must not of had any contained width methods.
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return height;
        },

        //Prerequisites: Recommended only for Kinetic JS projects, but not required.
        //if one way of getting x pos returns 0 or undefined, this will try another way, if all attempts return
        //undefined, error is thrown and 0 is returned.
        objGetX: function (tmpObj) {
            var undef = undefined;
            var xPos = 0;
            if (undef != tmpObj) {
                try {
                    xPos = tmpObj.getX() != undef ? tmpObj.getX() : 0;
                    xPos = xPos == 0 || xPos == undef ? tmpObj.x : xPos;
                    xPos = xPos == 0 || xPos == undef ? tmpObj.attrs.getX() : xPos;
                    xPos = xPos == 0 || xPos == undef ? tmpObj.attrs.x : xPos;
                } catch (w) {
                    try {
                        xPos = tmpObj.x != undef ? tmpObj.x : 0;
                        xPos = xPos == 0 || xPos == undef ? tmpObj.attrs.getX() : xPos;
                        xPos = xPos == 0 || xPos == undef ? tmpObj.attrs.x : xPos;
                    } catch (x) {
                        try {
                            xPos = tmpObj.attrs.getX() != undef ? tmpObj.attrs.getX() : 0;
                            xPos = xPos == 0 || xPos == undef ? tmpObj.attrs.x : xPos;
                        } catch (y) {
                            try {
                                xPos = tmpObj.attrs.x != undef ? tmpObj.attrs.x : 0;
                            } catch (z) {
                                if (xPos == 0) {
                                    //console.debug('ERROR: ', z); //object must not have contained any of the tried functionality.
                                }
                            }
                        }
                    }
                }
            }
            return xPos;
        },

        //Prerequisites: Recommended only for Kinetic JS projects, but not required.
        //if one way of getting y pos returns 0 or undefined, this will try another way, if all attempts return
        //undefined, error is thrown and 0 is returned.
        objGetY: function (tmpObj) {
            var undef = undefined;
            var yPos = 0;
            if (undef != tmpObj) {
                try {
                    yPos = tmpObj.getY() != undef ? tmpObj.getY() : 0;
                    yPos = yPos == 0 || yPos == undef ? tmpObj.y : yPos;
                    yPos = yPos == 0 || yPos == undef ? tmpObj.attrs.getY() : yPos;
                    yPos = yPos == 0 || yPos == undef ? tmpObj.attrs.y : yPos;
                } catch (w) {
                    try {
                        yPos = tmpObj.y != undef ? tmpObj.y : 0;
                        yPos = yPos == 0 || yPos == undef ? tmpObj.attrs.getY() : yPos;

                        yPos = yPos == 0 || yPos == undef ? tmpObj.attrs.y : yPos;
                    } catch (x) {
                        try {
                            yPos = tmpObj.attrs.getY() != undef ? tmpObj.attrs.getY() : 0;
                            yPos = yPos == 0 || yPos == undef ? tmpObj.attrs.y : yPos;
                        } catch (y) {
                            try {
                                yPos = tmpObj.attrs.y != undef ? tmpObj.attrs.y : 0;
                            } catch (z) {
                                if (yPos == 0) {
                                    //console.debug('ERROR:', z); //object must not have contained any of the tried functionality.
                                }
                            }
                        }
                    }
                }
            }
            return yPos;
        },
        
        //gets the z-index of a Kinetic JS object.
        objGetZ: function (tmpObj) {
            var undef = undefined;
            var z;
            if (undef != tmpObj) {
                try {
                    z = undef != tmpObj.z ? tmpObj.z : undef;
                    z = undef == z && undef != tmpObj.attrs.z ? tmpObj.attrs.z : z;
                    z = z == undef && tmpObj.children[0].attrs.z != undef ? tmpObj.children[0].attrs.z : z;
                } catch (e) {
                    try {
                        z = undef != tmpObj.attrs.z ? tmpObj.attrs.z : z;
                        z = undef == z && undef != tmpObj.children[0].attrs.z ? tmpObj.children[0].attrs.z : z;
                    } catch (a) {
                        try {
                            z = undef != tmpObj.children[0].attrs.z ? tmpObj.children[0].attrs.z : z;
                        } catch (b) {
                            //console.debug('objGetz:', b);
                        }
                    }
                }
            }
            return z;
        },

        //similar to typeof, now more specific for Kinetic JS objects.
        getType: function (objVar) {
            var undef = undefined;
            var strReturn = undef;
            if (undef != objVar) {
                function toType(obj) {
                    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
                }

                try {
                    strReturn = objVar.className != undef ? objVar.className : strReturn;
                    strReturn = strReturn == undef && objVar.nodeType != undef ? objVar.nodeType : strReturn;
                    strReturn = strReturn == undef && toType(objVar) != undef ? toType(objVar) : strReturn;
                    strReturn = strReturn == undef && typeof objVar != undef ? typeof objVar : strReturn;
                } catch (a) {
                    try {
                        strReturn = objVar.nodeType != undef ? objVar.nodeType : strReturn;
                        strReturn = strReturn == undef && toType(objVar) != undef ? toType(objVar) : strReturn;
                        strReturn = strReturn == undef && typeof objVar != undef ? typeof objVar : strReturn;
                    } catch (b) {
                        try {
                            strReturn = toType(objVar) != undef ? toType(objVar) : strReturn;
                            strReturn = strReturn == undef && typeof objVar != undef ? typeof objVar : strReturn;
                        } catch (c) {
                            try {
                                strReturn = typeof objVar != undef ? typeof objVar : strReturn;
                            } catch (d) {
                                //console.debug('Error getType: ' + d);
                                //console.debug(objVar);
                            }
                        }
                    }
                }
                if (strReturn == 'Group') {
                    var tmp;
                    try {
                        tmp = objVar.children[0].className;
                    } catch (e) {
                        console.debug('Error getType: ', e);
                    }
                    if (tmp) {
                        strReturn = strReturn + '.' + tmp;
                    }
                }
            }
            return strReturn;
        },

        //Gets the image source of an image object.
        objGetSrc: function (obj) {
            var undef = undefined;
            var source;
            if (this.getType(obj) == 'Group.Image' || this.getType(obj) == 'Image') {
                try {
                    source = undef != obj.src ? obj.src : undef;
                    source = undef == source ? undef != obj.attrs.image.src ? obj.attrs.image.src : undef : undef;
                    source = undef == source ? undef != obj.children[0].attrs.image.src ? obj.children[0].attrs.image.src : undef : undef;
                } catch (a) {
                    try {
                        source = undef != obj.attrs.image.src ? obj.attrs.image.src : undef;
                        source = undef == source ? undef != obj.children[0].attrs.image.src ? obj.children[0].attrs.image.src : undef : undef;
                    } catch (b) {
                        try {
                            source = undef != obj.children[0].attrs.image.src ? obj.children[0].attrs.image.src : undef;
                        } catch (c) {

                        }
                    }
                }
            }
            return source;
        },

        //gets the id of a text or image object, to be used to make updates to the SQL database.
        objGetId: function (obj) {
            var undef = undefined;
            var id;
            if (this.getType(obj) == 'Group.Image' || this.getType(obj) == 'Text') {
                try {
                    id = undef != obj.attrs.id ? obj.attrs.id : undef;
                    id = undef == id ? undef != obj.id ? obj.id : undef : id;
                } catch(a) {
                    try {
                        id = undef != obj.id ? obj.id : undef;
                    }catch (b) {
                        //console.debug('objGetId:', b);
                    }
                }
            }
            return id;
        },

        //Prerequisites: JQuery.
        //generic way of retrieving data from server side scripts Asynchroniously.
        genericXMLHTTPSend: function (webMthdURL, callback) {
            if (window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest();
            }
            xmlhttp.open('GET', webMthdURL, true);
            xmlhttp.send();
            var setRtrnVal = function () {
                var deferred = new $.Deferred();
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        rtrnVal = xmlhttp.responseText
                        deferred.resolve();
                    }
                }
                return deferred.promise();
            };

            setRtrnVal().done(function () {
                if (undefined != callback) {
                    if (undefined == rtrnVal || rtrnVal == "") {
                        callback('there was no returned value');
                    } else {
                        callback(rtrnVal);
                    }
                }
            });
        },

        /*
            var input = {
                dfrdObj: obj0,
                neObj: undef,
                afterResolve: function() { console.log(result) },
            }
        */
        deferNe: function(input) {
            var undef = undefined;
            var defObj = function () {
                var dfd = new $.Deferred();
                if (input.dfrdObj != input.neObj) {
                    dfd.resolve();
                }
                return dfd.promise();
            }
            defObj().done(function() {
                if(undef != input.afterResolve) {
                    input.afterResolve();
                }
            })
        },

        //defers an operation until the check and object are not equal.
        defer: function (obj, check, afterResolve, beforeResolve) {
            var undef = undefined;
            var defObj = function () {
                var deferred = new $.Deferred();
                if(undef != beforeResolve) {
                    beforeResolve();
                }
                if (obj != check) {
                    deferred.resolve();
                }
                return deferred.promise();
            }
            defObj().done(function () {
                if(undef != afterResolve) {
                    afterResolve();
                }
            });
        },

        //defers the operation until the object and the check are equal.
        deferEq: function (obj, check, afterResolve, beforeResolve) {
            var undef = undefined;
            var defObj = function () {
                var deferred = new $.Deferred();
                if(undef != beforeResolve) {
                    beforeResolve();
                }
                if (obj === check) {
                    deferred.resolve();
                }
                return deferred.promise();
            };
            defObj().done(function () {
                if(undef != afterResolve) {
                    afterResolve();
                }
            });
        },

        //Prerequisites: None.
        //changes the background on any classed or id'd div element.
        chngDivBkgrnd: function (object, src) {
            if (src != '"') {
                $(object).css('background-image', 'url(' + "'" + src + "'" + ')');
            }
        },

        bkgrndSet: function (tmpStage, bkObj, callback) {
            var deferred = new $.Deferred();
            var undef = undefined;
            var dimens = undef;
            var getDimens = function () {
                
                if (undef != bkObj.height && undef != bkObj.width) {
                    dimens = {
                        width: $m(bkObj).width,
                        height: $m(bkObj).height,
                    }
                    deferred.resolve();
                } else {
                    var varImg = new Image();
                    varImg.src = bkObj.src;
                    varImg.onload = function () {
                        var kinImg = img(varImg).mkKinImg({
                            img: varImg,
                            id: 0,
                            z: 0,
                        });
                        dimens = {
                            width: $m(kinImg).width,
                            height: $m(kinImg).height,
                        };
                        deferred.resolve();
                    };
                }
                return deferred.promise();
            };
            getDimens().then(
                function () {
                    //THIS IS NOT EXECUTING!!!
                    $(bkObj.divID).css({
                        'background-image': 'url(' + "'" + bkObj.src + "'" + ')',
                        'width': dimens.width,
                        'height': dimens.height,
                    });
                    tmpStage.setWidth(dimens.width);
                    tmpStage.setHeight(dimens.height);
                    callback();
                },
                function () {
                    console.log('bkgrndSet: failed.')
                }
            );
        },

        //Prerequisites: None.
        //takes an image, gets the size, and sets the html div width and height to the same.
        setDivSizeByImage: function (img0, divElm) {
            divElm.style.width = $m(img0).width;
            divElm.style.height = $m(img0).heigh;
        },
    };
}

//----------------------------------------------------------------------------------------------------------------------------


/*
                                        ~CANVAS OBJECT TRACKING~

    Prerequisite: mvpCanvas.js

    Description: This sub library will allow the ability to easily track any object on the Kinetic
                 JS stage, may work with kinetic obj immitations and clones.

    Written By: 
    Jesse Parnell

                                    PROPERTY OF MULTI VISUAL PRODUCTS.
*/

var trackedObj = new Array(); //may take over the duty of the image, text, background arrays. those are now depricated...
function mvpObjTrack() {
    return {
        //adds an object to the trackedObj array.
        trackObj: function (kinObj, uniqueID) {
            trackedObj[trackedObj.length] = betterTracking(kinObj, uniqueID);
        },

        //a better way of tracking an object on the canvas.
        betterTracking: function (kinObj, uniqueID) {
            var track = {
                obj: kinObj,
                bounds: {
                    upper: getUpperBounds(kinObj, uniqueID),
                    lower: getLowerBounds(kinObj, uniqueID),
                },
                typ: getType(kinObj),
                uniqueID: uniqueID,
                z: objGetZ(kinObj),
            };
            return track;    
        },

        mkID: function (kinObj) {
            return getType(kinObj) + trackedObj.length;
        },

        trackArr: function (objArr, idArr) {
            $.each(objArr, function (indx, obj) {
                idArr ? trackedObj(obj, idArr[indx]) : trackObj(obj, mkID(obj));
            });
        },

        //searches through the trackedObj array for the unique search, and returns the index of the object.
        trackedObjIndex: function (index, unique) {
            var indx;
            for (counter in trackedObj) {
                if (trackedObj[counter][index] == unique) {
                    indx = counter;
                }
            }
            return indx;
        },

        //returns all the tracked objects by the object type.
        returnTrackedObjs: function (typ) {
            var tmpArr = new Array();
            $.each(trackedObj, function () {
                if (this.typ == typ) {
                    tmpArr[tmpArr.length] = this;
                }
            });
            return tmpArr;
        },

        //returns a specific tracked object by the object uniqueID.
        returnTrackedObj: function (uniqueID) {
            var tmp;
            $.each(trackedObj, function () {
                if (this.uniqueID == uniqueID) {
                    tmp = this;
                }
            });
            return tmp;
        },

        getUpperBounds: function (kinObj, uniqueID) {
            return {
                x: function () { return $m(this.returnTrackedObj(uniqueID).obj).x },
                y: function () { return $m(this.returnTrackedObj(uniqueID).obj).y },
            }
        },

        getLowerBounds: function (kinObj, uniqueID) {
            return {
                x: function () { return this.returnTrackedObj(uniqueID).bounds.upper.x() + $m(this.returnTrackedObj(uniqueID).obj).width },
                y: function () { return this.returnTrackedObj(uniqueID).bounds.upper.y() + $m(this.returnTrackedObj(uniqueID).obj).height },
            }
        },
    };
}

/*
                                        <overlapp.js>
    Prerequisites: mvpCanvas.js, Kinetic JS, jQuery.
    Description: Looks at all the objects currently being tracked, and returns an array of objects that are within
                 bounds of one another.

    Written By:

    Jesse Parnell

                               PROPERTY OF MULTI VISUAL PRODUCTS.
*/
function overlap() {
    return {
        //will check to see if the two kinetic objects are overlapping.
        isOverlapping: function (obj0, obj1) {
            var overlap = false;
            console.debug(obj0, obj1);
            var obj0XMax = $m(obj0).x + $m(obj0).width;
            var obj0YMax = $m(obj0).y + $m(obj0).height;
            var obj1XMax = $m(obj1).x + $m(obj1).width;
            var obj1YMax = $m(obj0).y + $m(obj0).height;

            function xInBounds() {
                var inBounds = false;
                console.debug('xInBounds: ' + $m(obj1).x + ' < ' + obj0XMax + ' && ' + $m(obj1).x + ' > ' + $m(obj0).x);
                console.debug($m(obj1).x < obj0XMax && $m(obj1).x > $m(obj0).x);
                if ($m(obj1).x < obj0XMax && $m(obj1).x > $m(obj0).x) {
                    inBounds = true;
                } else {
                    console.debug('xInBounds2: ' + obj1XMax + ' < ' + obj0XMax + ' && ' + obj1XMax + ' > ' + $m(obj0).x);
                    console.debug(obj1XMax < obj0XMax && obj1XMax > $m(obj0).x);
                    if (obj1XMax < obj0XMax && obj1XMax > $m(obj0).x) {
                        inBounds = true;
                    }
                }
                return inBounds;
            }

            function yInBounds() {
                var inBounds = false;
                if ($m(obj1).y > $m(obj0).y && $m(obj1).y < obj0YMax) {
                    inBounds = true;
                } else {
                    if (obj1YMax > $m(obj0).y && obj1YMax < obj0YMax) {
                        inBounds = true;
                    }
                }
                return inBounds;
            }

            if (xInBounds() && yInBounds()) {
                overlap = true;
            }

            return overlap;
        },

        gtArrPos: function (arr) {
            var contains = new Array();
            $.each(arr, function (index0, val0) {
                $.each(val0, function (index1, val1) {
                    if (val1 == val0) {
                        contains[contains.length] = [index0, index1];
                    }
                });
            });
            return contains;
        },

        //checks weather the input array contains the two objects in any sub array.
        alreadyContain: function (arr, obj0, obj1) {
            var contains = false;
            $.each(arr, function (index, val) {
                if (arr[index] == [obj0, obj1] || arr[index] == [obj1, obj0]) {
                    contains = true;
                }
            });
            return contains;
        },

        //returns an array of all the objects which are being tracked that overlap.
        getAllLayered: function () {
            var arr = new Array();
            var counter = 0;
            var finished = false;

            $.each(trackedObj, function (counter, val0) {
                $.each(trackedObj, function (index, val) {
                    if (index != counter) {
                        if (isOverlapping(val0.obj, val.obj)) {
                            if (alreadyContain(arr, val0, val) == false) {
                                arr[arr.length] = [val0, val];
                            }
                        }
                    }
                });
            });
            return arr;
        },
    };
}

/*
                                <DATA MODEL>
                                //SQL UPDATES WILL HAVE TO ACCOUNT FOR Z-INDEXING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/
function dataModel() {
    return {
        //returns array of objects from raw data from the database.
        genObjArr: function (input) {
            var rawDta = input.split('","');
            var gatheringArr = new Array();
            var objData = function () {
                return {
                    id: undefined,
                    z: undefined,
                    type: undefined,
                    data: undefined,
                }
            };
            $.each(rawDta, function (indx, objVar) {
                if (!((indx + 1) % 4)) {
                    var tmp = new objData();
                    tmp.id = rawDta[indx - 3];
                    tmp.z = rawDta[indx - 2];
                    tmp.type = rawDta[indx - 1];
                    tmp.data = objVar;
                    gatheringArr[gatheringArr.length] = tmp;
                }
            });
            return gatheringArr;
        },

        //returns array of objects that match the obj type.
        getTypeObjs: function (objType, arr) {
            var retTypeArr = new Array();
            $.each(arr, function (indx, objVar) {
                if (objVar.type == objType) {
                    retTypeArr[retTypeArr.length] = objVar;
                }
            });
            return retTypeArr;
        },

        //takes an array of text objects preferably filtered from getTypeObjs, and returns
        //an array of mvp class text objects.
        conv2TxtObjs: function (objArr) {
            var txtObjs = new Array();
            $.each(objArr, function (indx0, objVal0) {
                var data = objVal0.data.split(',');
                $.each(data, function (indx, objVal) {
                    var tmpTxt = new $get(objVal0.id).txtClass();
                    if (!((indx + 1) % 6)) {
                        tmpTxt.zIndex = objVal0.z;
                        tmpTxt.text = data[indx - 5];
                        tmpTxt.textPosX = data[indx - 4].substring(1, data[indx - 4].length);
                        tmpTxt.textPosY = data[indx - 3].substring(0, data[indx - 3].length - 1);
                        tmpTxt.textSize = data[indx - 2].substring(1, data[indx - 2].length);
                        tmpTxt.textFont = data[indx - 1];
                        tmpTxt.textColor = objVal.substring(0, objVal.length - 1);
                        txtObjs[txtObjs.length] = tmpTxt;
                    }
                });
            });
            return txtObjs;
        },

        //takes an array of image objects preferably filtered from getTypeObjs, and returns
        //an array of mvp class image objects.
        conv2ImgObjs: function (objArr) {
            var imgObjs = new Array();
            $.each(objArr, function (indx0, objVal0) {
                var data = objVal0.data.split(',');
                $.each(data, function (indx1, objVal1) {
                    var tmpImg = new $get(objVal0.id).imgClass();
                    if (!((indx1 + 1) % 5)) {
                        tmpImg.imgSrc = data[indx1 - 4];
                        tmpImg.imgPosX = data[indx1 - 3].substring(1, data[indx1 - 3].length);
                        tmpImg.imgPosY = data[indx1 - 2].substring(0, data[indx1 - 2].length - 1);
                        tmpImg.imgHeight = data[indx1 - 1].substring(1, data[indx1 - 1].length);
                        tmpImg.imgWidth = objVal1.substring(0, objVal1.length - 1);
                        imgObjs[imgObjs.length] = tmpImg;
                    }
                });
            });
            return imgObjs;
        },

        //takes an array of image objects preferably filtered from getTypeObjs, and returns
        //an array of mvp class image objects.
        conv2BkgrndObjs: function (objArr) {
            var bkgrndObjs = new Array();
            var tmpBkrnd = {
                imgSrc: undefined,
                width: undefined,
                height: undefined
            };
            $.each(objArr, function () {
                var data = this.data.split(',');
                tmpBkrnd.imgSrc = data[0];
                if (data.length > 1) {
                    tmpBkrnd.width = data[1].substring(1, data[1].length);
                    tmpBkrnd.height = data[2].substring(0, data[2].length - 1);
                }
                bkgrndObjs[bkgrndObjs.length] = tmpBkrnd;
            });
            return bkgrndObjs;
        },

        //takes a Kinetic JS image object and converts it into a string to be used for a SQL update, or add.
        imgToSQL: function (imgGrp) {
            var strObj = imgGrp.children[0].attrs.image.src;
            var tmp = {
                src: strObj.substring(strObj.indexOf('images'),strObj.length),
                width: $m(imgGrp).width,
                height: $m(imgGrp).height,
                x: $m(imgGrp).x,
                y: $m(imgGrp).y,
            };
            return tmp.src + ',(' + tmp.x + ',' + tmp.y + '),(' + tmp.height + ',' + tmp.width + ')';
        },

        //takes a Kinetic JS text object and converts it into a string to be used for a SQL update, or add.
        txtToSQL: function (txtGrp) {
            var tmp = {
                txt: txtGrp.attrs.text,
                width: $m(txtGrp).width,
                height: $m(txtGrp).height,
                font: txtGrp.attrs.fontFamily,
                size: txtGrp.attrs.fontSize,
                fill: txtGrp.attrs.fill,
                x: $m(txtGrp).x,
                y: $m(txtGrp).y,
            };
            return tmp.txt + ',(' + tmp.x + ',' + tmp.y + '),(' + tmp.size + ',' + tmp.font + ',' + tmp.fill + ')';
        },

        //Can insert either a Text or Image Kinetic JS object, and it will detect and convert it into the proper
        //string value to be used for a SQL update, or add.
        toSQL: function (obj) {
            var type = $m(obj).typ;
            if (type.length > 4) { //then it is a container.
                return this.imgToSQL(obj);
            } else { //then it is a text object.
                return this.txtToSQL(obj);
            }
        },

        //automatically selects the proper sql management by queryType object.
        sqlExecute: function (sqlObj, callback) {
            var undef = undefined;
            var qt = sqlObj.queryType;
            var query = {
                sel: function () { return dataModel().sqlSelect(sqlObj, callback) },
                upd: function () { return dataModel().sqlUpdate(sqlObj, callback) },
                ins: function () { return dataModel().sqlInsert(sqlObj, callback) },
                del: function () { return dataModel().sqlRemove(sqlObj, callback) },
            };
            return query[qt] ? query[qt]() : undef;
        },

        //returns data from a sql select on the database.
        sqlSelect: function (selObj, callback) {
            var cols;
            $.each(selObj.cols, function (indx, obj) {
                if (indx == 0) {
                    cols = obj;
                } else {
                    cols = cols + ', ' + obj;
                }
            });
            var sql = 'sqlHandlers/select.ashx?tb=' + selObj.tb + '&col=' + cols;
            if (undefined != selObj.strUsr) {
                sql = sql + '&strUsr=' + selObj.strUsr;
            } else {
                sql = sql + '&usr=' + selObj.usr;
            }
            $sql(sql).get(callback);
        },

        //makes an update to an existing object in the SQL database.
        sqlUpdate: function (updtObj, callback) {
            var sql = 'sqlHandlers/update.ashx?tb=' + updtObj.tb + '&updt=' + updtObj.sqlObj + '&usr=' + updtObj.usr + '&id=' + updtObj.id;
            $sql(sql).get(callback);
        },

        //adds a new object to the SQL database.
        sqlInsert: function (insrtObj, callback) {
            var sql = 'sqlHandlers/insert.ashx?tb=' + insrtObj.tb + '&usr=' + insrtObj.usr + '&lyr=' + insrtObj.objLayer + '&typ=' + insrtObj.objType + '&insrt=' + insrtObj.sqlObj;
            $sql(sql).get(callback);
        },

        //removes an object from the sql database.
        sqlRemove: function (delObj, callback) {
            var sql = 'sqlHandlers/delete.ashx?tb=' + delObj.tb + '&id=' + delObj.id;
            $sql(sql).get(callback);
        },
    };
}

/*
                                <IMAGE JS>
    Prerequisites: kinetic.js, mvpCanvas.js

    Description: Will handle everything needed in order to add and manage Images on the 
    Kinetic Canvas.

    Written By:
    Jesse Parnell

    PROPERTY OF MULTI VISUAL PRODUCTS
*/

var convert = {
    defaultClass: {
        type: 'image',
        anchors: true,
        draggable: true,
        height: undefined,
        id: undefined,
        layer: 0,
        listeners: [
            function (obj) {
                obj.on('mouseover', function () {
                    document.body.style.cursor = 'move';
                });
            },
            function (obj) {
                obj.on('mouseout', function () {
                    document.body.style.cursor = 'default';
                });
                obj.on('click', function () {
                    slctdObj = this._id;
                    console.log($m(this).z);
                });
                obj.on('dragstart', function () {
                    slctdObj = this._id;
                });
            }
        ],
        src: undefined,
        width: undefined,
        x: undefined,
        y: undefined,
        z: undefined,
    },

    //takes an array of image objects preferably filtered from getTypeObjs, and returns
    //an array of mvp class image objects.
    conv2ImgObjs: function (objArr, tmpImg) {
        var imgObjs = new Array();
        $.each(objArr, function (indx0, objVal0) {
            var data = objVal0.data.split(',');
            $.each(data, function (indx1, objVal1) {
                if (!((indx1 + 1) % 5)) {
                    tmpImg.id = objVal0.id;
                    tmpImg.src = data[indx1 - 4];
                    tmpImg.x = data[indx1 - 3].substring(1, data[indx1 - 3].length);
                    tmpImg.y = data[indx1 - 2].substring(0, data[indx1 - 2].length - 1);
                    tmpImg.z = objVal0.z;
                    tmpImg.height = data[indx1 - 1].substring(1, data[indx1 - 1].length);
                    tmpImg.width = objVal1.substring(0, objVal1.length - 1);
                    imgObjs[imgObjs.length] = tmpImg;
                }
            });
        });
        return imgObjs;
    },
};

function img(obj) {
    return {
        mkKinImg: function (imgProp) {
            return new Kinetic.Image({
                x: 0,
                y: 0,
                z: obj.z,
                image: obj,
                shadowColor: 'black',
                shadowBlur: 10,
                shadowOffset: [2, 2],
                shadowOpacity: 0.6,
                name: 'image_' + imgProp.id,
                id: imgProp.id,
            });
        },
        sizeCheck: function () {
            if (undefined != obj.setWidth && undefined != obj.setHeight) {
                if (obj.setWidth > $m(stage).width || obj.setHeight > $m(stage).height) {
                    return {
                        width: $m(stage).width - 20,
                        height: $m(stage).height - 20,
                    };
                }
                return {
                    width: obj.setWidth,
                    height: obj.setHeight,
                };
            } else {
                if (obj.width > $m(stage).width || obj.height > $m(stage).height) {
                    return {
                        width: $m(stage).width - 20,
                        height: $m(stage).height - 20,
                    };
                }
                return {
                    width: obj.width,
                    height: obj.height,
                };
            }
        },

        addImg: function (imgObj) {
            var varImg = new Image();
            varImg.src = imgObj.src;
            varImg.onload = function () {
                var group = new Kinetic.Group({
                    x: 0,
                    y: 0,
                    z: parseInt(imgObj.z),
                    definedWidth: undefined != imgObj.width ? parseInt(imgObj.width) : undefined, //what the sql database defined what the width should be.
                    definedHeight: undefined != imgObj.height ? parseInt(imgObj.height) : undefined, //what the sql database defined what the height should be.
                    draggable: imgObj.draggable,
                    id: imgObj.id,
                    getWidth: function () {
                        return $m(group.children[0]).width;
                    },
                    getHeight: function () {
                        return $m(group.children[0]).height;
                    },
                });
                group.add(img(varImg).mkKinImg({
                    img: varImg,
                    id: imgObj.id,
                }));
                var size = img({
                    width: varImg.width,
                    height: varImg.height,
                    setWidth: undefined != imgObj.width ? parseInt(imgObj.width) : undefined,
                    setHeight: undefined != imgObj.height ? parseInt(imgObj.height) : undefined,
                }).sizeCheck();
                group.children[0].attrs.height = undefined != size.height ? size.height : group.children[0].attrs.height; //sets the height as defined in the sql database.
                group.children[0].attrs.width = undefined != size.width ? size.width : group.children[0].attrs.width; //sets the width as defined in the sql database.
                if (imgObj.anchors) {
                    $img(group).anchors.add(stage.children[imgObj.layer]);
                }
                if (undefined != imgObj.listeners) {
                    $.each(imgObj.listeners, function () {
                        this(group);
                    })
                }
                stage.children[parseInt(imgObj.layer)].add(group);
                group.setAbsolutePosition(imgObj.x, imgObj.y);
                stage.children[parseInt(imgObj.layer)].draw();
                $img(group).anchors.reset();
            }
        }
    }
}

/*
                                        MVPTEXT JS
    Prerequisites: kinetic.js, mvpCanvas.js
    Description: Will simplify all of the handling processes for a Kinetic Text Object.

    Created By:
    JESSE PARNELL

                            PROPERTY OF MULTI VISUAL PRODUCTS.
*/
var txtGroups = new Array();
function namespaceText() {
    return {
        addObj: function(obj) {
            if (obj.sqlUpdate) {
                //then set the sql update listener.
            }
            if (undefined != obj.custListeners) {
                //then set all of the custom listeners. (array of functions).
            }
        },

        mkKinTxt: function (txtObj, z, index) {
            var txt = new Kinetic.Text({
                id: parseInt(txtObj.id),
                x: txtObj.x,
                y: txtObj.y,
                z: z,
                text: txtObj.text,
                draggable: true,
                fontSize: txtObj.size,
                fontFamily: txtObj.font,
                name: 'text_' + index,
                fill: txtObj.color,
                setName: function (set) {
                    this.name = set;
                },
            });
            return txt;
        },

        addText: function (obj, layer, index) {
            var txt = {
                id: obj.getID(),
                text: obj.getText() == undefined ? 'Arial' : obj.getText(),
                font: obj.getFont() == undefined ? 'Arial' : obj.getFont(),
                size: obj.getSize() == undefined ? 12 : obj.getSize(),
                color: obj.getColor() == undefined ? 'black' : obj.getColor(),
                x: 0,
                y: 0,
            };
            var x = obj.getX() == undefined ? 0 : obj.getX();
            var y = obj.getY() == undefined ? 0 : obj.getY();
            var kinTxt = namespaceText().mkKinTxt(txt, obj.zIndex, index);
            namespaceText().addTextListeners(kinTxt);
            kinTxt.setAbsolutePosition(x, y);
            layer.add(kinTxt);
        },

        //adds listeners to text object.
        addTextListeners: function (txtObj) {
            txtObj.on('click', function () {
                slctdObj = this._id;
                console.log($m(this).z);
            });
            txtObj.on('dragstart', function () {
                slctdObj = this._id;
            });
        },
    };
}