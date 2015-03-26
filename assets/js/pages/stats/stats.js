/**
 * On load
 */
$(document).ready(function ()
{
    createPlots();
    $('#svnlist').tablesorter({sortList: [[0, 0]]});
    $('.selectpicker').selectpicker();
});

/**
 * Create all plots
 */
function createPlots()
{
    var plots = {
        'bootcfg': 'Boot configuration',
        'os': 'OS version',
        'kernel': 'Kernel version'
    };

    var query = Object.keys(plots).join('/');

    $.get(AII_URL + '/cgi-bin/dashboard-aii.cgi',
        {
            'action': 'getStats',
            'stats': query
        },
        function (data)
        {
            $.each(plots, function (k, v)
            {
                createPlot(k, v, data[k]);
            });
        }).fail(function ()
        {
            alert('Error retrieving stats');
        });
}

/**
 * Create a plot for a field
 * @param name field code
 * @param title Name to display
 * @param data statistics data
 */
function createPlot(name, title, data)
{
    // Transform object to array
    var array = $.map(data, function (value, index)
    {
        return value != null ? value : 'N/A';
    });

    // Count values
    var info = [];
    $.each(array, function (k, v)
    {
        info[v] = info[v] == null ? 1 : info[v] + 1;
    });

    // Create array for plot
    var final = [];
    $(Object.keys(info)).each(function (k, v)
    {
        final.push([v, info[v]]);
    });

    var html = '<div class="col-md-6">' +
        '<div id="graph_' + name + '" style="height:400px"></div>' +
        '</div>';

    $('#stats').append(html);

    // Plot creation
    $.jqplot(
        "graph_" + name,
        [final],
        {
            title: {
                text: title,
                fontSize: "19.2px",
                textAlign: "center"
            },
            textColor: "#ff0000",
            grid: {
                shadow: false,
                borderWidth: 0,
                background: '#F4F4F4'
            },
            seriesDefaults: {
                animate: true,
                renderer: $.jqplot.PieRenderer,
                shadow: false,
                rendererOptions: {
                    showDataLabels: true,
                    sliceMargin: 3,
                    padding: 25,
                    dataLabels: "value",
                    dataLabelThreshold: 0,
                    dataLabelPositionFactor: 0.5,
                    dataLabelNudge: 0,
                    dataLabelCenterOn: true
                }
            },
            legend: {
                show: true,
                placement: 'inside',
                rendererOptions: {},
                location: "s",
                showlabels: true,
                rowSpacing: '0.5em'
            }
        }
    );
}

