/**
 * On load
 */
$(document).ready(function ()
{
    $('.selectpicker').selectpicker();
    loadLogs();
});

/**
 *
 */
function loadLogs()
{
    var limit = $('#limit').val();
    $('#svnlist').dataTable().fnDestroy();
    $('#svnlist').find('tbody').empty();

    $.get(SVN_URL + '/cgi-bin/dashboard-svn.cgi',
        {
            'limit': limit
        },
        function (data)
        {
            $(data).find('log').find('logentry').each(function ()
            {
                var d = new Date($(this).find('date').text());
                var date = d.toUTCString();
                var html = '<tr>' +
                    '<td>' + $(this).attr('revision') + '</td>' +
                    '<td>' + date + '</td>' +
                    '<td>' + $(this).find('msg').text() + '</td>' +
                    '</tr>';

                $('#svnlist').find('tbody').append(html);
            });
            $('#svnlist').dataTable({
                "iDisplayLength": -1,
                "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                "aaSorting": [[0, "desc"]],
                "bAutoWidth": false,
                "aoColumns": [
                    {"sWidth": "10%"},
                    {"sWidth": "20%"},
                    {"sWidth": "70%"}
                ]
            });

        }).fail(function ()
        {
            alert('Unable to retrieve svn logs');
        });
}
