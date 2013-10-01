<!DOCTYPE html>
<html>
  <head>
    <title>QUATTOR</title>
    <link rel="stylesheet" type="text/css" href="/bootstrap/css/bootstrap.min.css" media="screen" />
    <link href="/bootstrap/css/bootstrap-responsive.css" rel="stylesheet">
    <link rel="icon" href="/img/favicon.ico"/>
    <style type="text/css">
      @import url(http://fonts.googleapis.com/css?family=Lato:400);
      body {
        padding-top: 60px;
        padding-bottom: 40px;
        font-family: 'Lato', 'Helvetica', sans-serif;
      }
      .graph {
        width: 49%;
        height: 320px;
      }
      table {
        border-collapse: collapse;
        width: 100%;
        background-color: white;
      }
      td.red {
        background-color: #cc0000;
      }
      td.green {
        background-color: #73d216;
      }
    </style>
  </head>
  <body>
<?php
    $current_page = 'deploys';
    require('../navbar.inc.php');
?>
    <div style="position: absolute; top: 50%; left: -0.8em; transform:rotate(90deg); opacity: 0.15; font-size: 128pt; font-weight: bold; z-index: -1000;">scdb</div>
    <div class="container">
      <div class="row">
<?php

// Routine for displaying the timestamps
function prettytime ($t) {
  $prefix = "";
  $suffix = " ago";

  if ($t < 0) {
    $prefix = "In ";
    $suffix = "";
    $t = $t * -1;
  }

  if ($t < 120) { return sprintf("$prefix%.1f seconds$suffix", $t); }
  elseif ($t < 120*60) { return sprintf("$prefix%.1f minutes$suffix", $t/60); }
  elseif ($t < 24*60*60) { return sprintf("$prefix%.1f hours$suffix", $t/(60*60)); }
  elseif ($t < 24*60*60*7) { return sprintf("$prefix%.1f days$suffix", $t/(24*60*60)); }
  elseif ($t < 24*60*60*365) { return sprintf("$prefix%.1f weeks$suffix", $t/(24*60*60*7)); }
  else { return sprintf("$prefix%.1f years$suffix", $t/(24*60*60*365)); }
}

$users = Array();
include("../config/users.inc.php"); //Should overwrite $users

$log = Array();
exec("/usr/local/bin/deploys-today", $log);

$log = array_reverse($log);

echo "        <table class=\"table table-bordered\">\n";
echo "          <tr><th>Revision</th><th>User</th><th>Date</th></tr>\n";
foreach($log as $l) {
  $rev = trim(substr($l, 0, 7));
  $user = trim(substr($l, 8, 22));
  $user = $users[$user];
  $date = trim(substr($l, 30));
  echo "          <tr><td>$rev</td><td>$user</td><td>$date</td></tr>\n";
}
echo "        </table>\n";

?>
      </div>
    </div>
    <hr />
    <div class="footer container" >
      <p class="muted credit">Copyright &copy; 2011-2013 quattor.org</p>
    </div>
  </body>
</html>

