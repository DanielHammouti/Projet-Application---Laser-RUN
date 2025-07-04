document.addEventListener('DOMContentLoaded', function() {
    // Gestion de la langue
    const langueSelect = document.getElementById('langue');
    const currentLang = localStorage.getItem('selectedLanguage') || 'fr';
    langueSelect.value = currentLang;

    // Gestion de la course
    const courseSelect = document.getElementById('course');
    // Déterminer la valeur initiale à partir de « sixmeter »
    const sixmeterStorage = localStorage.getItem('sixmeter');
    if (sixmeterStorage === '1') {
        courseSelect.value = '600m';
    } else {
        courseSelect.value = '400';
    }

    // Mettre à jour sixmeter en fonction de la course sélectionnée
    function updateSixmeter() {
        const selectedCourse = courseSelect.value;
        const sixmeter = selectedCourse === '600m' ? '1' : '0';
        localStorage.setItem('sixmeter', sixmeter);
        localStorage.setItem('course', selectedCourse);
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

    // Fonction de mise à jour du localStorage pour le meneur
    function updateMeneur() {
        const value = meneurYes.checked ? 'yes' : 'no';
        localStorage.setItem('meneur', value);
        console.log('🔍 DEBUG - meneur:', value);
    }

    // Écouter les changements de la sélection de course
    courseSelect.addEventListener('change', updateSixmeter);

    // Mettre à jour le localStorage lorsque l'utilisateur change le meneur
    meneurYes.addEventListener('change', updateMeneur);
    meneurNo.addEventListener('change', updateMeneur);

    // Gestion du bouton valider
    document.getElementById('bouton_valide').addEventListener('click', function() {
        const selectedLang = document.getElementById('langue').value;
        setLanguage(selectedLang);
        updateSixmeter();
        updateMeneur();
    });
});
