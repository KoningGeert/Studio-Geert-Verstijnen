const cube = document.getElementById('cube');
const faces = document.querySelectorAll('.face');

let isDragging = false;
let startX;
let rotX = 0=; // vaste tilt
let rotY = 345;
let lastDeltaX = 0;
let speedX = 0;
let moved = false;
const SENSITIVITY = 4;

// Update functie
function updateRotation() {
  cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;

  const currentFace = getFrontFace();
  updateFaceTitle(currentFace);
}

// Momentum
function applyMomentum() {
  if (Math.abs(speedX) > 0.1) {
    speedX *= 0.95;
    rotY += speedX / SENSITIVITY;
    updateRotation();
    requestAnimationFrame(applyMomentum);
  }
}

// Begin slepen
cube.addEventListener('mousedown', (e) => {
  isDragging = true;=
  moved = false;
  startX = e.clientX;
  e.preventDefault();
});

// Tijdens slepen (alleen horizontaal)
document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const deltaX = e.clientX - startX;

  if (Math.abs(deltaX) > 5) moved = true;

  rotY += deltaX / SENSITIVITY;
  updateRotation();

  lastDeltaX = deltaX;
  startX = e.clientX;
});

// Loslaten
document.addEventListener('mouseup', () => {
  isDragging = false;
  speedX = lastDeltaX;
  applyMomentum();
});

// Klikbare faces
faces.forEach(face => {
  face.addEventListener('click', (e) => {
    if (moved) return;
    switch (true) {
      case face.classList.contains('front'):
        window.location.href = './pages/wiebenik.html';
        break;
      case face.classList.contains('back'):
        window.location.href = './pages/projecten.html';
        break;
      case face.classList.contains('left'):
        window.location.href = './pages/mijnidee.html';
        break;
      case face.classList.contains('right'):
        window.location.href = './pages/linkjes.html';
        break;
      case face.classList.contains('top'):
        window.location.href = './pages/about.html';
        break;
      case face.classList.contains('bottom'):
        window.location.href = './pages/contact.html';
        break;
    }
  });
});

function getFrontFace() {
    // Normaliseer rotY naar 0-360 graden
    let y = rotY % 360;
    if (y < 0) y += 360;
  
    if (y >= 315 || y < 45) return 'front';
    if (y >= 45 && y < 135) return 'right';
    if (y >= 135 && y < 225) return 'back';
    if (y >= 225 && y < 315) return 'left';
  }

  
function updateFaceTitle(face) {
    const titleEl = document.getElementById('face-title');
    if(face === 'front') titleEl.textContent = 'Wie ben ik';
    if(face === 'back') titleEl.textContent = 'Portfolio';
    if(face === 'left') titleEl.textContent = 'Contact';
    if(face === 'right') titleEl.textContent = 'Over mij';
    if(face === 'top') titleEl.textContent = 'Projecten';
    if(face === 'bottom') titleEl.textContent = 'Blog';
  }
  
updateRotation();
