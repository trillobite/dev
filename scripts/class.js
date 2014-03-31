/*

                                    ~MVP TOOL KIT~
    DESCRIPTION: A code library to easily manage an HTML5 Canvas using JQuery.
                 Most specifically, it is best used to manage the DOM for HTML 5 
                 web applications, with the backend being .NET & SQL.

    AUTHOR: Jesse Parnell

                            *PROPERTY OF MULTI VISUAL PRODUCTS*
*/

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
        typ: mvpCanvas().getType(obj0),
        width: mvpCanvas().objGetWidth(obj0),
        height: mvpCanvas().objGetHeight(obj0),
        set: {
            background: function(tmpStage, callback) { mvpCanvas().bkgrndSet(tmpStage, obj0, callback); },
        },
        x: mvpCanvas().objGetX(obj0),
        y: mvpCanvas().objGetY(obj0),
        z: mvpCanvas().objGetZ(obj0),
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
            var undef;
            if (undef != tmpObj) {
                try {
                    width = tmpObj.getWidth() !== undef ? tmpObj.getWidth() : 0;
                    width = width === 0 || width === undef ? tmpObj.width : width;
                    width = width === 0 || width === undef ? tmpObj.attrs.width : width;
                    width = width === 0 || width === undef ? tmpObj.attrs.getWidth() : width;
                    width = width === 0 || width === undef ? tmpObj.clientWidth : width;
                } catch (w) {
                    try {
                        width = tmpObj.width != undef ? tmpObj.width : 0;
                        width = width === 0 || width === undef ? tmpObj.attrs.width : width;
                        width = width === 0 || width === undef ? tmpObj.attrs.getWidth() : width;
                        width = width === 0 || width === undef ? tmpObj.clientWidth : width;
                    } catch (x) {
                        try {
                            width = tmpObj.attrs.width !== undef ? tmpObj.attrs.width : 0;
                            width = width === 0 || width === undef ? tmpObj.attrs.getWidth() : width;
                            width = width === 0 || width === undef ? tmpObj.clientWidth : width;
                        } catch (y) {
                            try {
                                width = tmpObj.attrs.getWidth() !== undef ? tmpObj.attrs.getWidth() : 0;
                                width = width === 0 || width === undef ? tmpObj.clientWidth : width;
                            } catch (z) {
                                try {
                                    width = tmpObj.clientWidth !== undef ? tmpObj.clientWidth : 0;
                                } catch (a) {
                                    if (width === 0) {
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
            var undef;
            if (undef != tmpObj) {
                try {
                    height = tmpObj.getHeight() !== undef ? tmpObj.getHeight() : 0;
                    height = height === 0 || height === undef ? tmpObj.height : height;
                    height = height === 0 || height === undef ? tmpObj.attrs.height : height;
                    height = height === 0 || height === undef ? tmpObj.attrs.getHeight() : height;
                    height = height === 0 || height === undef ? tmpObj.clientHeight : height;
                } catch (w) {
                    try {
                        height = tmpObj.height != undef ? tmpObj.height : 0;
                        height = height === 0 || height === undef ? tmpObj.attrs.height : height;
                        height = height === 0 || height === undef ? tmpObj.attrs.getHeight() : height;
                        height = height === 0 || height === undef ? tmpObj.clientHeight : height;
                    } catch (x) {
                        try {
                            height = tmpObj.attrs.height !== undef ? tmpObj.attrs.height : 0;
                            height = height === 0 || height === undef ? tmpObj.attrs.getHeight() : height;
                            height = height === 0 || height === undef ? tmpObj.clientHeight : height;
                        } catch (y) {
                            try {
                                height = tmpObj.attrs.getHeight() !== undef ? tmpObj.attrs.getHeight() : 0;
                                height = height === 0 || height === undef ? tmpObj.clientHeight : height;
                            } catch (z) {
                                try { 
                                    height = tmpObj.clientHeight !== undef ? tmpObj.clientHeight : 0;
                                } catch (e) {
                                    if (height === 0) {
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
            var undef;
            var xPos = 0;
            if (undef != tmpObj) {
                try {
                    xPos = tmpObj.getX() != undef ? tmpObj.getX() : 0;
                    xPos = xPos === 0 || xPos === undef ? tmpObj.x : xPos;
                    xPos = xPos === 0 || xPos === undef ? tmpObj.attrs.getX() : xPos;
                    xPos = xPos === 0 || xPos === undef ? tmpObj.attrs.x : xPos;
                } catch (w) {
                    try {
                        xPos = tmpObj.x != undef ? tmpObj.x : 0;
                        xPos = xPos === 0 || xPos === undef ? tmpObj.attrs.getX() : xPos;
                        xPos = xPos === 0 || xPos === undef ? tmpObj.attrs.x : xPos;
                    } catch (x) {
                        try {
                            xPos = tmpObj.attrs.getX() !== undef ? tmpObj.attrs.getX() : 0;
                            xPos = xPos === 0 || xPos === undef ? tmpObj.attrs.x : xPos;
                        } catch (y) {
                            try {
                                xPos = tmpObj.attrs.x !== undef ? tmpObj.attrs.x : 0;
                            } catch (z) {
                                if (xPos === 0) {
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
            var undef;
            var yPos = 0;
            if (undef !== tmpObj) {
                try {
                    yPos = tmpObj.getY() !== undef ? tmpObj.getY() : 0;
                    yPos = yPos === 0 || yPos === undef ? tmpObj.y : yPos;
                    yPos = yPos === 0 || yPos === undef ? tmpObj.attrs.getY() : yPos;
                    yPos = yPos === 0 || yPos === undef ? tmpObj.attrs.y : yPos;
                } catch (w) {
                    try {
                        yPos = tmpObj.y != undef ? tmpObj.y : 0;
                        yPos = yPos === 0 || yPos === undef ? tmpObj.attrs.getY() : yPos;

                        yPos = yPos === 0 || yPos === undef ? tmpObj.attrs.y : yPos;
                    } catch (x) {
                        try {
                            yPos = tmpObj.attrs.getY() !== undef ? tmpObj.attrs.getY() : 0;
                            yPos = yPos === 0 || yPos === undef ? tmpObj.attrs.y : yPos;
                        } catch (y) {
                            try {
                                yPos = tmpObj.attrs.y !== undef ? tmpObj.attrs.y : 0;
                            } catch (z) {
                                if (yPos === 0) {
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
            var undef;
            var z;
            if (undef != tmpObj) {
                try {
                    z = undef !== tmpObj.z ? tmpObj.z : undef;
                    z = undef === z && undef !== tmpObj.attrs.z ? tmpObj.attrs.z : z;
                    z = z === undef && tmpObj.children[0].attrs.z != undef ? tmpObj.children[0].attrs.z : z;
                } catch (e) {
                    try {
                        z = undef !== tmpObj.attrs.z ? tmpObj.attrs.z : z;
                        z = undef === z && undef !== tmpObj.children[0].attrs.z ? tmpObj.children[0].attrs.z : z;
                    } catch (a) {
                        try {
                            z = undef !== tmpObj.children[0].attrs.z ? tmpObj.children[0].attrs.z : z;
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
            var undef;
            var strReturn = undef;
            if (undef !== objVar) {
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
            var undef;
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
            var undef;
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
                if (undefined !== callback) {
                    if (undefined === rtrnVal || rtrnVal === "") {
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
            var undef;
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
            var undef;
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
            var undef;
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
            var undef;
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