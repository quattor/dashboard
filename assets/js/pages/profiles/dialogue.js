/**
 * Show the profile content in a dialog
 * @param hostname host to show
 */
function showdialog(hostname)
{
    $('#modal-title').html(hostname);
    $('#modal-body').empty();

    $.get(AII_URL + '/cgi-bin/dashboard-aii.cgi',
        {
            'action': 'getProfile',
            'hostname': hostname
        },
        function (data)
        {
            var hardware = recurse(data['hardware']);
            $('#hardware').append(hardware);

            var software = recurse(data['software']);
            $('#software').append(software);

            var system = recurse(data['system']);
            $('#system').append(system);

            CollapsibleLists.apply();

            $('#managedialog').modal('show');
        }).
        fail(function ()
        {
            alert('Unable to retrieve the profile of : ' + hostname);
        });

}

/**
 * Create a nested menu from a json object
 * @param data Onject to parse
 * @returns {string} nested menu (HTML)
 */
function recurse(data)
{
    var htmlRetStr = "<ul class='recurseObj' >";
    for (var key in data)
    {
        if (typeof(data[key]) == 'object' && data[key] != null)
        {
            htmlRetStr += "<li class='keyObj'><strong>" + key + "</strong><ul class='recurseSubObj' >";
            htmlRetStr += recurse(data[key]);
            htmlRetStr += '</ul  ></li   >';
        }
        else
        {
            htmlRetStr += ("<li class='keyStr' ><strong>" + key + ' = </strong>&quot;' + data[key] + '&quot;</li  >' );
        }
    }
    htmlRetStr += '</ul >';
    return ( htmlRetStr );
}
