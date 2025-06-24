firebase.auth().onAuthStateChanged((user) => {
    const isAuthPage = window.location.pathname.includes('../html/auth.html');
    const isNotePage = window.location.pathname.includes('note.php');

    if (user) {
        if (user.uid === "L4iXbUG6eKPdn14mO8ObMqKM8jp1" && !isNotePage) {
            // 🔹 Redirige UNIQUEMENT si on n'est PAS déjà sur note.php
            window.location.href = '../php/note.php';
        } 
    } else if (!isAuthPage) {
        // 🔹 Ne pas entrer dans une boucle si on n'est pas connecté
        window.location.href = '../html/auth.html';
    }
});
