

const tirsContainer = document.querySelector('.tirs');
const template = document.getElementById('ligne-tir-template');

for (let i = 1; i <= 5; i++) {
    const clone = template.content.cloneNode(true);
    const name = `tir${i}`;
    const yesInput = clone.querySelector('.check-vert');
    const noInput = clone.querySelector('.check-rouge');
    const yesLabel = clone.querySelector('.label-yes');
    const noLabel = clone.querySelector('.label-no');

    yesInput.id = `${name}-yes`;
    yesInput.name = name;
    noInput.id = `${name}-no`;
    noInput.name = name;

    yesLabel.htmlFor = yesInput.id;
    noLabel.htmlFor = noInput.id;

    clone.querySelector('.num').textContent = i;

    noInput.setAttribute('onclick', 'openPopup()');

    tirsContainer.appendChild(clone);
}




function openPopup() {
    document.getElementById("popupOverlay").style.display = "flex";
}

function closePopup() {
    document.getElementById("popupOverlay").style.display = "none";
}