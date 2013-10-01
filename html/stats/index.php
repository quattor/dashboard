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
    </style>
  </head>
  <body>
<?php
    $current_page = 'dashboard';
    require('../navbar.inc.php');
?>
    <div class="container">
      <div class="row">
<?php
require_once("list.inc.php");
foreach ($graphs as $g) {
echo '        <object class="graph" type="application/x-shockwave-flash" data="open-flash-chart.swf"><param name="flashvars" value="data-file=graph.php?n='.$g.'" /><p>Graph not found</p></object>'."\n";
} ?>
      </div>
    </div>
    <hr />
    <div class="footer container" >
      <p class="muted credit">Copyright &copy; 2011-2013 quattor.org</p>
    </div>
  </body>
</html>
