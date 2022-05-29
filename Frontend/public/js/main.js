function setupTheme(theme) {
  if (theme === null) {
    // first time arriving, no theme set.
    // check for OS setting for dark theme, otherwise set default of light.
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    theme = prefersDarkScheme.matches ? 'dark' : 'light';
  }

  const bodyEl = document.querySelector('body');
  const themeClass = 'theme-' + theme;
  const btnClass = theme === 'light' ? 'moon' : 'sun';
  const backdropImg = theme === 'light' ? 'backdrop-light.jpg' : 'backdrop-dark.jpg';

  bodyEl.classList.remove('theme-light', 'theme-dark');
  bodyEl.classList.add(themeClass);

  const toggleSchemaBtns = document.querySelectorAll('.btn-toggle-scheme');
  toggleSchemaBtns.forEach(function (btn) {
    btn.firstElementChild.classList.remove('sun', 'moon');
    btn.firstElementChild.classList.add(btnClass);
  });

  var parallaxImgs = document.querySelectorAll('.parallax img');
  parallaxImgs.forEach(function (img) {
    img.src = 'images/' + backdropImg;
  });

  //initParallax();
}

function initScrollMagic() {
  const controller = new ScrollMagic.Controller();
  new ScrollMagic.Scene({
    triggerElement: ".recently-played-songs",
    triggerHook: 0.9,
    offset: 50,
    reverse: false
  })
  .setClassToggle(".recently-played-songs", "visible") // add class to reveal
  .addTo(controller);
}

// function initParallax() {
//   var parallax = document.querySelectorAll('.parallax');
//   M.Parallax.init(parallax, {});
// }

document.addEventListener('DOMContentLoaded', function () {
  // setup material ui components
  var sidenav = document.querySelectorAll('.sidenav');
  M.Sidenav.init(sidenav, {});

  //initParallax();
  initScrollMagic()

  // toggle light / dark theme
  const currentTheme = localStorage.getItem('theme');
  const bodyEl = document.querySelector('body');
  const btnToggleSchemeEls = document.querySelectorAll('.btn-toggle-scheme');

  setupTheme(currentTheme);

  btnToggleSchemeEls.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const isLightTheme = bodyEl.classList.contains('theme-light');
      const theme = isLightTheme ? 'dark' : 'light';

      setupTheme(theme);
      localStorage.setItem('theme', theme);
    });
  });
});