
const NS = {
  productFallback: [
    {name:"Meridian Performance Polo",category:"Polos",industry:"Corporate",desc:"Polished moisture-management polo designed for daily branded wear.",colors:"6 colors",image:"https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=1000&q=85"},
    {name:"Foundry Oxford Shirt",category:"Dress Shirts",industry:"Corporate",desc:"Structured oxford with a clean profile for client-facing teams.",colors:"5 colors",image:"https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=1000&q=85"},
    {name:"Forge Utility Shirt",category:"Work Shirts",industry:"Construction",desc:"Hard-wearing woven shirt with room for movement and branding.",colors:"4 colors",image:"https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1000&q=85"},
    {name:"Atlas Softshell",category:"Jackets",industry:"Logistics",desc:"Weather-ready outer layer with a premium corporate finish.",colors:"4 colors",image:"https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=1000&q=85"},
    {name:"Fieldmark Safety Vest",category:"Safety",industry:"Construction",desc:"High-visibility layer engineered for active work environments.",colors:"3 colors",image:"https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=85"},
    {name:"Harbor Scrub Set",category:"Scrubs",industry:"Healthcare",desc:"Clean, comfortable uniform set for clinical and support teams.",colors:"8 colors",image:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=85"},
    {name:"Service Apron System",category:"Hospitality",industry:"Hospitality",desc:"Refined hospitality apron with configurable embroidery zones.",colors:"7 colors",image:"https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=85"},
    {name:"Transit Work Pant",category:"Work Pants",industry:"Logistics",desc:"Straight-fit work pant built for long shifts and repeat wear.",colors:"4 colors",image:"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=85"}
  ],
  products: [],
  industries: [],
  init(){
    this.loadPrefs(); this.bindHeader(); this.bindReveal(); this.bindBackTop(); this.bindForms();
    this.loadData(); this.bindQuote(); this.bindFilters(); this.bindModal(); this.bindFAQ();
  },
  loadPrefs(){
    const theme=localStorage.getItem('ns-theme')||'light', rtl=localStorage.getItem('ns-rtl')==='true';
    document.documentElement.dataset.theme=theme; document.documentElement.dir=rtl?'rtl':'ltr';
    const tb=document.querySelector('[data-theme-toggle]'); if(tb) tb.setAttribute('aria-label',theme==='dark'?'Switch to light mode':'Switch to dark mode');
  },
  bindHeader(){
    const menu=document.querySelector('[data-menu]'), links=document.querySelector('.navlinks');
    if(links){
      const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
      links.querySelectorAll('a').forEach(a=>{const target=(a.getAttribute('href')||'').split('/').pop().toLowerCase();const active=target===current||(current===''&&target==='index.html');a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
    }
    menu?.setAttribute('aria-expanded','false');
    menu?.addEventListener('click',(event)=>{event.preventDefault();event.stopPropagation();const open=!(links?.classList.contains('mobile-open'));links?.classList.toggle('mobile-open',open);menu?.setAttribute('aria-expanded',String(open));menu?.setAttribute('aria-label',open?'Close menu':'Open menu');menu.textContent=open?'×':'☰';});
    links?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{links.classList.remove('mobile-open');menu?.setAttribute('aria-expanded','false');if(menu){menu.textContent='☰';menu.setAttribute('aria-label','Open menu')}}));
    document.addEventListener('click',e=>{if(links?.classList.contains('mobile-open')&&!links.contains(e.target)&&!menu?.contains(e.target)){links.classList.remove('mobile-open');menu?.setAttribute('aria-expanded','false');if(menu){menu.textContent='☰';menu.setAttribute('aria-label','Open menu')}}});
    document.querySelector('[data-theme-toggle]')?.addEventListener('click',()=>{
      const dark=document.documentElement.dataset.theme!=='dark'; document.documentElement.dataset.theme=dark?'dark':'light'; localStorage.setItem('ns-theme',dark?'dark':'light');
    });
    document.querySelector('[data-rtl]')?.addEventListener('click',()=>{
      const rtl=document.documentElement.dir!=='rtl'; document.documentElement.dir=rtl?'rtl':'ltr'; localStorage.setItem('ns-rtl',rtl);
    });
    const cp=document.querySelector('[data-contact-toggle]'), pop=document.querySelector('[data-contact-pop]');
    cp?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const open=!(pop?.classList.contains('open'));pop?.classList.toggle('open',open);cp?.setAttribute('aria-expanded',String(open));});
    document.addEventListener('click',e=>{if(pop&&!pop.contains(e.target)&&e.target!==cp){pop.classList.remove('open');cp?.setAttribute('aria-expanded','false')}});
  },
  bindReveal(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(x=>io.observe(x))},
  bindBackTop(){const b=document.querySelector('.backtop');window.addEventListener('scroll',()=>b?.classList.toggle('show',scrollY>500));b?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}))},
  async loadData(){
    this.products=[...this.productFallback];
    this.renderProducts();
    try{const p=await fetch('data/products.json');const fresh=await p.json();if(Array.isArray(fresh)&&fresh.length){this.products=fresh;this.renderProducts()}}catch(e){}
    try{const i=await fetch('data/industries.json');this.industries=await i.json()}catch(e){}
    this.bindCategoryRail();
  },
  bindCategoryRail(){
    document.querySelectorAll('[data-category-jump]').forEach(btn=>btn.addEventListener('click',()=>{
      document.querySelectorAll('[data-category-jump]').forEach(x=>x.classList.remove('active'));
      btn.classList.add('active');
      const value=btn.dataset.categoryJump;
      const filter=document.querySelector(`[data-filter-group="product"] .filter[data-filter="${value}"]`);
      if(value==='all'){this.renderProducts(this.products);document.querySelectorAll('[data-filter-group="product"] .filter').forEach(x=>x.classList.remove('active'));document.querySelector('[data-filter-group="product"] .filter[data-filter="all"]')?.classList.add('active')}
      else if(filter){filter.click()}
      document.querySelector('[data-product-grid]')?.scrollIntoView({behavior:'smooth',block:'start'});
    }));
  },
  renderProducts(list=this.products){
    const host=document.querySelector('[data-product-grid]'); if(!host||!list.length)return;
    host.innerHTML=list.map((p,i)=>`<article class="product-card reveal" data-industry="${p.industry}" data-category="${p.category}">
      <div class="photo"><img src="${p.image}" alt="${p.name}" loading="${i<3?'eager':'lazy'}"></div>
      <div class="product-info"><span class="tag">${p.category}</span><h3>${p.name}</h3><p class="muted">${p.desc}</p>
      <div class="product-meta"><span>${p.industry} · ${p.colors}</span><button class="btn secondary quickview" data-product="${i}" type="button">Quick view</button></div></div></article>`).join('');
    host.querySelectorAll('.quickview').forEach(b=>b.addEventListener('click',()=>this.openProduct(Number(b.dataset.product))));
    this.bindReveal();
  },
  bindFilters(){
    document.querySelectorAll('[data-filter-group]').forEach(group=>{
      group.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{
        group.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
        const value=btn.dataset.filter, type=group.dataset.filterGroup;
        if(type==='product'&&this.products.length)this.renderProducts(value==='all'?this.products:this.products.filter(p=>p.category===value||p.industry===value));
        document.querySelectorAll('[data-filter-target]').forEach(x=>{x.hidden=value!=='all'&&!((x.dataset.industry||'').includes(value))});
      }))
    })
  },
  openProduct(i){const p=this.products[i]; if(!p)return; const m=document.querySelector('[data-modal]'); if(!m)return;
    m.querySelector('.modal-body').innerHTML=`<div class="grid2"><div class="image landscape"><img src="${p.image}" alt="${p.name}"></div><div><span class="tag">${p.category}</span><h2>${p.name}</h2><p>${p.desc}</p><p class="muted">${p.industry} · ${p.colors} · Embroidery ready</p><a class="btn" href="quote.html?product=${encodeURIComponent(p.name)}">Request a quote</a></div></div>`;
    m.classList.add('open');m.setAttribute('aria-hidden','false');
  },
  bindModal(){document.querySelectorAll('[data-modal-close]').forEach(x=>x.addEventListener('click',()=>document.querySelector('[data-modal]')?.classList.remove('open')));document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelector('[data-modal]')?.classList.remove('open')})},
  bindQuote(){
    const form=document.querySelector('[data-quote-form]');if(!form)return;
    const out=document.querySelector('[data-quote-summary]');
    const update=()=>{const qty=Number(form.querySelector('[name=quantity]')?.value||25), garment=form.querySelector('[name=garment]')?.value||'Select garment', emb=form.querySelector('[name=embroidery]:checked')?.value||'No', place=form.querySelector('[name=placement]:checked')?.value||'—';
      const base=qty*18, embroidery=emb==='Yes'?qty*4:0;out.innerHTML=`<div class="summary-line"><span>Garment</span><strong>${garment}</strong></div><div class="summary-line"><span>Quantity</span><strong>${qty}</strong></div><div class="summary-line"><span>Embroidery</span><strong>${emb}</strong></div><div class="summary-line"><span>Placement</span><strong>${place}</strong></div><div class="summary-line"><span>Illustrative budget</span><strong>$${(base+embroidery).toLocaleString()}</strong></div><p class="muted" style="font-size:12px;margin-top:18px">Illustrative frontend estimate only. Final pricing is confirmed after artwork, garment and order review.</p>`};
    form.addEventListener('input',update);form.addEventListener('change',update);update();
  },
  bindForms(){document.querySelectorAll('form:not([data-quote-form])').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();if(!f.checkValidity()){f.reportValidity();return}this.toast('Thanks — your enquiry has been prepared for review. This demo does not send data to a server.');f.reset()}))},
  bindFAQ(){},
  toast(msg){const t=document.querySelector('.toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(this.tt);this.tt=setTimeout(()=>t.classList.remove('show'),3200)}
};
document.addEventListener('DOMContentLoaded',()=>NS.init());
