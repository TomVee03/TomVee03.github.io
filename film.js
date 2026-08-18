(() => {
  const root = document.getElementById('filmPage');
  const url = window.CHRONICLE_SUPABASE_URL, key = window.CHRONICLE_SUPABASE_KEY;
  const slug = new URLSearchParams(location.search).get('slug');
  if (!slug) { root.innerHTML='<h1>Film not found</h1>'; return; }
  if (!url || !key || url.includes('YOUR_')) { root.innerHTML='<h1>Chronicle AI</h1><p>The film database is not configured yet.</p>'; return; }
  const db = supabase.createClient(url,key);
  db.from('films').select('*').eq('slug',slug).eq('published',true).single().then(({data,error})=>{
    if (error || !data) { root.innerHTML='<h1>Film not found</h1><p>This film may still be a draft.</p>'; return; }
    document.title = `${data.title} | Chronicle AI`;
    const meta = document.querySelector('meta[name="description"]'); if(meta) meta.content=data.description||'AI historical reconstruction on Chronicle AI';
    root.innerHTML = `<span class="section-kicker">AI HISTORICAL RECONSTRUCTION</span><h1>${esc(data.title)}</h1><p>${esc(data.historical_date||'')}${data.location?' · '+esc(data.location):''}${data.era?' · '+esc(data.era):''}</p><video controls playsinline preload="metadata" poster="${attr(data.thumbnail_url||'')}" style="width:100%;max-height:70vh;background:#000;margin:2rem 0" src="${attr(data.video_url)}"></video><div class="about-grid"><section><h2>About this film</h2><p>${esc(data.description||'')}</p></section><section><h2>Historical context</h2><p>${esc(data.historical_context||'').replace(/\n/g,'<br>')}</p></section></div><section style="margin-top:3rem"><h2>Sources</h2><ol>${(data.sources||[]).map(s=>`<li>${esc(s)}</li>`).join('')}</ol></section><section class="creator-panel" style="margin-top:3rem"><div><span class="section-kicker">TRANSPARENCY</span><h2>AI reconstruction</h2><p>This production uses artificial intelligence to reconstruct historical people, places, and events. Visual and narrative details may include historically plausible interpretation.</p></div></section>`;
  });
  function esc(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  function attr(v=''){return esc(v);}
})();
