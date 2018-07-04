/*
 * Open command dialog and auto generate form for the selected command.
 */
function showdialog(commandname)
{
    // clear any previous output
    $("#modal-icon").empty();
    $("#modal-title").empty();
    $("#modal-body").empty();
    $('#output-textarea').html('No output ... please submit the form first.');

    // determine which icon to use
    var icon = '';
    $.each(prefixlist, function (prefix, options)
    {
        if (commandname.indexOf(prefix) === 0 || prefix == 'run')
        {
            icon += '<button class="btn btn-xs ' + options[1] + '">\n';
            icon += '<span class="glyphicon ' + options[0] + '"></span>\n';
            icon += '</button>\n';
            $("#modal-icon").append(icon);
            return false;
        }
    });

    // add title and description
    var title = commandname.split('_').join(' ');
    var description = xml.getInstance().getDescription(commandname);
    $("#modal-title").append(title);
    $("#modal-body").append(description);
    $("#modal-body").append('<br /><br />');

    // generate form
    var commandnode = xml.getInstance().getCommand(commandname);
    var optgroups = $(commandnode).children('optgroup');
    $.each(optgroups, function (key, optgroup)
    {
        var html = parseoptgroup(optgroup, true);
        $("#modal-body").append(html);
    });

    // attach listeners
    fieldlisteners();
    submitlistener(commandname);
    //resizelistener();
    $('[data-toggle="popover"]').popover({
        trigger: 'hover',
        container: 'body'
    });

    // finally, show the dialog :)
    $('#tabs a[href="#modal-body"]').tab('show');
    $('#formdialog').modal('show');
}

/*
 * Loop over all optgroup nodes and create an input field or recurse due to
 * nested optgroup nodes.
 *
 * Only shows legend for top level optgroups, otherwise just displays <hr>.
 */
function parseoptgroup(optgroup, legend)
{
    var html = "";

    // check if any/all fields required
    var required = '';
    if ($(optgroup).attr('mandatory') == 'True')
    {
        if ($(optgroup).attr('fields') == 'all')
        {
            required = 'all';
        }
        else
        {
            required = 'any';
        }
    }

    if (legend)
    {
        html += '<fieldset>\n';
        html += '<legend>';
        html += $(optgroup).attr('name').split('_').join(' ');
        html += (required == 'any' ? '<span class="required" data-toggle="popover" data-placement="right" data-content="Please select one or more options below">*</span>' : '');
        html += '</legend>\n';
    }

    $.each($(optgroup).children(), function (key, node)
    {
        if ($(node).is('optgroup'))
        {
            html += !$(node).is(':first-child') ? '<hr />' : '';
            html += parseoptgroup(node, false);
            html += !$(node).is(':last-child') ? '<hr />' : '';
        }
        else if ($(node).is('option'))
        {
            html += parseoptions(node, required);
        }
    });

    if (legend)
    {
        html += '</fieldset>\n';
    }

    return html;
}

/*
 * Create an appropriate input field with notification icons for each option.
 */
function parseoptions(option, required)
{
    var html = "";
    var name = $(option).attr('name').split('_').join(' ');
    var description = $(option).contents().eq(0).text();

    // place asterisk next to field name if required
    var asterisk = '';
    if (required == "all")
    {
        asterisk = '<span class="required" data-toggle="popover" data-placement="right" data-content="This field is required">*</span>';
    }

    // add input field
    html += '<div class="form-group">\n';
    html += '<label for="' + name + '" class="col-sm-3 control-label">' + name + asterisk + '</label>\n';
    html += '<div class="col-sm-6">\n';
    html += createinput(option, required);
    html += '</div>\n';

    // add notification icons
    html += '<div class="col-sm-3">\n';
    html += createnotification(option);
    html += '</div>\n';
    html += '</div>\n';

    return html;
}

/*
 * Creates input fields depending on their type and attaches data attributes to
 * keep track of conflicts and validation.
 */
