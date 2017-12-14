function showdialog(personalityname)
{
    $('#modal-title').empty();
    $('#modal-body').empty();
    $('#personality').empty();
    $('#features').empty();
    $('#effectedhosts').empty();

    $('#modal-title').append(personalityname);

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

    var personality = '';
    $.each(personalities, function (k, p)
    {
        if (p['Personality'] == personalityname)
        {
            personality = p;
        }
    });

    var html = '';
    html += '<ul class="list-group"><li class="list-group-item">';
    html += personalityname;
    html += '</li></ul>\n';
    $('#personality').append(html);

    var html = featurelist(personality);
    $('#features').append(html);

    var html = effectedhosts(personalityname);
    $('#effectedhosts').append(html);

    $('[data-toggle="popover"]').popover({
        trigger: 'hover',
        container: 'body'
    });

    $('#personalitydialog').modal('show');
}

function featurelist(personality)
{
    var html = '';

    html += '<ul class="list-group">\n';
    if (personality['Features'] != undefined)
    {
        $.each(personality['Features'], function (k, feature)
        {
            html += '<li class="list-group-item">';
            html += feature['HostFeature'];
            html += '<button style="float:right;width:75px" type="button" class="btn btn-xs btn-unbind">\n';
            html += '<span class="glyphicon glyphicon-export"></span> Unbind\n';
            html += '</button>\n';
            html += '</li>\n';
        });
    }
    else
    {
        html += '<li class="list-group-item">There are no features associated with this personality</li>\n';
    }

    html += '<li class="list-group-item" style="border-right:0;border-left:0;border-bottom:0">&nbsp;';
    html += '<button style="float:right;width:75px" type="button" class="btn btn-xs btn-bind">\n';
    html += '<span class="glyphicon glyphicon-import"></span> Bind\n';
    html += '</button>\n';
    html += '</li>\n';

    html += '</ul>\n';

    return html;
}

function effectedhosts(personalityname)
{
    var html = '';
    var hosts = null;
    var hostcount = 0;

    $.ajaxSetup({async: false});
    $.get(AQUILON_URL + 'host.json', function (data)
    {
        hosts = $.parseJSON(data);
    }).fail(function ()
    {
        alert('Error retrieving host list');
    });
    $.ajaxSetup({async: true});

    html += '<h4>Effected Hosts</h4> The following hosts will be effected by your changes: <br /><br />';
    html += '<ul class="list-group">\n';
    $.each(hosts, function (k, host)
    {
        if (host["Personality"] == personalityname)
        {
            html += '<li class="list-group-item">';
            html += host['FQDN'];
            html += '<button style="float:right" type="button" class="btn btn-xs btn-info circle-icon-sm" data-toggle="popover" data-placement="right" data-container="body" data-content="Host description">\n';
            html += '<span class="glyphicon glyphicon-info-sign"></span>\n';
            html += '</button>\n';
            html += '</li>\n';
            hostcount = hostcount + 1;
        }
    });
    html += '</ul>\n';

    if (hostcount == 0)
    {
        html = '<h4>Effected Hosts</h4> No hosts will be effected by you changes<br />';
    }

    return html;
}
