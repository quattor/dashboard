Quattor Dashboard
=================

The Quattor Dashboard provides a web based interface to Quattor.
Information are gathered by scripts located on the AII server and a SVN client host :

* AII server
    - Must have access to JSON profiles and the `aii-shellfe` command
* SVN client
    - Must be able to call `svn log --xml $repo`

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
    - `yum install httpd mod_wsgi mod_proxy git python-cherrypy python-jinja2`
    - `git clone https://github.com/samary/dashboard.git`
    - Copy the vhost-dashboard.conf to your Apache config directory (eg. /etc/http/conf.d/) and replace the following:
      * AQ_URL - URL of your Aquilon server (including port)
      * AII_URL - URL of your AII server
      * SVN_URL - URL of your SVN server
      * DASHBOARD_DIR - The absolute path of this directory
      * MY_HOST - The hostname of the webserver
    - If you want to hide aquilon related menu : Edit assets/js/pages/config.js and set AQ_URL to ''.

* On the AII server
    - `yum install perl-Config-Simple`
    - `cd /var/www/cgi-bin && wget https://raw.githubusercontent.com/IIHE/dashboard/master/cgi-bin/dashboard-aii.cgi`
    - Be sure your dashboard webserver can reach this page via HTTP GET requests

* On the SVN client
    - `cd /var/www/cgi-bin && wget https://raw.githubusercontent.com/IIHE/dashboard/master/cgi-bin/dashboard-svn.cgi`
    - Edit dashboard-svn.cgi and set the SVN repository URL
    - Check if the webservice (eg: apache) can run the `/usr/bin/svn` command via sudo (/etc/sudoers)
    - Be sure your dashboard webserver can reach this page via HTTP GET requests

2- Restart Apache. Done.

Licence & Credit
================
Project forked and extended from Aquilon Console : https://github.com/amazerfrazer/aquilonconsole