function createinput(option, required)
{
    var html = '';
    var inputtype = '';

    var name = $(option).attr('name');
    var type = $(option).attr('type');
    var conflicts = $(option).attr('conflicts');

    switch (type)
    {
        case 'string':
        case 'int':
        case 'ipv4':
        case 'mac':
        case 'list':
        case 'enum':
            inputtype = 'text';
            break;
        case 'flag':
        case 'boolean':
            inputtype = 'checkbox';
            break;
        default:
            console.log("Unknown option type: " + type);
            break;
    }

    html += '<input class="form-control" ';
    html += 'type="' + inputtype + '" ';
    html += 'id="' + name + '" ';
    html += 'name="' + name + '" ';
    html += 'data-conflicts="' + conflicts + '" ';
    html += 'data-type="' + type + '" ';
    html += (required == 'all' ? 'required="required"' : '');
    html += ' />\n';

    return html;
}

/*
 * Create 3 notification icons next to input field: info, error (validation) and
 * a warning if the field has been disabled due to conflict with another field.
 */
function createnotification(option)
{
    var html = '';
    var name = $(option).attr('name');
    var type = $(option).attr('type');
    var conflicts = $(option).attr('conflicts');

    var infotext = $(option).contents().eq(0).text();
    var warningtext = 'This field cannot be used in conjunction with the following inputs: '
        + (conflicts != undefined ? conflicts.split(' ').join(', ') : '');
    var errortext = '';

    switch (type)
    {
        case 'int':
            errortext = 'Input must be an integer';
            break;
        case 'ipv4':
            errortext = 'Input must be an IPv4 address eg. 127.0.0.1';
            break;
        case 'mac':
            errortext = 'Input must be a MAC address eg. 01:23:45:67:89:ab';
            break;
        case 'string':
        case 'list':
        case 'enum':
        case 'flag':
        case 'boolean':
            break;
        default:
            console.log("Unknown option type: " + type);
            break;
    }

    html += '<button type="button" id="' + name + 'info" class="btn btn-xs btn-info circle-icon" data-toggle="popover" data-placement="right" data-container="body" data-content="' + infotext + '">\n';
    html += '<span class="glyphicon glyphicon-info-sign"></span>\n';
    html += '</button>\n';

    html += '<button type="button" id="' + name + 'error" class="btn btn-xs btn-danger hide circle-icon" data-toggle="popover" data-placement="right" data-container="body" data-content="' + errortext + '">\n';
    html += '<span class="glyphicon glyphicon-remove-sign"></span>\n';
    html += '</button>\n';

    html += '<button type="button" id="' + name + 'warning" class="btn btn-xs btn-warning hide circle-icon" data-toggle="popover" data-placement="right" data-container="body" data-content="' + warningtext + '">\n';
    html += '<span class="glyphicon glyphicon-exclamation-sign"></span>\n';
    html += '</button>\n';

    return html;
}

/*
 * Attach listeners to all the form elements to check for conflicts, setting
 * notification icons and validation when their value changes.
 */
function fieldlisteners()
{
    $('#commandform input,checkbox').each(function ()
    {
        $(this).change(function ()
        {
            var input = $(this);

            // disable inputs that conflict with the last input modified
            if ((input.attr('type') == 'text' && input.val() != "") ||
                (input.attr('type') == 'checkbox' && input.is(':checked')))
            {
                var conflicts = input.data('conflicts').split(' ');
                $.each(conflicts, function (k, inputname)
                {
                    $('#' + inputname).attr('disabled', 'disabled');
                    $('#' + inputname + 'info').addClass('hide');
                    $('#' + inputname + 'warning').removeClass('hide');
                });
            }
            else
            {
                // to determine if we need to re-enable any of the input's
                // conflicting fields, we have to check that they are not in
                // conflict with any other fields
                var enable = true;
                var conflicts = input.data('conflicts').split(' ');
                $.each(conflicts, function (k, inputname)
                {
                    var conflicts2 = $('#' + inputname).data('conflicts').split(' ');
                    $.each(conflicts2, function (k, inputname2)
                    {
                        if (($('#' + inputname2).attr('type') == 'text' &&
                            $('#' + inputname2).val() != "") ||
                            ($('#' + inputname2).attr('type') == 'checkbox' &&
                            $('#' + inputname2).is(':checked')))
                        {
                            enable = false;
                        }
                    });

                    if (enable)
                    {
                        $('#' + inputname).removeAttr('disabled');
                        $('#' + inputname + 'info').removeClass('hide');
                        $('#' + inputname + 'warning').addClass('hide');
                    }
                });
            }
        });
    });
}

