const parallax = document.querySelector('.parallax-bg');

window.addEventListener('scroll', () => {
  const offset = window.pageYOffset;
  // Gebruik een negatieve vermenigvuldiger (-0.5) om de afbeelding omhoog te verplaatsen
  // ten opzichte van de scroll-offset, wat het diepte-effect creëert.
  parallax.style.transform = `translateY(${offset * -0.5}px)`;
});