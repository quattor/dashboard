var commandlist = {};

$(document).ready(function ()
{
    createcommandlist();
    createlegend();
    createaz();
});

/*
 * Generate a list of commands grouped together by common prefixes.
 */
function createcommandlist()
{
    var xmlobj = xml.getInstance().getXML();

    $(xmlobj).find('command').each(function ()
    {
        var name = $(this).attr('name');
        if (name == "*")
        {
            return true;
        }
        addtocommandlist(name);
    });

    commandlist = orderobject(commandlist);
}

/*
 * Add a new command to the list. If the beginning of the command matches
 * an entry in the prefix list, set object key as the suffix and store the full 
 * command and related prefix 
 * eg. ..., {'feature' : {'add' : 'add_feature', 'del' : 'del_feature'}}, ...
 */
function addtocommandlist(command)
{
    var prefixmatch = false;
    $.each(prefixlist, function (index, prefix)
    {
        if (command.indexOf(index) === 0)
        {
            var main = command.replace(index + "_", "");
            if (commandlist[main] == undefined)
            {
                commandlist[main] = {};
            }
            commandlist[main][index] = command;
            prefixmatch = true;
        }
    });

    // no prefix match, add whole command
    if (prefixmatch == false)
    {
        commandlist[command] = {};
    }
}

/*
 * Alphabetically order the keys in an object.
 */
function orderobject(obj)
{
    var orderedlist = {};
    var keys = Object.keys(obj);
    keys.sort();
    for (var i = 0; i < keys.length; i++)
    {
        var command = keys[i];
        orderedlist[command] = obj[command];
    }
    return orderedlist;
}

/*
 * Generate a legend for the command a-z using the prefix list.
 */
function createlegend()
{
    var html = "";
    $.each(prefixlist, function (prefix, options)
    {
        html += '<button class="btn btn-xs ' + options[1] + '">';
        html += '<span class="glyphicon ' + options[0] + '"></span>';
        html += '</button>\n';
        html += ' = ' + prefix + '&nbsp;&nbsp;&nbsp;&nbsp;'; // TODO: put spacing in css
    });
    $("#legend").append(html);
}

/*
 * Create the command a-z list as a 2xN grid.
 */
function createaz()
{
    var col_count = 0;
    var currentletter = "";
    var html = "";

    $.each(commandlist, function (index, value)
    {
        if (currentletter != index.substring(0, 1))
        {
            currentletter = index.substring(0, 1);
            if (col_count == 2)
            {
                html += '</div>\n';
                html += '</div>\n';
                col_count = 0;
            }
            if (col_count == 1)
            {
                html += '</div>\n';
                html += '<div class="col-md-6">\n';
                html += '<h2>' + currentletter + '</h2>\n';
                col_count = 2;
            }
            if (col_count == 0)
            {
                html += '<div class="row">\n';
                html += '<div class="col-md-6">\n';
                html += '<h2>' + currentletter + '</h2>\n';
                col_count = 1;
            }
        }

        html += '<span class="commandlabel">' + index + '</span>\n';

        // either create a button or put a placeholder in
        $.each(prefixlist, function (prefix, options)
        {
            if (value[prefix] != undefined || (prefix == "run" && Object.keys(value).length == 0))
            {
                var command = (prefix == "run" ? index : value[prefix]);
                html += '<button class="btn btn-xs ' + options[1] + '" onclick="showdialog(\'' + command + '\')">\n';
                html += '<span class="glyphicon ' + options[0] + '"></span>\n';
                html += '</button>\n';
            }
            else
            {
                html += '<button class="btn btn-xs ' + options[1] + '" disabled="disabled">\n';
                html += '<span class="glyphicon ' + options[0] + '" style="visibility:hidden"></span>\n';
                html += '</button>\n';
            }
        });

        html += '<br />\n';
    });
    html += '</div></div>\n';
    $("#azlist").append(html);
}
