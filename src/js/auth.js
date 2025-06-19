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
const forgotPasswordForm = document.getElementById('forgot-password');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const showForgotPasswordLink = document.getElementById('show-forgot-password');
const showLoginFromForgotLink = document.getElementById('show-login-from-forgot');
const loginFormContainer = document.getElementById('login-form');
const registerFormContainer = document.getElementById('register-form');
const forgotPasswordFormContainer = document.getElementById('forgot-password-form');

// Vérifier si nous sommes sur la page d'authentification
if (loginForm && registerForm && showRegisterLink && showLoginLink) {
    console.log('Formulaires trouvés:', {
        loginForm: !!loginForm,
        registerForm: !!registerForm,
        forgotPasswordForm: !!forgotPasswordForm,
        showRegisterLink: !!showRegisterLink,
        showLoginLink: !!showLoginLink,
        showForgotPasswordLink: !!showForgotPasswordLink,
        showLoginFromForgotLink: !!showLoginFromForgotLink
    });

    // Gestion de l'affichage des formulaires
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Clic sur le lien d\'inscription');
        loginFormContainer.style.display = 'none';
        forgotPasswordFormContainer.style.display = 'none';
        registerFormContainer.style.display = 'block';
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Clic sur le lien de connexion');
        registerFormContainer.style.display = 'none';
        forgotPasswordFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';
    });

    showForgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Clic sur le lien mot de passe oublié');
        loginFormContainer.style.display = 'none';
        registerFormContainer.style.display = 'none';
        forgotPasswordFormContainer.style.display = 'block';
    });

    showLoginFromForgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Retour à la connexion depuis mot de passe oublié');
        forgotPasswordFormContainer.style.display = 'none';
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
            setupLocalStorage(userCredential);

            // Redirection spécifique
            if (userCredential.user.uid === "IZKsWOMvDtZcCpL0rYgHSxnL7oc2") {
                window.location.href = '../php/note.php';
            } else {
                window.location.href = 'index.html';
            }

        } catch (error) {
            console.error('Erreur de connexion:', error);
            alert('Erreur de connexion : ' + error.message);
        }
    });

    // Gestion du mot de passe oublié
    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Tentative de réinitialisation de mot de passe');
        const email = document.getElementById('forgot-email').value;

        try {
            await firebase.auth().sendPasswordResetEmail(email);
            console.log('Email de réinitialisation envoyé');
            alert('Un email de réinitialisation a été envoyé à votre adresse email.');
            
            // Retour au formulaire de connexion
            forgotPasswordFormContainer.style.display = 'none';
            loginFormContainer.style.display = 'block';
            
        } catch (error) {
            console.error('Erreur de réinitialisation:', error);
            alert('Erreur lors de l\'envoi de l\'email : ' + error.message);
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

            // Redirection spécifique
            console.log(userCredential.user.uid);
            setupLocalStorage(userCredential);
            createUserAPI(userCredential.user.uid, name, firstName, formation, sexe);
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
        localStorage.removeItem("userId");
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

function setupLocalStorage(userCredential){
    localStorage.setItem('userId', userCredential.user.uid);
    localStorage.setItem('sixmeter', 0);
    localStorage.setItem('meneur', 'no');
    localStorage.setItem('dateheure', new Date().toISOString());
}

/**
 * Vérifie les champs saisis lors de la connexion ou de l'inscription.
 * @param {Object} data – Champs à valider.
 * @param {string} data.email
 * @param {string} data.password
 * @param {string} [data.confirmPassword] – Requis uniquement à l'inscription.
 * @param {Object.<string,string>} [data.obligatoires] – Autres champs obligatoires { nom: '', prenom: '', ... }.
 * @returns {{estValide: boolean, message: string}} – Résultat de la validation.
 */
function verifierAuthInput({ email, password, confirmPassword = null, obligatoires = {} }) {
  // Expression régulière pour un e-mail basique.
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !regexEmail.test(email)) {
    return { estValide: false, message: 'Adresse e-mail invalide.' };
  }

  if (!password || password.length < 6) {
    return { estValide: false, message: 'Le mot de passe doit contenir au moins 6 caractères.' };
  }

  // Si confirmPassword est fourni, nous sommes sur l'inscription : vérifier la cohérence.
  if (confirmPassword !== null && password !== confirmPassword) {
    return { estValide: false, message: 'Les mots de passe ne correspondent pas.' };
  }

  // Vérifier les autres champs obligatoires (nom, prénom, etc.).
  for (const [cle, valeur] of Object.entries(obligatoires)) {
    if (!valeur || valeur.trim() === '') {
      return { estValide: false, message: `Le champ « ${cle} » est requis.` };
    }
  }

  return { estValide: true, message: 'Validation réussie.' };
}