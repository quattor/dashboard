/**
 * On load
 */
$(document).ready(function ()
{
    createallhoststable();
});

/**
 * Create the hosts table
 */
function createallhoststable()
{
    var aii_actions = ['boot', 'install', 'reinstall', 'configure'];
    /**
     * Icon mapping
     * @type {{install: string, boot: string, reinstall: string, configure: string}}
     */
    var icon = {
        'install': 'glyphicon-save',
        'boot': 'glyphicon-hdd',
        'reinstall': 'glyphicon-refresh',
        'configure': 'glyphicon-cog'
    };

    /**
     * Icon color mapping
     * @type {{install: string, boot: string, reinstall: string, configure: string}}
     */
    var color = {
        'install': 'btn-success',
        'boot': 'btn-info',
        'reinstall': 'btn-warning',
        'configure': 'btn-unbind'
    };

    // Query Hosts information
    $.get(AII_URL + '/cgi-bin/dashboard-aii.cgi',
        {
            'action': 'getHosts'
        },
        function (data)
        {
            $(data['hosts']).each(function (k, host)
            {
                var hostname = host['hostname'];
                var disabled = '';

                if (host['bootcfg'] == 'localboot.cfg') disabled = 'boot';
                else if (host['bootcfg'] != '') disabled = 'install';

                var aii_actions_html = '';

                $.each(aii_actions, function (k, action)
                {
                    disabled = action == disabled ? 'disabled' : '';

                    aii_actions_html += '<button title="' + action + '" class="btn btn-xs ' + color[action] + '" onclick="configure(\'' + action + '\',\'' + hostname + '\')" ' + disabled + '>' +
                    '<span class="glyphicon ' + icon[action] + '" />' +
                    '</button>&nbsp;';
                });

                var bootcfg = host['bootcfg'] != '' ? host['bootcfg'] : 'NOT CONFIGURED';

                var row = '<tr id="' + hostname + '">' +
                    '<td>' + hostname + '</td>' +
                    '<td>' + host['dotaddr'] + ' (' + host['hexaddr'] + ')' + '</td>' +
                    '<td>' + bootcfg + '</td>' +
                    '<td>' + aii_actions_html + '</td>' +
                    '<td style="text-align:center">' +
                    '<button class="btn btn-xs btn-primary" onclick="showdialog(\'' + hostname + '\')" >' +
                    '<span class="glyphicon glyphicon-share-alt" /> Profile' +
                    '</td>' +
                    '</tr>';

                $('#hostlist').find('tbody').append(row);
            });
            $('#hostlist').dataTable({
                "iDisplayLength": 25,
                "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                "aoColumnDefs": [{
                    'bSortable': false,
                    'aTargets': [3, 4]
                }]
            });

        }).fail(function ()
        {
            alert('Error retrieving hosts informations');
        });

}

/**
 * Send GET request to run aii-shellfe commands
 * @param option Option to run (boot, install, configure, reinstall)
 * @param hostname Hostname to configure
 */
function configure(option, hostname)
{
    if (confirm('Do you want to "' + option + '" "' + hostname + '" ?'))
        $.get(AII_URL + '/cgi-bin/dashboard-aii.cgi',
            {
                'action': 'configure',
                'hostname': hostname,
                'option': option
            },
            function (data)
            {
                alert(data);
                location.reload();
            }).fail(function ()
            {
                alert('Error executing the command : ' + option + ' => ' + hostname);
            });
}
