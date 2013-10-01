<?php
    $pages = array(
        "dashboard" => "System Property Dashboard",
        "svnlog"    => "SCDB Activity",
        "deploys"   => "Deploys Today",
        "aqlog"     => "Aquilon Activity",
        "pending"   => "Pending Installs",
    );
?>
    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <a class="brand" href="/"><img src="/img/quattor_logo_navbar.png" width="94" height="23" alt="quattor logo"/></a>
          <div class="nav-collapse collapse">
            <ul class="nav">
<?php
    foreach ($pages as $page => $label) {
        $state = "";
        if (isset($current_page) and ($current_page == $page)) {
            $state = ' class="active"';
        }
        echo "              <li$state><a href=\"/$page\">$label</a></li>\n";
    }
?>
            </ul>
          </div>
        </div>
      </div>
    </div>
