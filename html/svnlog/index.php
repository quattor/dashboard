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
      }
      td {
        border: 1px solid #babdb6;
        padding: 0.6em 0.4em 0.6em 0.4em;
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
    $current_page = 'svnlog';
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
exec("/usr/bin/svn log https://quattor.example.com/svn/quattor/trunk -l 10 --non-interactive --trust-server-cert --username USERNAME --password PASSWORD", $log);
// Trim first and last lines
array_pop($log);
array_shift($log);


foreach($log as $l) {
  if (strlen($l) > 0) {
    if ($l == "------------------------------------------------------------------------") {
      echo "</pre>\n";
      echo "        </div>\n";
      echo "      </div>\n";
      echo "      <div class=\"row\">\n";
    } elseif ((strpos($l, "|") !== FALSE) && (strpos($l, "line") !== FALSE)) {
      $l = explode("|", $l);
      $u = trim($l[1]);
      if (array_key_exists($u, $users)) {
        $u = $users[$u];
      }
      $d = explode("(", $l[2]);
      $d = time() - strtotime($d[0]);
      $d = prettytime($d);
      echo "        <div class=\"span10\"><h2>$u</h2></div>\n";
      echo "        <div class=\"span2\"><p class=\"text-right\">$d</p></div>\n";
      echo "      </div>\n";
      echo "      <div class=\"row\">\n";
      echo "        <div class=\"span12\">\n";
      echo "          <pre>\n";
    } else {
      echo "$l\n";
    }
  }
}
?>
      </div>
    </div>
    <hr />
    <div class="footer container" >
      <p class="muted credit">Copyright &copy; 2011-2013 quattor.org</p>
    </div>
  </body>
</html>

