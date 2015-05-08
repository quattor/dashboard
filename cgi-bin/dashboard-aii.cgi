#!/usr/bin/perl -T
# ${license-info}
# ${developer-info
# ${author-info}
# ${build-info}

use strict;
use warnings;

use Config::Tiny;
use JSON::XS;
use Switch;
use CGI;

# Configuration file to boot from HD. Following pxelinux convention
# it must be called default so if the <IpAddressInHex> link
# is missing the node will boot from the hard disk
my $boothd = "default";

# Quattor profiles
my $web_root = "/var/www/html";
my $profiles_path = "profiles";
my $profiles_dir = $web_root.'/'.$profiles_path;

# Read AII configuration
my $cfg = new Config::Tiny();
$cfg = $cfg->read('/etc/aii/aii-shellfe.conf');

# PXE Linux directory
my $pxelinux_dir = $cfg->{_}->{nbpdir};

# Profile prefix
my $profile_prefix = $cfg->{_}->{profile_prefix} eq 0 ? '' : $cfg->{_}->{profile_prefix};

# cdb url
my $cdb_url = $cfg->{_}->{cdb_url};

# Number of different boot types
my %boot_type;

# Array of available pxelinux configurations
my @cfg;

# Data collected from the form
my %nodes_cfg;

# Profiles .json available
my (@profiles);

=pod
=item GetHexAddr():void
Get the hostname or an IP address and return the IP address in
hex (as required by pxelinux)
=cut
sub GetHexAddr {

  # The 4th field is an array of the IP address of this node
  my @all_address;
  @all_address =(gethostbyname($_[0]))[4];
  if ($#all_address < 0) { # The array is empty
    return ;
  }
  # We unpack the IP address
  my @tmp_address = unpack('C4',$all_address[0]);
  my @result;
  $result[0]=sprintf ("%02X%02X%02X%02X",$tmp_address[0], $tmp_address[1],
                                         $tmp_address[2], $tmp_address[3]);
  $result[1]=sprintf ("%u.%u.%u.%u",$tmp_address[0], $tmp_address[1],
                                    $tmp_address[2], $tmp_address[3]);
  return @result;
}

