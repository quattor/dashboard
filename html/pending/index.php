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
      td.red {
        background-color: #cc0000;
      }
      td.green {
        background-color: #73d216;
      }
      td.yellow {
        background-color: #edd400
      }
    </style>
  </head>
  <body>
<?php
    $current_page = 'pending';
    require('../navbar.inc.php');
?>
    <div class="container">
      <div class="row">
        <table class="table table-bordered">
          <tr><th>AII Server</th><th>Date Requested</th><th>IP (Hex)</th><th>IP (Dotted Quad)</th><th>Host Payload</th><th>Sanity</th></tr>
<?php

echo file_get_contents("http://quattor.example.com/cgi-bin/pending.cgi");

?>
        </table>
      </div>
    </div>
    <hr />
    <div class="footer container" >
      <p class="muted credit">Copyright &copy; 2011-2013 quattor.org</p>
    </div>
  </body>
</html>
