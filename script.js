const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealEls = document.querySelectorAll('.frame, .note-card');

if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealEls.forEach((el) => observer.observe(el));
} else {
  // no IntersectionObserver, or the visitor prefers less motion — just show everything
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

document.querySelectorAll('.frame img').forEach((img) => {
  const markEmpty = () => img.closest('.frame').classList.add('frame--empty');
  img.addEventListener('error', markEmpty);
  if (img.complete && img.naturalWidth === 0) markEmpty();   // already failed before this ran
});

const discBtn = document.getElementById('disc-btn');
const songAudio = document.getElementById('song-audio');
const tapHint = document.getElementById('tap-hint');

if (discBtn && songAudio) {
  songAudio.addEventListener('error', () => {
    discBtn.disabled = true;
    discBtn.setAttribute('aria-label', 'No song has been added yet');
    if (tapHint) tapHint.textContent = 'add your song at audio/song.mp3';
  });

  discBtn.addEventListener('click', () => {
    if (songAudio.paused) {
      songAudio.play().catch(() => {});
    } else {
      songAudio.pause();
    }
  });

  songAudio.addEventListener('play', () => {
    discBtn.classList.add('is-playing');
    discBtn.setAttribute('aria-pressed', 'true');
    if (tapHint) tapHint.textContent = 'tap to pause';
  });

  songAudio.addEventListener('pause', () => {
    discBtn.classList.remove('is-playing');
    discBtn.setAttribute('aria-pressed', 'false');
    if (tapHint && !discBtn.disabled) tapHint.textContent = 'tap the record';
  });
}