=pod
=item Initialize():void
Find profiles and PXE Configuration
=cut
sub Initialize {

  @profiles=();

  opendir(DIR,$profiles_dir);

  # find all profiles in directory
  push @profiles,map { s/\.json$//; s/^$profile_prefix//; $_ .=''; } sort(grep(/\.json$/, readdir(DIR)));

  closedir(DIR);
  # Load the configurations list
  opendir(DIR, $pxelinux_dir);
  @cfg = sort(grep(/(\.cfg$)|(default)/, readdir(DIR)));
  closedir(DIR);
}

=pod
=item GetHosts():void
Print hosts list
=cut
sub GetHosts {

  my (@all, $k, $json);

  for $k (@profiles) {

    my $hostname = $k;

    my ($hexaddr,$dotaddr) = GetHexAddr($hostname);

    my $link = readlink("$pxelinux_dir/$hexaddr");
    my $existing_cfg = $link ? $link : "";

    push @all ,{'hostname' => $hostname, 'hexaddr' => $hexaddr, 'dotaddr' => $dotaddr, 'bootcfg' => $existing_cfg };

  }

  $json =  JSON::XS->new->pretty->encode({hosts => \@all, available_cfg => \@cfg});

  print "Content-type: application/json\n\n$json";

}

=pod
=item GetProfile():void
Print JSON profile of requested host
=cut
sub GetProfile {

  if ($_[0] =~ /^(.*)$/) {
    $_[0] = $1;
    my $hostname = $_[0];
    my $file = "$profiles_dir/$profile_prefix$hostname.json";

      my $json_text = do {
        open(my $json_fh, "<:encoding(UTF-8)", $file) or die("Can't open $file: $!\n");
        local $/;
        <$json_fh>
      };

      my $profile = JSON::XS->new->decode($json_text);
      
      #Remove sensitive sections
      $profile->{'software'} = ();

      my $json =  JSON::XS->new->pretty->allow_nonref->encode($profile);

      print "Content-type: application/json\n\n$json";
    }
}

=pod
=item Configure():void
Call aii-shellfe actions
=cut
sub Configure {

  $ENV{PATH}="/bin:/usr/bin:/sbin:/usr/bin:/usr/sbin";

  my $result = '';
  print "Content-type: text/plain\n\n";

  $_[0] =~ /^(configure|install|reinstall|boot)$/;
  $_[0] = $1;

  $_[1] =~ /^(.*)$/;
  $_[1] = $1;

  my $action = $_[0];
  my $hostname = $_[1];

  if ($action eq 'reinstall') {
    my $ok = system ("/usr/bin/sudo", "/usr/sbin/aii-shellfe", "--remove", $hostname);
    $ok = system ("/usr/bin/sudo", "/usr/sbin/aii-shellfe", "--configure", $hostname);
    $ok = system ("/usr/bin/sudo", "/usr/sbin/aii-shellfe", "--install", $hostname);
    print "Failed to reinstall $hostname using aii-shellfe<br>" if ($ok != 0);
  }
  else {
    if (system ("/usr/bin/sudo", "/usr/sbin/aii-shellfe", "--$action", $hostname) != 0) {
        print "Failed to $action $hostname using aii-shellfe<br>";
      }
  }

}

=pod
=item GetStats():void
Print hosts statistics.
=cut
sub GetStats {

  my (%all, %result, $k, $i, $json, $hostname, $value, @fields, $file, $hexaddr, $dotaddr);

  for $k (@profiles) {

    $hostname = $k;
    $hostname =~ /^(.*)$/;
    $hostname = $1;

    $file = "$profiles_dir/$profile_prefix$hostname.json";

    my $json_text = do {
      open(my $json_fh, "<",$file) or die("Can't open $file : $!\n");
      local $/;
      <$json_fh>
    };

    $_[0] =~ /^(.*)$/;
    $_[0] = $1;

    my $profile = JSON::XS->new->decode($json_text);

    @fields = split '/' , $_[0];

    for my $field(@fields)
    {
      $value = '';
      switch($field) {
        case 'kernel' {
          $value = $profile->{'system'}->{'kernel'}->{'version'};
        }
        case 'os' {
          $value = $profile->{'system'}->{'aii'}->{'nbp'}->{'pxelinux'}->{'label'};
        }
        case 'bootcfg' {
          ($hexaddr,$dotaddr) = GetHexAddr($hostname);
          my $link = readlink("$pxelinux_dir/$hexaddr");

          if ($link eq 'localboot.cfg') {
            $value = 'boot';
          }
          elsif (!$link or $link eq '') {
            $value = 'unconfigured';
          }
          else {
            $value = 'install';
          }
        }

      }

      $all{$field}{$hostname} = $value;
    }
  }

  $json = JSON::XS->new->pretty->encode(\%all);

  print "Content-type: application/json\n\n$json";

}

=pod
=item GetOverview():void
Return hosts overview.
=cut
sub GetOverview {

  my (%all, %result, $k, $i, $json, $hostname, $value, @fields, $file, $profile);

  for $k (@profiles) {

    $hostname = $k;
    $hostname =~ /^(.*)$/;
    $hostname = $1;

    $file = "$profiles_dir/$profile_prefix$hostname.json";

    my $json_text = do {
      open(my $json_fh, "<",$file) or die("Can't open $file : $!\n");
      local $/;
      <$json_fh>
    };

    $_[0] =~ /^(.*)$/;
    $_[0] = $1;

    $profile = JSON::XS->new->decode($json_text);

    @fields = split '/' , $_[0];

    for my $field(@fields)
    {
      $value = '';
      switch($field) {
        case 'kernel' {
          $value = $profile->{'system'}->{'kernel'}->{'version'}
        }
        case 'os' {
          $value = $profile->{'system'}->{'aii'}->{'nbp'}->{'pxelinux'}->{'label'}
        }
        case 'location' {
          $value = $profile->{'hardware'}->{'location'}
        }
        case 'serialnumber' {
          $value = $profile->{'hardware'}->{'serialnumber'}
        }
        case 'macaddress' {
            for my $key (sort keys %{$profile->{'hardware'}->{'cards'}->{'nic'}}) {
              $value .= "$key : $profile->{'hardware'}->{'cards'}->{'nic'}->{$key}->{'hwaddr'}\n";
            }
        }
        case 'ipaddress' {
          for my $key (sort keys %{$profile->{'system'}->{'network'}->{'interfaces'}}) {
            $value .= "$key : $profile->{'system'}->{'network'}->{'interfaces'}->{$key}->{'ip'}\n";
          }
        }
        case 'ram' {
          for $i ( 0 .. $#{ $profile->{'hardware'}->{'ram'} } ) {
            $value += $profile->{'hardware'}->{'ram'}[$i]->{'size'};
          }
          $value .= " Mb";
        }
        case 'cpu' {
          for $i ( 0 .. $#{ $profile->{'hardware'}->{'cpu'} } ) {
            $value += $profile->{'hardware'}->{'cpu'}[$i]->{'cores'};
          }
          $value .= " cores";
        }
      }
      $all{$hostname}{$field} = $value;
    }
  }

  $json = JSON::XS->new->pretty->encode(\%all);

  print "Content-type: application/json\n\n$json";

}

#########################################################################
# MAIN
#########################################################################

# Load the directory entries (*.json and *.cfg)
&Initialize;

my $query = new CGI;

my $action = $query->param('action') ? $query->param('action') : '';

my $requested_host = $query->param('hostname') ? $query->param('hostname') : '';

my $host_valid = $requested_host ne '' and grep(/^$requested_host/,@profiles) ? $requested_host : '' ;

my $option = $query->param('option') ? $query->param('option') : '';

my $stats = $query->param('stats') ? $query->param('stats') : '';

if ($action eq 'getHosts') { &GetHosts(); }
elsif ($action eq 'getProfile' and $host_valid ne '') { &GetProfile($requested_host); }
elsif ($action eq 'configure' and $option ne '' and $host_valid ne '') { &Configure($option, $requested_host); }
elsif ($action eq 'getStats' and $stats ne '') { &GetStats($stats); }
elsif ($action eq 'getOverview' and $stats ne '') { &GetOverview($stats); }
