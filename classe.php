<?php
    $title = "Classe";
    require ('header.php');
?>

<?php


// Exemple de récupération des groupes depuis une base de données
// Remplacer par votre logique de connexion et de requête
$groupes = [
  ['id' => 1, 'nom' => 'Groupe 1', 'eleves' => 25],
  ['id' => 2, 'nom' => 'Groupe 2', 'eleves' => 22],
  ['id' => 3, 'nom' => 'Groupe 3', 'eleves' => 28],
];
?>

<div class="container my-4">
  <h2>Gestion des groupes d'EPS</h2>
  <a href="ajouter_groupe.php" class="btn btn-success mb-3">Ajouter un groupe</a>
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>Nom du groupe</th>
        <th>Nombre d'élèves</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <?php foreach ($groupes as $groupe): ?>
      <tr>
        <td><?= htmlspecialchars($groupe['nom']) ?></td>
        <td><?= $groupe['eleves'] ?></td>
        <td>
          <a href="voir_groupe.php?id=<?= $groupe['id'] ?>" class="btn btn-info btn-sm">Voir</a>
          <a href="modifier_groupe.php?id=<?= $groupe['id'] ?>" class="btn btn-warning btn-sm">Modifier</a>
          <a href="supprimer_groupe.php?id=<?= $groupe['id'] ?>" class="btn btn-danger btn-sm" onclick="return confirm('Supprimer ce groupe ?');">Supprimer</a>
        </td>
      </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</div>
<div class="container my-4">
  <h3>Liste des élèves par groupe</h3>
  <div class="row">
    <?php
    // Exemple de données d'élèves par groupe (à remplacer par votre logique)
    $elevesParGroupe = [
      1 => ['Alice', 'Bob', 'Charlie'],
      2 => ['David', 'Emma', 'Fanny'],
      3 => ['Gilles', 'Hugo', 'Inès'],
    ];
    foreach ($groupes as $groupe): ?>
      <div class="col-md-4 mb-3">
        <div class="card">
          <div class="card-header">
            <?= htmlspecialchars($groupe['nom']) ?>
          </div>
          <ul class="list-group list-group-flush">
            <?php if (!empty($elevesParGroupe[$groupe['id']])): ?>
              <?php foreach ($elevesParGroupe[$groupe['id']] as $eleve): ?>
                <li class="list-group-item"><?= htmlspecialchars($eleve) ?></li>
              <?php endforeach; ?>
            <?php else: ?>
              <li class="list-group-item text-muted">Aucun élève</li>
            <?php endif; ?>
          </ul>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
</div>


<?php
    require ('footer.php');
?>