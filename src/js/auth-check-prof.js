firebase.auth().onAuthStateChanged((user) => {
    const isAuthPage = window.location.pathname.includes('auth.html');

    if (user) {
        if (user.uid === "IZKsWOMvDtZcCpL0rYgHSxnL7oc2") {
            // Si l'utilisateur avec l'UID spécifique est connecté
            window.location.href = '../php/note.php';
        } else {
            // Si un autre utilisateur est connecté, on peut le rediriger ailleurs ou ne rien faire
            console.log("Utilisateur non autorisé.");
        }
    } else if (!isAuthPage) {
        window.location.href = 'auth.html';
    }
});
