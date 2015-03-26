var fields = {
    'serialnumber': 'Serial Number',
    'location': 'Location',
    'os': 'OS version',
    'kernel': 'Kernel version',
    'macaddress': 'Mac Addresses',
    'ipaddress': 'IP Addresses',
    'ram': 'RAM',
    'cpu': 'CPU'
};

var categories = {
    'hw': 'Hardware',
    'net': 'Network',
    'sw': 'Software'
};

var cat_field = {
    'hw': [{'serialnumber': true}, {'location': true}, {'ram': false}, {'cpu': false}],
    'net': [{'macaddress': true}, {'ipaddress': true}],
    'sw': [{'os': true}, {'kernel': false}]
};

/**
 * On load
 */
$(document).ready(function ()
{
    createOptions();
    createallhoststable();
});

function createOptions()
{
    var html = '';

    Object.keys(categories).forEach(function (cat)
    {
        html += '<div class="form-group"><fieldset><legend class="control-label">' + categories[cat] + '</legend>';
        cat_field[cat].forEach(function (field)
        {
            Object.keys(field).forEach(function (key)
            {
                var checked = field[key] == true ? 'checked' : '';
                html += '<label class="checkbox-inline"><input type="checkbox" ' + checked + ' value="' + key + '">' + fields[key] + '</label>';
            });
        });

        html += '</fieldset></div>';
    });

    html += '&nbsp;<button class="btn btn-success pull-right" onclick="$(\'#hostlist\').dataTable().fnDestroy(); createallhoststable()">Update</button>';
    $('#options').html(html).hide();

}

/**
 * Create the hosts table
 */
function createallhoststable()
{
    var query = [];

    $.each($("input:checked"), function (k, v)
    {
        query.push($(v).val());
    });

    $.get(AII_URL + '/cgi-bin/dashboard-aii.cgi',
        {
            'action': 'getOverview',
            'stats': query.sort().join('/')
        },
        function (data)
        {
            var l = $('#hostlist');
            l.find('tbody').empty();
            l.find('thead').html('<tr><th>Hostname</th></tr>');
            $.each(query, function (k, v)
            {
                l.find('thead').find('tr').append('<th>' + fields[v] + '</th>');
            });

            $.each(data, function (k, v)
            {
                createHost(k, v);
            });
            l.dataTable({
                'iDisplayLength': -1,
                'lengthMenu': [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]]
            });
        }).fail(function ()
        {
            alert('Error retrieving stats');
        });

}

function createHost(hostname, data)
{
    var row = '<tr id="' + hostname + '">' +
        '<td>' + hostname + '</td>';

    $.each(Object.keys(data).sort(), function (k, v)
    {
        row += '<td>' + convertToHTMLVisibleNewline(data[v]) + '</td>';
    });

    row += '</tr>';

    $('#hostlist').find('tbody').append(row);
}

/*
 *  Converts \n newline chars into <br> chars s.t. they are visible
 *  inside HTML
 */
function convertToHTMLVisibleNewline(value)
{
    return value != null && value != "" && typeof value == "string" ? value.replace(/\n/g, "<br/>") : value;
}
