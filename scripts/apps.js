const icons = document.querySelectorAll('.app-icon');
const screens = document.querySelectorAll('.app-screen');
const homeScreen = document.querySelector('.home-screen');

icons.forEach(icon => {
  icon.addEventListener('click', () => {
    const appId = icon.dataset.app + '-app';
    document.getElementById(appId).classList.add('active');
    homeScreen.style.display = 'none';
  });
});

document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.app-screen').classList.remove('active');
    homeScreen.style.display = 'grid';
  });
});