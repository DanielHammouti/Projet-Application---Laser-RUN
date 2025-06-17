<?php 
$title = "Note";
require('header.php');
session_start();

// Initialisation des données d'exemple si la session est vide
$_SESSION['eleves'] = [
['id' => 1, 'nom' => 'Dupont', 'prenom' => 'Alice', 'note' => 15, 'date' => '2025-01-11'],
['id' => 2, 'nom' => 'Martin', 'prenom' => 'Bob', 'note' => 12, 'date' => '2025-01-11'],
['id' => 3, 'nom' => 'Durand', 'prenom' => 'Chloé', 'note' => 18, 'date' => '2025-01-11'],
];

$eleves = $_SESSION['eleves'];

// Pour la démo : édition via GET (à éviter en production)
$edit_id = isset($_GET['edit']) ? (int)$_GET['edit'] : null;
?>

<table class="table table-striped">
  <thead>
    <tr>
      <th>Nom</th>
      <th>Prénom</th>
      <th>Note</th>
      <th>Date</th>
    </tr>
  </thead>
  <tbody>
    <?php foreach ($eleves as $eleve): ?>
      <tr>
        <?php if ($edit_id === $eleve['id']): ?>
          <!-- Mode édition (à personnaliser si tu veux un vrai formulaire) -->
          <td colspan="4"><em>Édition de <?= htmlspecialchars($eleve['prenom']) ?></em></td>
        <?php else: ?>
          <td><?= htmlspecialchars($eleve['nom']) ?></td>
          <td><?= htmlspecialchars($eleve['prenom']) ?></td>
          <td><?= $eleve['note'] ?></td>
          <td><?= $eleve['date'] ?></td>
        <?php endif; ?>
      </tr>
    <?php endforeach; ?>
  </tbody>
</table>

<?php require('footer.php'); ?>