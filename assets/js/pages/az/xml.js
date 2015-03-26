/*
 *
 */
var xml = (function ()
{
    var instance;

    function init()
    {
        var xmlobj = null;

        // Get the input.xml document
        $.ajaxSetup({async: false});
        $.get(COMMAND_URL, function (data)
        {
            xmlobj = data;
        }).fail(function ()
        {
            alert("Error retrieving input.xml from : " + URL);
        });
        $.ajaxSetup({async: true});

        return {
            // pubic methods
            getXML: function ()
            {
                return xmlobj;
            },
            getCommand: function (command)
            {
                return $(xmlobj).find('command[name=' + command + ']')[0];
            },
            getDescription: function (command)
            {
                var node = $(xmlobj).find('command[name=' + command + ']');
                var description = node.contents().eq(0).text();
                description.replace(/\n\n/g, "<br /><br />");
                return description;
            },
            // need to return list
            getTransports: function (command)
            {
                var node = $(xmlobj).find('command[name=' + command + ']');
                return $(node[0]).find('transport');
            }
        };
    }
    return {
        getInstance: function ()
        {
            if (!instance)
            {
                instance = init();
            }
            return instance;
        }
    };
})();
