const parallax = document.querySelector(".parallax-bg");

window.addEventListener("scroll", () => {
  const offset = window.pageYOffset;
  if (parallax) parallax.style.transform = `translateY(${offset * -0.1}px)`;
});