/*
 * Determine which URL and method to use and submit request to the
 * aquilon URL.
 */
function submitlistener(commandname)
{
    // store the commandname to the form to that it can be retrieved when
    // the submit handler called.
    $('#commandform').data('commandname', commandname);

    $('#commandform').submit(function (event)
    {
        var commandname = $('#commandform').data('commandname');
        var command = xml.getInstance().getCommand(commandname);
        var transport = determinetransport(command);
        var path = generatepath(transport);
        var method = $(transport).attr('method');

        $.ajax({
            type: method,
            url: AQUILON_URL + path,
            data: (method != 'get' ? $('#commandform').serialize() : null),
            success: function (response)
            {
                console.log(response);
                $('#tabs a[href="#modal-output"]').tab('show');
                $('#output-textarea').html(response);
            }
        });

        event.preventDefault();
    });
}

/*
 * Each command can have multiple transports (URL & method). So determine which
 * one to use by matching fields that have been submitted to the transport
 * triggers.
 */
function determinetransport(command)
{
    var matchingtransport = null;

    // first check all the transport nodes that have a trigger
    var triggers = $(command).find('transport[trigger]');
    $.each(triggers, function (k, transport)
    {
        var trigger = $(transport).attr('trigger');
        var input = $('#' + trigger);
        if ((input.attr('type') == 'text' && input.val() != "") ||
            (input.attr('type') == 'checkbox' && input.is(':checked')))
        {
            matchingtransport = transport;
            return false;
        }
    });

    // if there is no match with triggers, find transport with out one
    if (matchingtransport == null)
    {
        matchingtransport = $(command).find('transport:not([trigger])')[0];
    }

    return matchingtransport;
}

/*
 * Perform substitution on paths that require data from the form
 * eg. show_feature: /feature/%(type)s/%(feature)s replace type and feature.
 */
function generatepath(transport)
{
    var path = $(transport).attr('path');
    var urlparams = [];

    // find which form params need to be included in the URL
    var parammatch;
    var regexp = /%\(([a-z]+)\)s/g;
    while (parammatch = regexp.exec(path))
    {
        urlparams.push(parammatch[1]);
    }

    // put field values into the URL
    $.each(urlparams, function (k, param)
    {
        var regexp = new RegExp("%\\(" + param + "\\)s");
        if ($('#' + param).attr('type') == 'text')
        {
            // fields that may contain slashes eg. feature name, need to have
            // these encoded to %2F
            var encodedslashes = $('#' + param).val().replace('/', '%2F');
            path = path.replace(regexp, encodedslashes);
        }
        else if ($('#' + param).attr('type') == 'checkbox')
        {
            path = path.replace(regexp, $('#' + param).is(':checked'));
        }
    });

    return path;
}

/*
 *
 */
function resizelistener()
{

}

// attach event listener instead?
function resize()
{
    $(".modal-dialog").animate({
        width: "90%",
        height: 'auto',
        'min-height': '90%'
    }, 600, 'linear');
    $(".modal-content").animate({height: '100%'}, 600, 'linear');
    //var desired_height = $(window).height() * 0.9;
    //if ($(".modal-dialog").height() < desired_height) {
    //    $(".modal-dialog").animate({height:desired_height}, 600, 'linear');
    //$('#output-textarea').height()
    //}
}
