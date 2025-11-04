const cube = document.getElementById('cube');
let isDragging = false;
let startX, startY;
let rotX = 20; // Beginrotatie X
let rotY = 45; // Beginrotatie Y
let lastDeltaX = 0; // Houdt de snelheid van de laatste muisbeweging bij
let lastDeltaY = 0;
let speedX = 0; // Snelheid in X richting na het loslaten van de muis
let speedY = 0; // Snelheid in Y richting na het loslaten van de muis

const SENSITIVITY = 4; // Gevoeligheid, lager = soepeler

// Functie om de kubus daadwerkelijk te roteren
function updateRotation() {
    cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
}

// Functie om momentum toe te voegen en de kubus langzaam af te laten remmen
function applyMomentum() {
    if (Math.abs(speedX) > 0.1 || Math.abs(speedY) > 0.1) {
        // Verminder de snelheid een beetje om te zorgen voor een langzaam afremmend effect
        speedX *= 0.95;
        speedY *= 0.95;

        // Pas de rotatie aan met de snelheid
        rotX -= speedY / SENSITIVITY;
        rotY += speedX / SENSITIVITY;

        // Update de rotatie in de CSS
        updateRotation();

        // Blijf de momentum functie aanroepen
        requestAnimationFrame(applyMomentum);
    }
}

// 1. Muizenknop ingedrukt (begin van het slepen)
cube.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    e.preventDefault();
});

// 2. Muis beweegt (tijdens het slepen)
document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    // Bereken de verplaatsing van de muis
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    // Pas de rotatie aan met de nieuwe gevoeligheidsfactor
    rotX -= deltaY / SENSITIVITY;
    rotY += deltaX / SENSITIVITY;

    // Update de rotatie in de CSS
    updateRotation();
    
    // Sla de snelheid op voor momentum na het loslaten van de muis
    lastDeltaX = deltaX;
    lastDeltaY = deltaY;

    // De startpositie resetten voor de volgende kleine beweging
    startX = e.clientX;
    startY = e.clientY;
});

// 3. Muizenknop losgelaten (einde van het slepen)
document.addEventListener('mouseup', () => {
    isDragging = false;

    // Sla de snelheid op bij het loslaten van de muis
    speedX = lastDeltaX;
    speedY = lastDeltaY;

    // Start het momentum effect
    applyMomentum();
});

// Initieel de kubus tonen
updateRotation();
