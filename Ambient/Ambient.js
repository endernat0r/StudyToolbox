const soundFiles = {
  rain: 'soft-rain-ambient-111154.mp3',
  forest: 'ambient-spring-forest-323801.mp3',
  waves: 'ambient-forest-bird-sounds-280152.mp3',
  cafe: 'ambient-sound-inside-cafeteria-18255.mp3'
};

const sounds = {};
for (let key in soundFiles) {
  const audio = new Audio(soundFiles[key]);
  audio.loop = true;
  audio.volume = 0.5;
  sounds[key] = audio;
}

const cap = str => str.charAt(0).toUpperCase() + str.slice(1);

document.querySelectorAll('.sound-card').forEach(card => {
  const key = card.dataset.sound;
  const btn = card.querySelector('.play-btn');
  const slider = card.querySelector('.volume-slider');
  const audio = sounds[key];

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      btn.textContent = `Stop ${cap(key)}`;
      btn.classList.add('active');
    } else {
      audio.pause();
      btn.textContent = cap(key);
      btn.classList.remove('active');
    }
  });

  slider.addEventListener('input', () => {
    audio.volume = slider.value;
  });
});