$(document).ready(function ()
{
    createtable();
    $('#personalities').tablesorter({sortList: [[0, 0]]});
    $('.selectpicker').selectpicker();
});

function createtable()
{
    var personalities = "";

    $.ajaxSetup({async: false});
    $.get(AQUILON_URL + 'personality.json', function (data)
    {
        personalities = $.parseJSON(data);
    }).fail(function ()
    {
        alert('Error retrieving personality list');
    });
    $.ajaxSetup({async: true});

    $.each(personalities, function (k, personality)
    {
        var html = '';
        var numfeatures = personality["Features"] != undefined ? personality["Features"].length : 0;
        var numhosts = geteffectedhosts(personality["Personality"]);
        html += '<tr>';
        html += '<td>' + personality["Personality"] + '</td>';
        html += '<td style="text-align:center">' + numfeatures + '</td>';
        html += '<td style="text-align:center">' + numhosts.length + '</td>';
        html += '<td style="text-align:center">';
        html += '<button class="btn btn-xs btn-warning" onclick="showdialog(\'' + personality["Personality"] + '\')">';
        html += '<span class="glyphicon glyphicon-pencil"></span> Edit';
        html += '</button>';
        html += '</td>';
        html += '</tr>';
        $('#personalities tbody').append(html);
    });
}

function geteffectedhosts(personalityname)
{
    var hosts = null;
    var effectedhosts = [];

    $.ajaxSetup({async: false});
    $.get(AQUILON_URL + 'host.json', function (data)
    {
        hosts = $.parseJSON(data);
    }).fail(function ()
    {
        alert('Error retrieving host list');
    });
    $.ajaxSetup({async: true});

    $.each(hosts, function (k, host)
    {
        if (host["Personality"] == personalityname)
        {
            effectedhosts.push(host);
        }
    });

    return effectedhosts;
}
