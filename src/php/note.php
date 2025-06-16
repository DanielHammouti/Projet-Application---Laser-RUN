<?php 
$title = "Note";
require('header.php');
?>

<?php
// Exemple de données d'élèves et de notes (à remplacer par une récupération depuis une base de données)
session_start();
if (!isset($_SESSION['eleves'])) {
  $_SESSION['eleves'] = [
    ['id' => 1, 'nom' => 'Dupont', 'prenom' => 'Alice', 'note' => 15],
    ['id' => 2, 'nom' => 'Martin', 'prenom' => 'Bob', 'note' => 12],
    ['id' => 3, 'nom' => 'Durand', 'prenom' => 'Chloé', 'note' => 18],
  ];
}
$eleves = $_SESSION['eleves'];

// Ajouter un élève
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['ajouter'])) {
  $nouvel_id = count($eleves) ? max(array_column($eleves, 'id')) + 1 : 1;
  $eleves[] = [
    'id' => $nouvel_id,
    'nom' => $_POST['nom'],
    'prenom' => $_POST['prenom'],
    'note' => (float)$_POST['note']
  ];
  $_SESSION['eleves'] = $eleves;
  echo '<div class="alert alert-success">Élève ajouté !</div>';
}

// Supprimer un élève
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['supprimer'])) {
  $id_suppr = (int)$_POST['eleve_id'];
  $eleves = array_filter($eleves, fn($e) => $e['id'] !== $id_suppr);
  $_SESSION['eleves'] = $eleves;
  echo '<div class="alert alert-success">Élève supprimé !</div>';
}


// Après avoir modifié l'élève
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['modifier'])) {
  $id_modif = (int)$_POST['eleve_id'];
  foreach ($eleves as &$eleve) {
    if ($eleve['id'] === $id_modif) {
      $eleve['nom'] = $_POST['nom'];
      $eleve['prenom'] = $_POST['prenom'];
      $eleve['note'] = (float)$_POST['note'];
      break;
    }
  }
  unset($eleve);
  $_SESSION['eleves'] = $eleves;
  // Redirection pour nettoyer l'URL
  header('Location: ' . strtok($_SERVER["REQUEST_URI"], '?'));
  exit;
}

// Pour la démo, on gère l'édition en GET (pas sécurisé pour la prod)
$edit_id = isset($_GET['edit']) ? (int)$_GET['edit'] : null;
?>

<!-- Formulaire d'ajout -->
<form method="post" class="mb-3 d-flex gap-2 align-items-end">
  <input type="hidden" name="ajouter" value="1">
  <input type="text" name="nom" placeholder="Nom" required class="form-control" style="width:120px;">
  <input type="text" name="prenom" placeholder="Prénom" required class="form-control" style="width:120px;">
  <input type="number" name="note" placeholder="Note" min="0" max="20" step="0.1" required class="form-control" style="width:80px;">
  <button type="submit" class="btn btn-success btn-sm">Ajouter</button>
</form>

<table class="table table-striped">
  <thead>
    <tr>
      <th>Nom</th>
      <th>Prénom</th>
      <th>Note</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    <?php foreach ($eleves as $eleve): ?>
    <tr>
      <?php if ($edit_id === $eleve['id']): ?>
        <!-- Ligne en mode édition -->
        <form method="post" style="display:contents;">
          <td>
            <input type="hidden" name="eleve_id" value="<?= $eleve['id'] ?>">
            <input type="hidden" name="modifier" value="1">
            <input type="text" name="nom" value="<?= htmlspecialchars($eleve['nom']) ?>" class="form-control" required>
          </td>
          <td>
            <input type="text" name="prenom" value="<?= htmlspecialchars($eleve['prenom']) ?>" class="form-control" required>
          </td>
          <td>
            <input type="number" name="note" value="<?= $eleve['note'] ?>" min="0" max="20" step="0.1" class="form-control" required>
          </td>
          <td>
            <button type="submit" class="btn btn-primary btn-sm">Valider</button>
            <a href="<?= strtok($_SERVER["REQUEST_URI"], '?') ?>" class="btn btn-secondary btn-sm">Annuler</a>
          </td>
        </form>
      <?php else: ?>
        <!-- Ligne normale -->
        <td><?= htmlspecialchars($eleve['nom']) ?></td>
        <td><?= htmlspecialchars($eleve['prenom']) ?></td>
        <td><?= $eleve['note'] ?></td>
        <td>
          <a href="?edit=<?= $eleve['id'] ?>" class="btn btn-warning btn-sm">Modifier</a>
          <form method="post" style="display:inline;">
            <input type="hidden" name="eleve_id" value="<?= $eleve['id'] ?>">
            <button type="submit" name="supprimer" class="btn btn-danger btn-sm" onclick="return confirm('Supprimer cet élève ?');">Supprimer</button>
          </form>
        </td>
      <?php endif; ?>
    </tr>
    <?php endforeach; ?>
  </tbody>
</table>


<?php
    require ('footer.php');
?>