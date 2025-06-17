// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCC0NfXtYOQfA7n2SCgRz2Zat37zqfXl4Q",
    authDomain: "projetappli-b12ac.firebaseapp.com",
    projectId: "projetappli-b12ac",
    storageBucket: "projetappli-b12ac.appspot.com",
    messagingSenderId: "433789757444",
    appId: "1:433789757444:web:projetappli-b12ac"
};

// Initialisation Firebase
firebase.initializeApp(firebaseConfig);
console.log('Firebase initialisé');

// Éléments du DOM
const loginForm = document.getElementById('login');
const registerForm = document.getElementById('register');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const loginFormContainer = document.getElementById('login-form');
const registerFormContainer = document.getElementById('register-form');

// Vérifier si nous sommes sur la page d'authentification
if (loginForm && registerForm && showRegisterLink && showLoginLink) {
    console.log('Formulaires trouvés:', {
        loginForm: !!loginForm,
        registerForm: !!registerForm,
        showRegisterLink: !!showRegisterLink,
        showLoginLink: !!showLoginLink
    });

    // Gestion de l'affichage des formulaires
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Clic sur le lien d\'inscription');
        loginFormContainer.style.display = 'none';
        registerFormContainer.style.display = 'block';
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Clic sur le lien de connexion');
        registerFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';
    });

    // Gestion de la connexion
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Tentative de connexion');
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            console.log('Connexion réussie:', userCredential.user.email);
            localStorage.setItem('userId', userCredential.user.uid);
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Erreur de connexion:', error);
            alert('Erreur de connexion : ' + error.message);
        }
    });

    registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const firstName = document.getElementById('register-first-name').value;
    const sexe = document.getElementById('register-sexe').value;
    const formation = document.getElementById('register-formation').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (password !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas.');
        return;
    }

        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            console.log('Inscription réussie:', userCredential.user.email);
            console.log(userCredential.user.uid);

            createUserAPI(userCredential.user.uid, name, firstName, formation, sexe);
            localStorage.setItem('userId', userCredential.user.uid);

            window.location.href = 'index.html';
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            alert('Erreur d\'inscription : ' + error.message);
        }
    });
}

// Suivi de l'état d'authentification
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log('Utilisateur connecté :', user.email);
    } else {
        console.log('Utilisateur déconnecté');
    }
}); 


function createUserAPI(uid, nom, prenom, classe, sexe){
    const url = 'https://172.16.100.3/api/users/create.php';

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: {
            id: uid,
            nom: nom,
            prenom: prenom,
            classe: classe,
            sexe: sexe
        },
        success: function(response){
            console.log(response);
        },
        error: function(error){
            console.error('Erreur lors de la création de l\'utilisateur:', error);
        }
    });
}