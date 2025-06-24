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