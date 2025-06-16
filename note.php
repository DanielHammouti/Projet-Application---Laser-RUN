<?php 
$title = "Note";
require('header.php');
?>

<?php
// Exemple de données d'élèves et de notes (à remplacer par une récupération depuis une base de données)
$eleves = [
  ['id' => 1, 'nom' => 'Dupont', 'prenom' => 'Alice', 'note' => 15],
  ['id' => 2, 'nom' => 'Martin', 'prenom' => 'Bob', 'note' => 12],
  ['id' => 3, 'nom' => 'Durand', 'prenom' => 'Chloé', 'note' => 18],
];

// Traitement de la modification de note
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['eleve_id'], $_POST['nouvelle_note'])) {
  $eleve_id = (int)$_POST['eleve_id'];
  $nouvelle_note = (float)$_POST['nouvelle_note'];
  // Ici, il faudrait mettre à jour la note dans la base de données
  // Exemple : update_note($eleve_id, $nouvelle_note);
  // Pour la démo, on met à jour dans le tableau temporaire
  foreach ($eleves as &$eleve) {
    if ($eleve['id'] === $eleve_id) {
      $eleve['note'] = $nouvelle_note;
      break;
    }
  }
  unset($eleve);
  echo '<div class="alert alert-success">Note mise à jour !</div>';
}
?>

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
      <td><?= htmlspecialchars($eleve['nom']) ?></td>
      <td><?= htmlspecialchars($eleve['prenom']) ?></td>
      <td>
        <form method="post" style="display:inline-flex; gap:5px;">
          <input type="hidden" name="eleve_id" value="<?= $eleve['id'] ?>">
          <input type="number" name="nouvelle_note" value="<?= $eleve['note'] ?>" min="0" max="20" step="0.1" class="form-control" style="width:80px;">
      </td>
      <td>
          <button type="submit" class="btn btn-primary btn-sm">Modifier</button>
        </form>
      </td>
    </tr>
    <?php endforeach; ?>
  </tbody>
</table>


<?php
    require ('footer.php');
?>