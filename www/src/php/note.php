<?php
    $title = "Note";
    require ('header.php');
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liste des utilisateurs</title>
    <link rel="stylesheet" href="../css/style_admin.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-ENjdO4Dr2bkBIFxQpeoHkM0DkA6U6O2y9E+IoVx1l5KkN4B+0I4MaV8KmV6E5bgc"
            crossorigin="anonymous"></script>
</head>
<body>
    <h1>Liste des utilisateurs</h1>
        <div class="ligne-select">
            <div class="text" id="text">Formation</div>
                <select name="formation" id="choix_formation">
                    <option value="all">Toutes les formations</option>
                    <option value="sti">STI</option>
                    <option value="mri">MRI
                </select>
        </div>
        <table border="1" id="tableau-utilisateurs">
            <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Note</th>
                <th>Date</th>
                <th>Détails</th>
                <th>Historique des notes</th>
            </tr>
        </table>

    <script src="/src/js/note.js"></script>

    <script >
            document.addEventListener("DOMContentLoaded", function () {
                fetch("https://172.16.100.3/api/users/read.php", {
                    credentials: "include"
                })
                    .then(response => response.json())
                    .then(data => {
                        window.utilisateurs = data.users; // Stocker tous les utilisateurs
                        afficherUtilisateurs("all"); // Afficher tous les élèves par défaut
                    });

                document.getElementById("choix_formation").addEventListener("change", function () {
                    afficherUtilisateurs(this.value); // Filtrer selon la sélection
                });
            });

            function afficherUtilisateurs(formation) {
                let tableau = document.getElementById("tableau-utilisateurs");

                tableau.innerHTML = `<tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Note</th>
                            <th>Date</th>
                            <th>Détails</th>
                            <th>Historique des notes</th>
                        </tr>`;

                window.utilisateurs.forEach(user => {
                    if ((formation === "all" && (user.classe.toLowerCase() === "sti" || user.classe.toLowerCase() === "mri") &&
                        user.id !== "L4iXbUG6eKPdn14mO8ObMqKM8jp1") || user.classe.toLowerCase() === formation.toLowerCase()) {
                        let row = `<tr id="row-${user.id}">
                                    <td>${user.nom}</td>
                                    <td>${user.prenom}</td>
                                    <td id="note-${user.id}"></td>
                                    <td id="date-${user.id}"></td>
                                    <td><button class="view-btn" onclick="voirDetails('${user.id}')">Voir</button></td>
                                    <td><button class="view-btn" onclick="voirNotes('${user.id}','${user.sexe}')">Notes</button></td>
                                </tr>`;
                        tableau.innerHTML += row;
                    
                    // Récupérer la session de l'utilisateur et calculer la note
                        fetch(`https://172.16.100.3/api/sessions/read.php?id_user=${user.id}`)
                            .then(response => response.json())
                            .then(sessionData => {
                                if (sessionData.sessions.length > 0 && user.id !== "L4iXbUG6eKPdn14mO8ObMqKM8jp1") {
                                    let session = sessionData.sessions[0]; // Prendre la première session trouvée
                                    let tempsTotal = (session.six ?? 0) + (session.quatre ?? 0) + (session.deux ?? 0);
                                    let noteInfo = getBestNote(user.sexe, tempsTotal, session.nb_tirs); // Calculer la note
                                    document.getElementById(`note-${user.id}`).innerText = noteInfo.total;
                                    document.getElementById(`date-${user.id}`).innerText = new Date(session.dateheure).toLocaleDateString('fr-FR');
                                } else {
                                    document.getElementById(`note-${user.id}`).innerText = "Pas de note";
                                }
                            })
                    }});
                }
            

</script>

    <!-- Ajouter le modal Bootstrap en bas du body si absent -->
    <div class="modal fade" id="detailsModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Détails de la session</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="detailsBody"></div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="notesModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Historique des notes</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="notesBody"></div>
            </div>
        </div>
    </div>

    <script>
        // Ajouter le JavaScript pour gérer le modal
        window.voirDetails = function(userId) {
            fetch(`https://172.16.100.3/api/sessions/read.php?id_user=${userId}`)
                .then(res => res.json())
                .then(data => {
                    if(!data.sessions || data.sessions.length === 0) {
                        alert('Aucune session trouvée');
                        return;
                    }
                    const session = data.sessions.sort((a,b) => new Date(b.dateheure) - new Date(a.dateheure))[0];
                    const body = document.getElementById('detailsBody');
                    body.innerHTML = `
                        <p><strong>Date :</strong> ${new Date(session.dateheure).toLocaleString('fr-FR')}</p>
                        <p><strong>400 m :</strong> ${session.quatre ?? 'N/A'} s</p>
                        <p><strong>600 m :</strong> ${session.six ?? 'N/A'} s</p>
                        <p><strong>200 m :</strong> ${session.deux ?? 'N/A'} s</p>
                        <p><strong>Nombre de tirs réussis :</strong> ${session.nb_tirs}</p>
                        <p><strong>Meneur :</strong> ${session.meneur ? 'Oui' : 'Non'}</p>`;

                    const modalEl = document.getElementById('detailsModal');
                    modalEl.classList.add('show');
                    modalEl.style.display = 'block';
                    const closeBtn = modalEl.querySelector('.btn-close');
                    const hideModal = () => { modalEl.classList.remove('show'); modalEl.style.display = 'none'; };
                    closeBtn.onclick = hideModal;
                    window.onclick = (e) => { if (e.target === modalEl) hideModal(); };
                })
                .catch(err => {
                    console.error(err);
                    alert('Erreur lors de la récupération des détails');
                });
        }

        window.voirNotes = function(userId, sexe) {
            fetch(`https://172.16.100.3/api/sessions/read.php?id_user=${userId}`)
                .then(res=>res.json())
                .then(data=>{
                    if(!data.sessions || data.sessions.length===0){alert('Aucune session');return;}
                    // construire tableau des notes
                    let html = '<table style="width:100%;border-collapse:collapse"><tr><th>Date</th><th>Note</th></tr>';
                    data.sessions.forEach(s=>{
                        const dStr=new Date(s.dateheure).toLocaleDateString('fr-FR');
                        const tempsTotal = (s.six ?? 0) + (s.quatre ?? 0) + (s.deux ?? 0);
                        const noteInfo = getBestNote(sexe, tempsTotal, s.nb_tirs);
                        html+=`<tr><td>${dStr}</td><td>${noteInfo.total}</td></tr>`;
                    });
                    html+='</table>';
                    document.getElementById('notesBody').innerHTML=html;
                    const modal=document.getElementById('notesModal');
                    modal.classList.add('show');modal.style.display='block';
                    const closeBtn=modal.querySelector('.btn-close');
                    const hide=()=>{modal.classList.remove('show');modal.style.display='none';};
                    closeBtn.onclick=hide;window.onclick=(e)=>{if(e.target===modal)hide();};
                });
        }
    </script>
</body>
</html>
