// SLIDESHOW CODE
(function(){
  const slideshow = document.getElementById('aboutSlideshow');
  const track = slideshow.querySelector('.slides-track');
  const slides = Array.from(track.querySelectorAll('.slide'));
  const prev = slideshow.querySelector('.slide-prev');
  const next = slideshow.querySelector('.slide-next');
  const dots = Array.from(slideshow.querySelectorAll('.dot'));
  if(!slides.length) return;

  let idx = 0, timer = null;
  let width = slideshow.clientWidth;
  let pointerId = null, startX = 0, startTranslate = 0, dragging = false;

  function updateWidth(){ width = slideshow.clientWidth; updateTrack(true); }
  window.addEventListener('resize', updateWidth);

  function updateTrack(animate){
    track.style.transition = animate ? 'transform 320ms ease' : 'none';
    track.style.transform = `translateX(${ -idx * width }px)`;
    dots.forEach((d,i) => d.classList.toggle('active', i === idx));
  }

  function show(i){
    idx = (i + slides.length) % slides.length;
    updateTrack(true);
  }

  function resetTimer(){
    if(timer) clearInterval(timer);
    timer = setInterval(()=> show(idx+1), 6000);
  }

  prev.addEventListener('click', e => { e.stopPropagation(); show(idx-1); resetTimer(); });
  next.addEventListener('click', e => { e.stopPropagation(); show(idx+1); resetTimer(); });
  dots.forEach(d => d.addEventListener('click', e => { e.stopPropagation(); show(Number(e.target.dataset.index)); resetTimer(); }));

  // SWIPING
  slideshow.addEventListener('pointerdown', e => {
    if (e.button && e.button !== 0) return;
    if (e.target.closest('.slide-prev, .slide-next, .dot, button')) return;
    pointerId = e.pointerId;
    slideshow.setPointerCapture(pointerId);
    startX = e.clientX;
    startTranslate = -idx * width;
    dragging = true;
    track.style.transition = 'none';
    if(timer) clearInterval(timer);
  });

  slideshow.addEventListener('pointermove', e => {
    if(!dragging || e.pointerId !== pointerId) return;
    const delta = e.clientX - startX;
    track.style.transform = `translateX(${ startTranslate + delta }px)`;
    e.preventDefault();
  });

  function endDrag(e){
    if(!dragging || e.pointerId !== pointerId) return;
    const delta = e.clientX - startX;
    const threshold = Math.max(40, width * 0.15);
    if(delta < -threshold) idx = Math.min(idx + 1, slides.length - 1);
    else if(delta > threshold) idx = Math.max(idx - 1, 0);
    updateTrack(true);
    dragging = false;
    try { slideshow.releasePointerCapture(pointerId); } catch(err){}
    pointerId = null;
    resetTimer();
  }

  slideshow.addEventListener('pointerup', endDrag);
  slideshow.addEventListener('pointercancel', endDrag);
  slideshow.addEventListener('dragstart', e => e.preventDefault());

  updateWidth();
  resetTimer();
})();

//SKILLS PANEL
document.addEventListener('DOMContentLoaded', function () {
  const skillsList = document.querySelector('.skills-list');
  const panel = document.getElementById('skill-panel-inline');
  if (!skillsList || !panel) return;

  const ids = ['html-section', 'css-section', 'javascript-section'];
  const sources = {};
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) sources[id] = el;
  });

  let currentId = null;

  skillsList.addEventListener('click', function (e) {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (!href.startsWith('#')) return;
    const id = href.slice(1);
    const source = sources[id];
    if (!source) return;
    e.preventDefault();

    if (currentId === id) {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      panel.innerHTML = '';
      currentId = null;
      return;
    }

    panel.innerHTML = ''; 
    const container = document.createElement('div');
    container.className = 'skill-panel-content';
    Array.from(source.children).forEach(ch => container.appendChild(ch.cloneNode(true)));
    panel.appendChild(container);

    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    currentId = id;

    setTimeout(() => {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  });
});