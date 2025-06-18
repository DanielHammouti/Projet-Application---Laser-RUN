document.addEventListener('DOMContentLoaded', function() {
    // Gestion de la langue
    const langueSelect = document.getElementById('langue');
    const currentLang = localStorage.getItem('selectedLanguage') || 'fr';
    langueSelect.value = currentLang;

    // Gestion de la course
    const courseSelect = document.getElementById('course');
    const currentCourse = localStorage.getItem('course');
    const sixmeter = localStorage.getItem('sixmeter') === '1' ? '600m' : '400m';
    console.log('🔍 DEBUG - sixmeter affichage:', sixmeter);
    courseSelect.value = sixmeter;

    // Mettre à jour sixmeter en fonction de la course sélectionnée
    function updateSixmeter() {
        const selectedCourse = courseSelect.value;
        const sixmeter = selectedCourse === '600m' ? '1' : '0';
        localStorage.setItem('sixmeter', sixmeter);
        console.log('🔍 DEBUG - sixmeter:', sixmeter);
    }

    // Initialiser sixmeter au chargement
    updateSixmeter();

    // Gestion du meneur d'allure
    const meneurYes = document.getElementById('meneur-yes');
    const meneurNo = document.getElementById('meneur-no');
    const currentMeneur = localStorage.getItem('meneur') || 'no';
    if (currentMeneur === 'yes') {
        meneurYes.checked = true;
    } else {
        meneurNo.checked = true;
    }

    // Mettre à jour le localStorage lorsque l'utilisateur change le meneur
    meneurYes.addEventListener('change', () => {
        if (meneurYes.checked) {
            localStorage.setItem('meneur', 'yes');
        }
    });

    meneurNo.addEventListener('change', () => {
        if (meneurNo.checked) {
            localStorage.setItem('meneur', 'no');
        }
    });

    // Écouter les changements de la sélection de course
    courseSelect.addEventListener('change', updateSixmeter);

    // Gestion du bouton valider
    document.getElementById('bouton_valide').addEventListener('click', function() {
        const selectedLang = document.getElementById('langue').value;
        setLanguage(selectedLang);
        updateSixmeter();
    });
});
