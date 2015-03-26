$(document).ready(function ()
{
    createmyhoststable();
    createallhoststable();
    $('#myhosts').tablesorter({sortList: [[0, 0]]});
    $('#hostlist').tablesorter({sortList: [[0, 0]]});
    $('.selectpicker').selectpicker();
});

function getuserid()
{
    return "someusername"
}

function createmyhoststable()
{
    var hosts = "";

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
        var html = '';
        var domain = host["Domain"] != undefined ? host["Domain"] : '-';
        var user = host["UserPrincipal"] != undefined ? host["UserPrincipal"].substring(0, host["UserPrincipal"].indexOf('@')) : '-';
        if (user == getuserid())
        {
            html += '<tr>';
            html += '<td>' + host["FQDN"] + '</td>';
            html += '<td>' + host["Personality"] + '</td>';
            html += '<td>' + domain + '</td>';
            html += '<td style="text-align:center">';
            html += '<button class="btn btn-xs btn-warning" onclick="showdialog(\'' + host["FQDN"] + '\')">';
            html += '<span class="glyphicon glyphicon-pencil"></span> Edit';
            html += '</button>';
            html += '</td>';
            html += '<td style="text-align:center">';
            html += '<button class="btn btn-xs btn-default" onclick="alert(\'Unmanaging host ...\')">';
            html += '<span class="glyphicon glyphicon-share-alt"></span> Unmanage';
            html += '</button>';
            html += '</td>';
            html += '</tr>';
            $('#myhosts tbody').append(html);
        }
    });
}

function createallhoststable()
{
    var hosts = "";

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
        var html = '';
        var domain = host["Domain"] != undefined ? host["Domain"] : '-';
        var user = host["UserPrincipal"] != undefined ? host["UserPrincipal"].substring(0, host["UserPrincipal"].indexOf('@')) : '-';
        html += '<tr>';
        html += '<td>' + host["FQDN"] + '</td>';
        html += '<td>' + host["Personality"] + '</td>';
        html += '<td>' + domain + '</td>';
        html += '<td>' + user + '</td>';
        html += '<td style="text-align:center">';
        html += '<button class="btn btn-xs btn-default" onclick="alert(\'Managing host ...\')">';
        html += '<span class="glyphicon glyphicon-share-alt"> Manage';
        html += '</td>';
        html += '</tr>';
        $('#hostlist tbody').append(html);
    });
}