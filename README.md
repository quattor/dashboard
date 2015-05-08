Quattor Dashboard
=================

The Quattor Dashboard provides a web based interface to Quattor.
Information are gathered by scripts located on the AII server and a SVN client host :

* AII server
    - Must have access to JSON profiles and the `aii-shellfe` command
* SVN client
    - Must be able to call `svn log --xml $repository`

Software
========

* CherryPy 3.1.1 + Jinja2
* Apache 2.2.15 + mod_wsgi + mod_proxy
* Bootstrap 3.1.1
* jQuery 1.11.0 + DataTables 1.10.5 + jqPlots 1.0.8
* CollapsibleLists
* lessc 1.7.0 or greater (for css modifications)

Deployment
==========

1- Install required software & scripts

* On the web server
    - `yum install -y httpd mod_wsgi mod_proxy git python-cherrypy python-jinja2`
    - `git clone https://github.com/quattor/dashboard.git`
    - Copy the `vhost-dashboard.conf` to your Apache config directory (eg. `/etc/http/conf.d/`) and replace the following:
      * `AQ_URL` - URL of your Aquilon server (including port)
      * `AII_URL` - URL of your AII server
      * `SVN_URL` - URL of your SVN server
      * `DASHBOARD_DIR` - The absolute path of this directory
      * `MY_HOST` - The hostname of the webserver
    - If you want to hide aquilon related menu : Edit `assets/js/pages/config.js` and set `AQ_URL` to ''.

* On the AII server
    - `cd /var/www/cgi-bin && wget https://raw.githubusercontent.com/quattor/dashboard/master/cgi-bin/dashboard-aii.cgi`
    - Be sure your dashboard webserver can reach this page via HTTP GET requests

* On the SVN client
    - `yum install -y perl-CAF`
    - `cd /var/www/cgi-bin && wget https://raw.githubusercontent.com/quattor/dashboard/master/cgi-bin/dashboard-svn.cgi`
    - Edit `dashboard-svn.cgi` and set the SVN repository URL
    - Check if the webservice (eg: apache) can run the `/usr/bin/svn` command via sudo (`/etc/sudoers`)
    - Be sure your dashboard webserver can reach this page via HTTP GET requests

2- Restart Apache. Done.

License & Credit
================
Project forked and extended from Aquilon Console : https://github.com/amazerfrazer/aquilonconsole
Licensed under Apache2 license (https://github.com/quattor/dashboard/blob/master/LICENSE

* Third-party Licenses
    - Bootstrap : Licensed under MIT license (https://github.com/twbs/bootstrap/blob/master/LICENSE)
    - Bootstrap-select : Licensed under MIT license (https://github.com/silviomoreto/bootstrap-select/blob/master/LICENSE)
    - DataTables : Licensed under MIT license (http://datatables.net/license)
    - CollapsibleLists : Lincenced under the terms of the CC0 1.0 Universal legal code (http://creativecommons.org/publicdomain/zero/1.0/legalcode)
    - jqPlot : Dual licensed under the MIT and GPL version 2 licenses (http://www.jqplot.com/info.php)
    - jQuery : Licensed under MIT license (http://jquery.org/license)
    - jQuery TableSorter : Dual licensed under the MIT and GPL licenses (https://github.com/Mottie/tablesorter/blob/master/README.md)