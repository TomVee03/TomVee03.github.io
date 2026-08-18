(() => {
  const url = window.CHRONICLE_SUPABASE_URL;
  const key = window.CHRONICLE_SUPABASE_KEY;
  const loginPanel = document.getElementById('loginPanel');
  const studioPanel = document.getElementById('studioPanel');
  const loginStatus = document.getElementById('loginStatus');
  const formStatus = document.getElementById('formStatus');
  if (!url || !key || url.includes('YOUR_')) { loginStatus.textContent = 'Supabase is not configured yet. Follow SUPABASE-SETUP.md in the repository.'; return; }
  const db = supabase.createClient(url, key);

  async function refreshUI() {
    const { data } = await db.auth.getSession();
    const signedIn = !!data.session;
    loginPanel.hidden = signedIn;
    studioPanel.hidden = !signedIn;
    if (signedIn) loadProductions();
  }

  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault(); loginStatus.textContent = 'Signing in…';
    const { error } = await db.auth.signInWithPassword({ email: document.getElementById('email').value, password: document.getElementById('password').value });
    loginStatus.textContent = error ? error.message : '';
    if (!error) refreshUI();
  });

  document.getElementById('signOut').addEventListener('click', async () => { await db.auth.signOut(); refreshUI(); });

  document.getElementById('filmForm').addEventListener('submit', async e => {
    e.preventDefault(); formStatus.textContent = 'Uploading…';
    const form = new FormData(e.currentTarget);
    const { data: auth } = await db.auth.getUser();
    const user = auth.user;
    if (!user) return;
    const slug = form.get('slug').trim().toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/^-|-$/g,'');
    const video = form.get('video'), thumb = form.get('thumbnail');
    const videoPath = `${user.id}/${Date.now()}-${video.name}`;
    const thumbPath = `${user.id}/${Date.now()}-${thumb.name}`;
    let r = await db.storage.from('films').upload(videoPath, video, { upsert:false, contentType: video.type });
    if (r.error) { formStatus.textContent = r.error.message; return; }
    r = await db.storage.from('thumbnails').upload(thumbPath, thumb, { upsert:false, contentType: thumb.type });
    if (r.error) { formStatus.textContent = r.error.message; return; }
    const videoUrl = db.storage.from('films').getPublicUrl(videoPath).data.publicUrl;
    const thumbnailUrl = db.storage.from('thumbnails').getPublicUrl(thumbPath).data.publicUrl;
    const payload = {
      title: form.get('title'), slug, historical_date: form.get('historical_date'), location: form.get('location'), era: form.get('era'),
      description: form.get('description'), historical_context: form.get('historical_context'),
      sources: form.get('sources').split('\n').map(s=>s.trim()).filter(Boolean), video_url: videoUrl, thumbnail_url: thumbnailUrl,
      published: form.get('published') === 'on', created_by: user.id
    };
    const { error } = await db.from('films').upsert(payload, { onConflict:'slug' });
    formStatus.textContent = error ? error.message : 'Saved successfully.';
    if (!error) { e.currentTarget.reset(); loadProductions(); }
  });

  async function loadProductions() {
    const { data, error } = await db.from('films').select('*').order('created_at', { ascending:false });
    const list = document.getElementById('productionList');
    if (error) { list.textContent = error.message; return; }
    list.innerHTML = data.map(f => `<article class="film-card"><div class="film-card-copy"><span class="film-label">${f.published?'PUBLISHED':'DRAFT'}</span><h3>${escapeHtml(f.title)}</h3><p>${escapeHtml(f.historical_date||'')} ${f.location?'· '+escapeHtml(f.location):''}</p>${f.published?`<a href="film.html?slug=${encodeURIComponent(f.slug)}">Open public page</a>`:''}</div></article>`).join('');
  }
  function escapeHtml(v=''){return v.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  db.auth.onAuthStateChange(refreshUI); refreshUI();
})();
