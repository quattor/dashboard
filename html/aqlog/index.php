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
      pre.message.aq{
        color: #204a87;
      }
      pre.message.git{
        color: #ce5c00;
      }
    </style>
  </head>
  <body>
<?php
    $current_page = 'aqlog';
    require('../navbar.inc.php');
?>
    <div style="position: absolute; top: 50%; left: -1.5em; transform:rotate(90deg); opacity: 0.15; font-size: 128pt; font-weight: bold; z-index: -1000;">aquilon</div>
    <div class="container">
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

$log = file_get_contents('http://quattor.example.com/aqd-requests.log');
$log = explode("\n", $log);

$PATTERN = "/^(.*) \[KNCHTTPChannel,.*,\] Incoming command #[0-9]* from user=(.*) aq (.*) with arguments {(.*)}$/";

$messages = Array();
$timestamps = Array();


// Broker Log
foreach(array_reverse($log) as $l) {
  if (strlen($l) > 0) {
    preg_match($PATTERN, $l, $m);
    if (sizeof($m) > 0) {
      $d = $m[1];
      $u = $m[2];
      $c = $m[3];
      $a = $m[4];

      $d = time() - strtotime($d);

      $c = str_replace("_", " ", $c);

      $a = explode(",", str_replace("'", "", $a));

      foreach($a as $w) {
        $w = explode(":", $w);
        $arg = trim($w[0]);
        $val = trim($w[1]);
        if ($arg != "format") {
          $c .= " --$arg $val";
        }
      }

      array_push($messages, Array($d, $u, $c, "aq"));
      array_push($timestamps, $d);
    }
  }
}


// Git Log
$log = file_get_contents('http://quattor.example.com/aqd-git.log');
$log = explode("\n", $log);

foreach($log as $l) {
  if (strlen($l) > 0) {
    $l = explode(";", $l);
    if (sizeof($l) == 3 ) {
      $d = $l[0];
      $u = $l[1];
      $m = $l[2];

      $d = time() - (int)$d;

      array_push($messages, Array($d, $u, $m, "git"));
      array_push($timestamps, $d);
    }
  }
}


// Render
array_multisort($timestamps, $messages);
$messages = array_slice($messages, 0, 10);

foreach ($messages as $l) {
  $d = $l[0]; // datetime
  $u = $l[1]; // user
  $m = $l[2]; // message
  $t = $l[3]; // type

  $c = "message";

  if ($t) {
    $c .= " ".$t;
  }

  $d = prettytime($d);

  if (array_key_exists($u, $users)) {
    $u = $users[$u];
  }

  echo "    <div class=\"row\">\n";
  echo "      <div class=\"span10\"><h2>$u</h2></div>\n";
  echo "      <div class=\"span2\"><p>$d</p></div>\n";
  echo "      <div class=\"span12\"><pre class=\"$c\">$m</pre></div>\n";
  echo "    </div>\n";
}

?>
    </div>
    <hr />
    <div class="footer container" >
      <p class="muted credit">Copyright &copy; 2011-2013 quattor.org</p>
    </div>
  </body>
</html>

