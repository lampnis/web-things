const themeSwitcher = document.querySelector('.theme-switcher');
const buttons = themeSwitcher.querySelectorAll('button');
const wallpapers = {
    'dark': 'theme-wallpapers/dark.png',
    'light': 'theme-wallpapers/light.png',
    'blood-orange': 'theme-wallpapers/bloodorange.png',
    'pink-moon': 'theme-wallpapers/pinkmoon.png'
}

const updateWallpaper = (theme) => {
    const wallpaperElements = document.querySelectorAll('.wallpaper img');
    wallpaperElements.forEach((img) => {
        if (wallpapers[theme]) {
            img.src = wallpapers[theme];
        }
    });
}

const handleThemeSelection = (event) => {
  const target = event.target;
  const theme = target.getAttribute('data-theme');
  const isPressed = target.getAttribute('aria-pressed');
  document.documentElement.setAttribute("data-selected-theme", theme);
  
  const previouslyPressedButton = document.querySelector('[data-theme][aria-pressed="true"]');
  previouslyPressedButton.setAttribute('aria-pressed', false);
  target.setAttribute('aria-pressed', 'true');
  updateWallpaper(theme);
  localStorage.setItem('selected-theme', theme);
}

const savedTheme = localStorage.getItem('selected-theme');
const defaultTheme = "dark";
const toApply = savedTheme || defaultTheme;
updateWallpaper(toApply);

if (savedTheme && savedTheme !== defaultTheme) {
  const previouslyPressedButton = document.querySelector('[data-theme][aria-pressed="true"]');
  previouslyPressedButton.setAttribute('aria-pressed', false);
  document.querySelector(`[data-theme="${savedTheme}"]`).setAttribute('aria-pressed', true);
  document.documentElement.setAttribute("data-selected-theme", savedTheme);
}

buttons.forEach((button) => {
   button.addEventListener('click', handleThemeSelection);
});
