#!/usr/bin/perl -T
# ${license-info}
# ${developer-info
# ${author-info}
# ${build-info}

use strict;
use warnings;

use lib '/usr/lib/perl';
use CAF::Process;
use CGI;

my $repository = "file:///var/www/svn/scdb";

my $query = new CGI;

my $limit = $query->param('limit') ? $query->param('limit') : 10;

if ($limit =~ m/^(\d+|all)$/) {
    $limit = $1;
    $ENV{PATH}="/bin:/usr/bin:/sbin:/usr/bin:/usr/sbin";

    my @command = qw(/usr/bin/sudo /usr/bin/svn log --xml);
    push(@command, '-l', $limit, '-r', 'HEAD:1') if ($limit ne 'all');
    push(@command, $repository);

    my $p = new CAF::Process(\@command);
    my $output = $p->output();

    if($? eq 0) {
        print "Content-type: text/xml\n\n$output";
    }
    else {
        print "Content-type: text/plain\n\nError while retrieving SVN Logs : $?!";
    }

} else {
    print "Content-type: text/plain\n\nInvalid limit: $limit!";
}
