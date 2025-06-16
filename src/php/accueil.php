<?php
    $title = "Accueil";
    require ('header.php');
?>
<div class="alert alert-info text-center mt-4" role="alert">
  <h4 class="alert-heading">Espace Professeur</h4>
  <p>
    Bienvenue dans votre espace dédié !<br>
    Ici, vous pouvez suivre les performances de vos élèves, gérer les groupes et voir les notes des éléves.
  </p>
  <hr>
  <a href="classe.php" class="btn btn-primary m-2">Gérer les élèves</a>
  <a href="note.php" class="btn btn-success">Voir les notes</a>
  <a href="../html/index.html" class="btn btn-secondary m-2">Retoruner sur la page non admin</a>
</div>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const elevesBtn = document.querySelector('a[href="classe.php"]');
    const statsBtn = document.querySelector('a[href="note.php"]');
    if (elevesBtn) elevesBtn.setAttribute('href', 'classe.php');
    if (statsBtn) statsBtn.setAttribute('href', 'note.php');
  });
</script>

<?php
    require ('footer.php');
?>