function showdialog(hostname)
{
    $('#modal-title').empty();
    $('#modal-body').empty();
    $('#personality').empty();
    $('#features').empty();

    $('#modal-title').append(hostname);

    var hostinfo = null;
    $.ajaxSetup({async: false});
    $.get(AQUILON_URL + 'host/' + hostname + '.json', function (data)
    {
        hostinfo = $.parseJSON(data);
    }).fail(function ()
    {
        alert('Error retrieving data related to host: ' + hostname);
    });
    $.ajaxSetup({async: true});

    var personalities = null;
    $.ajaxSetup({async: false});
    $.get(AQUILON_URL + 'personality.json', function (data)
    {
        personalities = $.parseJSON(data);
    }).fail(function ()
    {
        alert('Error retrieving personality list');
    });
    $.ajaxSetup({async: true});

    var personalitylist = '';
    $.each(personalities, function (k, personality)
    {
        if (personality['Personality'] == hostinfo['Personality'])
        {
            personalitylist += '<option selected="selected">' + personality['Personality'] + '</option>';
        }
        else
        {
            personalitylist += '<option>' + personality['Personality'] + '</option>';
        }
    });
    $('#personality').append(personalitylist);
    $('.selectpicker').selectpicker('refresh');

    $("#personality").change(function ()
    {
        $('#features').empty();
        var p = $('#personality').find(":selected").text();
        $.each(personalities, function (k, personality)
        {
            if (personality['Personality'] == p)
            {
                var html = featurelist(personality);
                $('#features').append(html);
                $('[data-toggle="popover"]').popover({
                    trigger: 'hover',
                    container: 'body'
                });
                return false;
            }
        });
    });

    var html = featurelist(hostinfo);
    $('#features').append(html);

    $('[data-toggle="popover"]').popover({
        trigger: 'hover',
        container: 'body'
    });

    $('#managedialog').modal('show');
}

function featurelist(host)
{
    var html = '';

    html += '<ul class="list-group">\n';
    if (host['Features'] != undefined)
    {
        $.each(host['Features'], function (k, feature)
        {
            html += '<li class="list-group-item">';
            html += feature['HostFeature'];
            html += '<button style="float:right" type="button" class="btn btn-xs btn-info circle-icon-sm" data-toggle="popover" data-placement="right" data-container="body" data-content="Feature description">\n';
            html += '<span class="glyphicon glyphicon-info-sign"></span>\n';
            html += '</button>\n';
            html += '</li>\n';
        });
    }
    else
    {
        html += '<li class="list-group-item">There are no features associated with this personality</li>\n';
    }

    html += '</ul>\n';

    return html;
}
