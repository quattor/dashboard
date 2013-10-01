<?php
  ob_start();
  header("Content-type: text/plain");
  ob_end_clean();
  session_write_close();

  require_once('ofc/php-ofc-library/open-flash-chart.php');
  require_once("list.inc.php");

  $graph = "os";

  if (isset($_REQUEST["n"])) {
    $graph = $_REQUEST["n"];
    if (in_array($graph, $graphs)) {
      $rdata = Array();
      exec("./graph-$graph.sh", $rdata);
      //print_r($rdata);
      $rdata=implode($rdata, "\n");
      $rdata = explode("\n", $rdata);
      $osdata = Array();
      foreach ($rdata as $r) {
        $r = trim($r);
        $r = preg_split("/\s+/", $r, 2);
        $osdata[$r[0]] = $r[1];
      }
  
      if ($osdata) {
        $pie = new pie();
        $pie->radius(96);
        $pie->set_alpha(0.8);
    //    $pie->set_start_angle(45);
        $pie->add_animation( new pie_fade() );
        $pie->set_tooltip( '#percent#<br>#val# of #total#' );
        $pie->set_colours(
          array(
            '#edd400',
            '#f57900',
            '#c17d11',
            '#73d216',
            '#3465a4',
            '#75507b',
            '#cc0000',
            '#2e3436',
          )
        );
  
        $values = array();
  
        foreach ($osdata as $c => $n) {
          array_push($values, new pie_value((int)$c, $n));
        }
  
        $pie->set_values($values);
  
  
        //Chart
        $chart = new open_flash_chart();
        $chart->set_bg_colour('#ffffff');
        $chart->add_element( $pie );
  
        $chart->x_axis = null;
  
        echo $chart->toPrettyString();
      } else {
        echo "No data";
      }
    } else {
      echo "Invalid graph";
    }
  } else {
    echo "No graph specified, use ?n=";
  }

?>
