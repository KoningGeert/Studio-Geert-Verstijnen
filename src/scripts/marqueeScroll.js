// /scripts/parralax.js
document.addEventListener("DOMContentLoaded", () => {
    const marqueeInner = document.getElementById("moving-icon-row");
    const marqueeContainer = document.querySelector(".marquee");
    
    // Controleer of de elementen bestaan voordat we doorgaan
    if (!marqueeInner || !marqueeContainer) {
        console.error("Marquee elementen niet gevonden.");
        return;
    }

    // Configuratie
    // De basis snelheid (in pixels per frame) voor de continue beweging
// In /scripts/parralax.js (Vervang de oude baseSpeed lijn):
// const baseSpeed = parseFloat(marqueeContainer.dataset.baseSpeed) || 1.2; 
const baseSpeed = 1.2; // Stel de snelheid hier vast als de data-attribuut mist in de HTML.    // De vertragingsfactor: hoe hoger, hoe sterker de vertraging bij scrollen
    const decelerationFactor = 0.5; 
    
    let trackWidth = 0;
    let currentX = 0; 
    let scrollVelocity = 0; 
    let lastScrollY = window.scrollY;

    // Meet de breedte van één track.
    function getTrackWidth() {
        // Gebruik children[0] om de eerste track te pakken
        return marqueeInner.children[0]?.clientWidth || 0;
    }

    // Functie die continu de beweging aanstuurt (requestAnimationFrame loop)
    function animate() {
        // Valideer de breedte
        if (trackWidth === 0) {
            trackWidth = getTrackWidth();
            requestAnimationFrame(animate);
            return; 
        }

        // --- 1. BEREKEN SCROLL SNELHEID ---
        const scrollDiff = window.scrollY - lastScrollY;
        lastScrollY = window.scrollY;
        
        // Vloeiende berekening van de scrollVelocity (demping: 90% oude waarde, 10% nieuwe delta)
        scrollVelocity = scrollVelocity * 0.9 + scrollDiff * 0.1;
        
        // Zorg dat kleine, onmerkbare bewegingen (ruis) de animatie niet verstoren
        if (Math.abs(scrollVelocity) < 0.1) {
            scrollVelocity = 0;
        }


        // --- 2. BEREKEN HUIDIGE FRAMESNELHEID (Vertraging) ---
        // De framesnelheid (baseSpeed) wordt verminderd door de absolute scrollVelocity.
        let frameSpeed = baseSpeed - (Math.abs(scrollVelocity) * decelerationFactor);
        
        // Zorg ervoor dat de snelheid NOOIT negatief wordt (dus de rij niet achteruit gaat), 
        // maar ook niet helemaal stopt, anders lijkt het vast te lopen.
        if (frameSpeed < 0.2) { 
            frameSpeed = 0.2; // Min. snelheid om te blijven bewegen
        }


        // --- 3. PAS DE POSITIE AAN ---
        // currentX beweegt altijd naar links
        currentX -= frameSpeed;

        // Reset de positie voor een oneindige loop
        // % trackWidth is de juiste manier om de loop te garanderen
        if (currentX <= -trackWidth) {
            currentX += trackWidth; 
        }

        // 4. Transformeer het element
        marqueeInner.style.transform = `translateX(${currentX}px)`;

        requestAnimationFrame(animate);
    }

    // --- Initialisatie Functie ---
    function initializeMarquee() {
        trackWidth = getTrackWidth();
        if (trackWidth > 0) {
            requestAnimationFrame(animate); // Start de animatie
        } else {
            // Probeer het na 100ms opnieuw voor het geval de lay-out nog niet klaar is
            window.setTimeout(initializeMarquee, 100); 
        }
    }

    // Luister naar het 'load' event voor de meest stabiele meting
    window.addEventListener('load', initializeMarquee);

    // Backup voor het geval 'load' al heeft plaatsgevonden
    if (document.readyState === 'complete') {
        initializeMarquee();
    }
    
    // Herbereken de breedte bij wijzigen van venstergrootte
    window.addEventListener('resize', () => {
        trackWidth = getTrackWidth();
    });
});