#!/usr/bin/perl -T
# ${license-info}
# ${developer-info
# ${author-info}
# ${build-info}

use CGI;

my $repo = "file:///var/www/svn/scdb";

my $q = new CGI;

my $limit = $q->param('limit') ? $q->param('limit') : '10';

$limit =~ /(\d+|all)/;
$limit = $1;

$ENV{PATH}="/bin:/usr/bin:/sbin:/usr/bin:/usr/sbin";

my $output;

if($limit eq 'all') {
  $output = `/usr/bin/sudo /usr/bin/svn log --xml $repo`;
}
else {
  $output = `/usr/bin/sudo /usr/bin/svn log --xml -l $limit -r HEAD:1 $repo`;
}


print "Content-type: text/xml\n\n$output";
