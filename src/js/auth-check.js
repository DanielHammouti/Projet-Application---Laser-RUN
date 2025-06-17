// Vérification de l'état de connexion
firebase.auth().onAuthStateChanged((user) => {
    // Vérifier si nous sommes sur la page d'authentification
    const isAuthPage = window.location.pathname.includes('auth.html');
    
    if (!user && !isAuthPage) {
        // Rediriger vers auth.html seulement si on n'est pas déjà sur la page d'authentification
        window.location.href = 'auth.html';
    } else if (user) {
        console.log("Utilisateur connecté :", user.uid);

        if (user.uid === "IZKsWOMvDtZcCpL0rYgHSxnL7oc2") {
            window.location.href = "note.php";
        }
    }
});
