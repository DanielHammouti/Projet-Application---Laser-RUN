<?php
function getNav($lien, $title){

        $classe = "";

        if ($lien === $_SERVER['SCRIPT_NAME']){
            $classe = "active";
        }

        $html = '<li class="nav-item ';
        $html .= $classe;
        $html .= '">';
        $html .= '<a class="nav-link" aria-current="page" href="' . $lien . '">'.$title.'</a>';
        $html .= '</li>';

        return $html;
    }


?>
<!doctype html>
<html lang="en" data-bs-theme="auto">
  <head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors">
    <meta name="generator" content="Hugo 0.122.0">
    <title><?php echo $title ?></title>

    <link rel="canonical" href="https://getbootstrap.com/docs/5.3/examples/navbar-static/">

    <link rel="stylesheet" href="ajouter.css">    
    <link rel="stylesheet" href="asyncfunction.css">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

<meta name="theme-color" content="#712cf9">

    <style>
  

    </style>

       <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">LaserTrack</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
  </div>
</nav>

  