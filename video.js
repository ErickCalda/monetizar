const modal = document.getElementById('age-modal');
const main = document.getElementById('main-content');
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const videoBox = document.getElementById('videoBox');

function showModal() {
  modal.classList.remove('hidden');
  main.classList.add('hidden');
}

function hideModal() {
  modal.classList.add('hidden');
  main.classList.remove('hidden');
}

// Al cargar la página siempre mostrar modal
showModal();

// Manejar botones del modal
btnYes.onclick = () => {
  localStorage.setItem('ageConfirmed', 'true');
  hideModal();
};

btnNo.onclick = () => {
  alert('No puedes acceder a este sitio.');
  window.location.href = 'https://google.com';
};

// Cargar video según parámetro id de URL
function cargarVideo() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  // JSON local con videos (ejemplo)
  // Este archivo videos.json debe estar en tu servidor con esta estructura
  /*
  [
    { "id": "video1", "url": "https://tuservidor.com/video1.mp4" },
    { "id": "video2", "url": "https://tuservidor.com/video2.mp4" }
  ]
  */
  
  fetch('videos.json')
    .then(res => res.json())
    .then(data => {
      const video = data.find(v => v.id === id);
      if (video) {
        videoBox.onclick = () => window.open(video.url, '_blank');
        videoBox.onkeypress = e => {
          if (e.key === 'Enter' || e.key === ' ') window.open(video.url, '_blank');
        };
      } else {
        videoBox.innerHTML = '<p style="color:#f88;">Video no encontrado. Verifica el ID.</p>';
        videoBox.style.cursor = 'default';
      }
    })
    .catch(() => {
      videoBox.innerHTML = '<p style="color:#f88;">Error cargando datos.</p>';
      videoBox.style.cursor = 'default';
    });
}

// Escuchar cuando modal se cierra para cargar video
const observer = new MutationObserver(() => {
  if (modal.classList.contains('hidden')) {
    cargarVideo();
    observer.disconnect();
  }
});
observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
