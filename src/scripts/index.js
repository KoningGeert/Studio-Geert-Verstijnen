const cube = document.getElementById('cube');
const faces = document.querySelectorAll('.face');

let isDragging = false;
let startX, startY;
let rotX = 0; // vaste tilt
let rotY = 345;
let lastDeltaX = 0;
let speedX = 0;
let moved = false;
const SENSITIVITY = 4;

// Tilt & idle
let tiltX = 0, tiltY = 0;
let currentTiltX = 0, currentTiltY = 0;
const MAX_TILT = 18;
const TILT_SMOOTHNESS = 0.1;
let idleTime = 0;

// ------------------
// ROTATIE UPDATE
// ------------------
function updateRotation() {
  cube.style.transform = `
    rotateX(${rotX + currentTiltX}deg)
    rotateY(${rotY + currentTiltY}deg)
  `;
  
  const currentFace = getFrontFace();
  updateFaceTitle(currentFace);
}

// ------------------
// MOMENTUM
// ------------------
function applyMomentum() {
  if (Math.abs(speedX) > 0.1) {
    speedX *= 0.95;
    rotY += speedX / SENSITIVITY;
    updateRotation();
    requestAnimationFrame(applyMomentum);
  }
}

// ------------------
// DESKTOP DRAG
// ------------------
cube.addEventListener('mousedown', (e) => {
  isDragging = true;
  moved = false;
  startX = e.clientX;
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const deltaX = e.clientX - startX;
  if (Math.abs(deltaX) > 5) moved = true;

  rotY += deltaX / SENSITIVITY;
  updateRotation();

  lastDeltaX = deltaX;
  startX = e.clientX;
});

document.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  speedX = lastDeltaX;
  applyMomentum();
});

// ------------------
// MOBILE TOUCH DRAG
// ------------------
cube.addEventListener('touchstart', (e) => {
  isDragging = true;
  moved = false;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

cube.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const touch = e.touches[0];
  const deltaX = touch.clientX - startX;
  const deltaY = touch.clientY - startY;

  if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) moved = true;

  rotY += deltaX / SENSITIVITY;
  rotX -= deltaY / SENSITIVITY; // verticale tilt optioneel

  updateRotation();

  lastDeltaX = deltaX;
  startX = touch.clientX;
  startY = touch.clientY;

  e.preventDefault(); // voorkomt scroll
});

cube.addEventListener('touchend', () => {
  if (!isDragging) return;
  isDragging = false;
  speedX = lastDeltaX;
  applyMomentum();
});

// ------------------
// INTERACTIEVE TILT OP MUIS
// ------------------
window.addEventListener('mousemove', (e) => {
  const { innerWidth, innerHeight } = window;

  const normalizedX = (e.clientX / innerWidth) * 2 - 1;
  const normalizedY = (e.clientY / innerHeight) * 2 - 1;

  tiltX = -normalizedY * MAX_TILT;
  tiltY = -normalizedX * MAX_TILT; // horizontaal correct
});

// ------------------
// GYROSCOOP SUPPORT
// ------------------
if (window.DeviceOrientationEvent) {
  // iOS 13+ vereist expliciete toestemming
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    const btn = document.createElement('button');
    btn.textContent = 'Activeer 3D';
    btn.className = 'fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-xl z-50';
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
      DeviceOrientationEvent.requestPermission().then(response => {
        if (response === 'granted') {
          btn.remove();
        }
      });
    });
  }

  window.addEventListener('deviceorientation', (e) => {
    // gamma: links/rechts, beta: voor/achter
    const gamma = e.gamma || 0;
    const beta = e.beta || 0;

    tiltX = (beta / 90) * MAX_TILT;
    tiltY = -(gamma / 90) * MAX_TILT; // horizontaal correct
  });
}

// ------------------
// ANIMATE TILT + IDLE
// ------------------
function animateTilt() {
  currentTiltX += (tiltX - currentTiltX) * TILT_SMOOTHNESS;
  currentTiltY += (tiltY - currentTiltY) * TILT_SMOOTHNESS;

  // Subtiele idle drift
  idleTime += 0.02;
  const idleX = Math.sin(idleTime) * 1.5;
  const idleY = Math.cos(idleTime / 1.5) * 1.5;

  cube.style.transform = `
    rotateX(${rotX + currentTiltX + idleX}deg)
    rotateY(${rotY + currentTiltY + idleY}deg)
  `;

  requestAnimationFrame(animateTilt);
}
animateTilt();

// ------------------
// FACE CLICK EVENTS
// ------------------
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

// ------------------
// UTILITY FUNCTIONS
// ------------------
function getFrontFace() {
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


const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');

menuBtn.addEventListener('click', () => {
  menu.classList.toggle('hidden'); // toont of verbergt het menu
});