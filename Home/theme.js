const modeToggle = document.getElementById('mode-toggle');
const modeIcon = document.getElementById('mode-icon');

const applyTheme = (theme) => {
    document.body.classList.toggle('darkmode', theme === 'dark');
    if (modeIcon) {
        const currentSrc = modeIcon.src;
        const path = currentSrc.substring(0, currentSrc.lastIndexOf('/') + 1);
        modeIcon.src = theme === 'dark' ? `${path}lightmode.png` : `${path}darkmode.png`;
    }
};

if (modeToggle) {
    modeToggle.addEventListener('click', () => {
        const newTheme = document.body.classList.contains('darkmode') ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
}

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('mode-toggle');
  const icon      = document.getElementById('mode-icon');

  
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);

  toggleBtn.addEventListener('click', () => {
    applyTheme(document.documentElement.classList.contains('darkmode') ? 'light' : 'dark');
  });

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      toggleBtn.click();
    }
  });

  function applyTheme(name) {
    if (name === 'dark') {
      document.documentElement.classList.add('darkmode');
      icon.src = 'lightmode.png';       
    } else {
      document.documentElement.classList.remove('darkmode');
      icon.src = 'darkmode.png';
    }
    localStorage.setItem('theme', name);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.textContent = '↑';
  document.body.appendChild(btn);

  btn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) btn.classList.add('visible');
    else btn.classList.remove('visible');
  });
});