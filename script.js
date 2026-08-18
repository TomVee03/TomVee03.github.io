const searchToggle = document.querySelector('#searchToggle');
const searchPanel = document.querySelector('#searchPanel');
const filmSearch = document.querySelector('#filmSearch');
const clearSearch = document.querySelector('#clearSearch');
const filters = [...document.querySelectorAll('.filter')];
const filmCards = [...document.querySelectorAll('.film-card')];
const emptyState = document.querySelector('#emptyState');
const videoModal = document.querySelector('#videoModal');
const modalTitle = document.querySelector('#modalTitle');
const creatorModal = document.querySelector('#creatorModal');
const creatorForm = document.querySelector('#creatorForm');
const formStatus = document.querySelector('#formStatus');

let activeFilter = 'all';

function updateFilms() {
  const query = filmSearch.value.trim().toLowerCase();
  let visible = 0;

  filmCards.forEach(card => {
    const matchesFilter = activeFilter === 'all' || card.dataset.category === activeFilter;
    const matchesSearch = !query || card.dataset.search.includes(query) || card.textContent.toLowerCase().includes(query);
    const show = matchesFilter && matchesSearch;
    card.hidden = !show;
    if (show) visible += 1;
  });

  emptyState.hidden = visible !== 0;
}

searchToggle.addEventListener('click', () => {
  const open = searchPanel.classList.toggle('open');
  searchPanel.setAttribute('aria-hidden', String(!open));
  if (open) setTimeout(() => filmSearch.focus(), 180);
});

filmSearch.addEventListener('input', updateFilms);
clearSearch.addEventListener('click', () => {
  filmSearch.value = '';
  updateFilms();
  filmSearch.focus();
});

filters.forEach(button => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filters.forEach(filter => filter.classList.remove('active'));
    button.classList.add('active');
    updateFilms();
  });
});

document.querySelectorAll('[data-play]').forEach(button => {
  button.addEventListener('click', () => {
    modalTitle.textContent = button.dataset.play;
    videoModal.showModal();
  });
});

document.querySelector('[data-close-modal]').addEventListener('click', () => videoModal.close());

document.querySelectorAll('.era-card').forEach(button => {
  button.addEventListener('click', () => {
    searchPanel.classList.add('open');
    searchPanel.setAttribute('aria-hidden', 'false');
    filmSearch.value = button.dataset.era;
    activeFilter = 'all';
    filters.forEach(filter => filter.classList.toggle('active', filter.dataset.filter === 'all'));
    updateFilms();
    document.querySelector('#films').scrollIntoView({ behavior: 'smooth' });
  });
});

document.querySelector('#openCreator').addEventListener('click', () => creatorModal.showModal());
document.querySelector('[data-close-creator]').addEventListener('click', () => creatorModal.close());

creatorForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(creatorForm);
  const title = data.get('title') || 'Untitled production';
  formStatus.textContent = `Draft “${title}” captured in this preview. Database saving comes next.`;
});

[videoModal, creatorModal].forEach(dialog => {
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) dialog.close();
  });
});
