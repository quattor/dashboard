// location of the apache proxypass to the aquilon server
var AQUILON_URL = "";

// location of the apache proxypass to the AII server
var AII_URL = "/aii/";

// location of the apache proxypass to the SVN server
var SVN_URL = "/svn/";

// file containing all the avaliable aquilon commands
var COMMAND_URL = "/assets/xml/input.xml";

// used for generating the A-Z page by grouping commands by their prefix. If a
// match is not found, it will default to the entry at the end of the list
// ie. run
var prefixlist = {
    "add"    : ["glyphicon-plus", "btn-success"],
    "show"   : ["glyphicon-eye-open", "btn-info"],
    "update" : ["glyphicon-pencil", "btn-warning"],
    "del"    : ["glyphicon-remove", "btn-danger"],
    "bind"   : ["glyphicon-import", "btn-bind"],
    "unbind" : ["glyphicon-export", "btn-unbind"],
    "rebind" : ["glyphicon-repeat", "btn-rebind"],
    "search" : ["glyphicon-search", "btn-primary"],
    "run"    : ["glyphicon-share-alt", "btn-default"]
};
