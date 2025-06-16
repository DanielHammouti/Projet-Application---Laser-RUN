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
  <button id="ajouterGroupeBtn" class="btn btn-success mb-3">Ajouter un groupe</button>
  <table class="table table-bordered" id="tableGroupes">
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
          <a href="modifier_groupe.php?id=<?= $groupe['id'] ?>" class="btn btn-warning btn-sm">Modifier</a>
          <a href="supprimer_groupe.php?id=<?= $groupe['id'] ?>" class="btn btn-danger btn-sm" onclick="return confirm('Supprimer ce groupe ?');">Supprimer</a>
        </td>
      </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</div>
<script>
document.getElementById('ajouterGroupeBtn').addEventListener('click', function() {
  const tbody = document.getElementById('tableGroupes').querySelector('tbody');
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td><input type="text" class="form-control" placeholder="Nom du groupe"></td>
    <td><input type="number" class="form-control" min="0" value="0"></td>
    <td>
      <button class="btn btn-success btn-sm valider">Valider</button>
      <button class="btn btn-danger btn-sm supprimer">Supprimer</button>
    </td>
  `;
  tbody.appendChild(newRow);

  // Bouton supprimer pour la nouvelle ligne
  newRow.querySelector('.supprimer').addEventListener('click', function() {
    newRow.remove();
  });

  // Bouton valider pour transformer la ligne
  newRow.querySelector('.valider').addEventListener('click', function() {
    const nom = newRow.querySelector('input[type="text"]').value.trim();
    const nb = newRow.querySelector('input[type="number"]').value;
    if (!nom) {
      alert("Veuillez saisir un nom de groupe.");
      return;
    }
    newRow.innerHTML = `
      <td>${nom}</td>
      <td>${nb}</td>
      <td>
        <a href="#" class="btn btn-warning btn-sm">Modifier</a>
        <button class="btn btn-danger btn-sm supprimer">Supprimer</button>
      </td>
    `;
    // Réactiver le bouton supprimer sur la nouvelle ligne
    newRow.querySelector('.supprimer').addEventListener('click', function() {
      newRow.remove();
    });
  });
});
</script>


<?php
    require ('footer.php');
?>