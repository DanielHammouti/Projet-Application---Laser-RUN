document.addEventListener('DOMContentLoaded', function() {
    // Gestion de la langue
    const langueSelect = document.getElementById('langue');
    const currentLang = localStorage.getItem('selectedLanguage') || 'fr';
    langueSelect.value = currentLang;

    // Gestion de la course
    const courseSelect = document.getElementById('course');
    const currentCourse = localStorage.getItem('course') || '400';
    courseSelect.value = currentCourse;

    // Mettre à jour sixmeter en fonction de la course sélectionnée
    function updateSixmeter() {
        const selectedCourse = courseSelect.value;
        const sixmeter = selectedCourse === '600m' ? 1 : 0;
        localStorage.setItem('sixmeter', sixmeter);
    }

    // Initialiser sixmeter au chargement
    updateSixmeter();

    // Écouter les changements de la sélection de course
    courseSelect.addEventListener('change', updateSixmeter);

    // Gestion du bouton valider
    document.getElementById('bouton_valide').addEventListener('click', function() {
        const selectedLang = document.getElementById('langue').value;
        setLanguage(selectedLang);
        updateSixmeter();
    });
});
