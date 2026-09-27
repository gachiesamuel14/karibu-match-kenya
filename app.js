const COUNTIES = [
  "Nairobi","Mombasa","Kisumu","Kiambu","Nakuru","Uasin Gishu","Machakos",
  "Kajiado","Kilifi","Meru","Kakamega","Kisii","Nyeri","Bungoma","Kitui"
];
const TRIBES = ["Kikuyu","Luo","Luhya","Kalenjin","Kamba","Kisii","Meru","Mijikenda","Somali","Maasai","Other"];
const RELIGIONS = ["Christian","Muslim","Other","Prefer not to say"];
const INTERESTS = ["Afrobeats","Gospel","Football","Hiking","Church","Gym","Tech","Farming","Fashion","Food","Travel","Poetry"];

const MOCK = [
  { id:"1", name:"Amina", age:26, county:"Mombasa", tribe:"Mijikenda", religion:"Muslim", km:7, bio:"Coast vibes, sunset walks on Nyali, and chai that slaps.", interests:["Travel","Food","Fashion"], photo:"https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80" },
  { id:"2", name:"Brian", age:29, county:"Nairobi", tribe:"Kikuyu", religion:"Christian", km:3, bio:"Product designer in Westlands. Weekend hikes in Ngong.", interests:["Hiking","Tech","Gym"], photo:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80" },
  { id:"3", name:"Faith", age:24, county:"Kiambu", tribe:"Kikuyu", religion:"Christian", km:12, bio:"Student by day, gospel playlist by night. Looking for kind energy.", interests:["Gospel","Church","Poetry"], photo:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80" },
  { id:"4", name:"Otieno", age:31, county:"Kisumu", tribe:"Luo", religion:"Christian", km:4, bio:"Lakeside sunsets and a ridiculous love for Gor Mahia banter.", interests:["Football","Food","Travel"], photo:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80" },
  { id:"5", name:"Wanjiku", age:27, county:"Nakuru", tribe:"Kikuyu", religion:"Christian", km:18, bio:"Nurse. Soft life advocate. Menengai views > club nights.", interests:["Hiking","Food","Fashion"], photo:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80" },
  { id:"6", name:"Hassan", age:28, county:"Nairobi", tribe:"Somali", religion:"Muslim", km:6, bio:"Eastleigh entrepreneur. Straight talk, good food, no games.", interests:["Gym","Food","Tech"], photo:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" },
  { id:"7", name:"Chep", age:25, county:"Uasin Gishu", tribe:"Kalenjin", religion:"Christian", km:9, bio:"I run. Then I eat ugali. Then I run again.", interests:["Gym","Hiking","Travel"], photo:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80" },
  { id:"8", name:"Mwende", age:23, county:"Machakos", tribe:"Kamba", religion:"Christian", km:15, bio:"Comedy shows, road trips to the coast, and late-night playlist debates.", interests:["Afrobeats","Travel","Poetry"], photo:"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80" }
];

const store = {
  get(k, fallback) {
    try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; }
  },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
};

const state = {
  view: "landing",
  tab: "discover",
  user: store.get("km_user", null),
  likes: store.get("km_likes", []),
  passes: store.get("km_passes", []),
  matches: store.get("km_matches", []),
  chats: store.get("km_chats", {}),
  filters: { county: "All", maxKm: 50, minAge: 21, maxAge: 40, religion: "All" },
  activeChat: null,
  sheet: null
};

function persist() {
  store.set("km_user", state.user);
  store.set("km_likes", state.likes);
  store.set("km_passes", state.passes);
  store.set("km_matches", state.matches);
  store.set("km_chats", state.chats);
}

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content;
}

function render() {
  const root = document.getElementById("app");
  if (!state.user && ["discover","matches","chat","profile"].includes(state.view)) state.view = "landing";
  root.replaceChildren(view());
}

function view() {
  if (state.view === "landing") return landing();
  if (state.view === "auth") return auth();
  if (state.view === "setup") return setup();
  return appShell();
}

function landing() {
  const node = el(`
    <div class="wrap">
      <header class="nav">
        <div class="brand"><div class="logo">K</div> Karibu Match</div>
        <div class="nav-actions">
          <button class="btn ghost" data-go="auth">Log in</button>
          <button class="btn primary" data-go="auth">Get started</button>
        </div>
      </header>
      <section class="hero">
        <div>
          <p class="kicker">Location-based matchmaking · Kenya</p>
          <h1>Meet someone closer than you think.</h1>
          <p class="lead">Swipe people in your county — Nairobi, Mombasa, Kisumu, Kiambu and beyond. Filter by distance, vibe, faith, and lifestyle.</p>
          <div class="hero-cta">
            <button class="btn primary" data-go="auth">Create your profile</button>
            <button class="btn" data-demo>Try the demo deck</button>
          </div>
          <div class="stats">
            <div><b>47</b> Counties</div>
            <div><b>GPS</b> Nearby first</div>
            <div><b>M-Pesa</b> Premium ready</div>
          </div>
        </div>
        <div class="phone">
          <div class="card-stack">
            <div class="demo-card" style="background-image:url('${MOCK[1].photo}'); transform:rotate(-4deg) translate(-8px,10px)"></div>
            <div class="demo-card" style="background-image:url('${MOCK[0].photo}')">
              <div class="meta">
                <h3>Amina, 26</h3>
                <p class="tiny">Mombasa · 7 km away</p>
                <div class="chip-row"><span class="chip">Travel</span><span class="chip">Food</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="grid-3">
          <article class="feature"><p class="kicker">01</p><h3>County + distance</h3><p class="muted">See who is actually around you — town, estate, or a short matatu ride away.</p></article>
          <article class="feature"><p class="kicker">02</p><h3>Kenyan filters</h3><p class="muted">Age, religion, interests, and optional tribe. Student, professional, or church mode later.</p></article>
          <article class="feature"><p class="kicker">03</p><h3>Safety first</h3><p class="muted">Report and block in one tap. Meet in public. This demo is not a live network of real users.</p></article>
        </div>
      </section>
    </div>
  `);
  node.querySelectorAll("[data-go]").forEach(b => b.onclick = () => { state.view = "auth"; render(); });
  node.querySelector("[data-demo]").onclick = () => {
    state.user = {
      name: "You", age: 27, county: "Nairobi", tribe: "Other", religion: "Christian",
      bio: "Demo profile — edit me in Profile.", interests: ["Travel","Food"], email: "demo@karibu.match"
    };
    persist();
    state.view = "app";
    state.tab = "discover";
    render();
  };
  return node;
}

function auth() {
  const node = el(`
    <div class="wrap">
      <header class="nav">
        <div class="brand"><div class="logo">K</div> Karibu Match</div>
        <button class="btn ghost" data-home>Home</button>
      </header>
      <div class="auth panel">
        <p class="kicker">Account</p>
        <h2 style="margin:8px 0 16px">Join the demo</h2>
        <p class="muted" style="margin-bottom:16px">Saved only in this browser. No real backend yet.</p>
        <div class="field"><label>Name</label><input id="name" placeholder="e.g. Sam" /></div>
        <div class="row-2">
          <div class="field"><label>Age</label><input id="age" type="number" min="18" value="25" /></div>
          <div class="field"><label>County</label>
            <select id="county">${COUNTIES.map(c=>`<option>${c}</option>`).join("")}</select>
          </div>
        </div>
        <div class="field"><label>Email</label><input id="email" type="email" placeholder="you@email.com" /></div>
        <button class="btn primary full" id="go">Continue to profile</button>
      </div>
    </div>
  `);
  node.querySelector("[data-home]").onclick = () => { state.view = "landing"; render(); };
  node.querySelector("#go").onclick = () => {
    const name = node.querySelector("#name").value.trim();
    const age = +node.querySelector("#age").value;
    const county = node.querySelector("#county").value;
    const email = node.querySelector("#email").value.trim();
    if (!name || age < 18) return alert("Enter a name and age 18+.");
    state.user = { name, age, county, email, tribe: "Other", religion: "Prefer not to say", bio: "", interests: [] };
    persist();
    state.view = "setup";
    render();
  };
  return node;
}

function setup() {
  const u = state.user;
  const node = el(`
    <div class="wrap">
      <header class="nav"><div class="brand"><div class="logo">K</div> Profile setup</div></header>
      <div class="auth panel">
        <div class="field"><label>Tribe (optional)</label>
          <select id="tribe">${TRIBES.map(t=>`<option ${t===u.tribe?"selected":""}>${t}</option>`).join("")}</select>
        </div>
        <div class="field"><label>Religion</label>
          <select id="religion">${RELIGIONS.map(t=>`<option ${t===u.religion?"selected":""}>${t}</option>`).join("")}</select>
        </div>
        <div class="field"><label>Bio</label><textarea id="bio" rows="3" placeholder="A little about you…">${u.bio||""}</textarea></div>
        <div class="field"><label>Interests</label>
          <div class="chip-row" id="ints">
            ${INTERESTS.map(i=>`<button type="button" class="chip ${u.interests?.includes(i)?"primary":""}" data-i="${i}">${i}</button>`).join("")}
          </div>
        </div>
        <button class="btn primary full" id="save">Enter Karibu</button>
      </div>
    </div>
  `);
  const selected = new Set(u.interests || []);
  node.querySelectorAll("[data-i]").forEach(b => b.onclick = () => {
    const i = b.dataset.i;
    selected.has(i) ? selected.delete(i) : selected.add(i);
    b.style.background = selected.has(i) ? "linear-gradient(135deg,#e8a54b,#d4842e)" : "";
    b.style.color = selected.has(i) ? "#2a1608" : "";
  });
  node.querySelector("#save").onclick = () => {
    state.user = {
      ...u,
      tribe: node.querySelector("#tribe").value,
      religion: node.querySelector("#religion").value,
      bio: node.querySelector("#bio").value,
      interests: [...selected]
    };
    persist();
    state.view = "app";
    state.tab = "discover";
    render();
  };
  return node;
}

function appShell() {
  const node = el(`
    <div class="app-shell">
      <header class="topbar">
        <div class="brand"><div class="logo">K</div> Karibu</div>
        <div>
          <button class="btn" id="filt">Filters</button>
          <button class="btn ghost" id="out">Log out</button>
        </div>
      </header>
      <main id="main"></main>
      <nav class="tabbar">
        <button class="tab ${state.tab==="discover"?"active":""}" data-t="discover">Discover</button>
        <button class="tab ${state.tab==="matches"?"active":""}" data-t="matches">Matches</button>
        <button class="tab ${state.tab==="chat"?"active":""}" data-t="chat">Chat</button>
        <button class="tab ${state.tab==="profile"?"active":""}" data-t="profile">Profile</button>
      </nav>
    </div>
  `);
  node.querySelector("#main").replaceChildren(tabView());
  node.querySelectorAll("[data-t]").forEach(b => b.onclick = () => { state.tab = b.dataset.t; state.activeChat = state.tab==="chat" ? state.activeChat : null; render(); });
  node.querySelector("#out").onclick = () => { if (confirm("Log out of this demo?")) { state.user = null; persist(); state.view = "landing"; render(); } };
  node.querySelector("#filt").onclick = () => { state.sheet = "filters"; render(); };
  if (state.sheet === "filters") node.append(filtersSheet());
  if (state.sheet === "report") node.append(reportSheet());
  if (state.sheet === "premium") node.append(premiumSheet());
  return node;
}

function filteredDeck() {
  const f = state.filters;
  const seen = new Set([...state.likes, ...state.passes]);
  return MOCK.filter(p => {
    if (seen.has(p.id)) return false;
    if (f.county !== "All" && p.county !== f.county) return false;
    if (p.km > f.maxKm) return false;
    if (p.age < f.minAge || p.age > f.maxAge) return false;
    if (f.religion !== "All" && p.religion !== f.religion) return false;
    return true;
  });
}

function tabView() {
  if (state.tab === "discover") return discover();
  if (state.tab === "matches") return matches();
  if (state.tab === "chat") return chat();
  return profile();
}

function discover() {
  const deck = filteredDeck();
  const top = deck[0];
  if (!top) {
    return el(`<div class="empty"><h2>That's the deck</h2><p>Adjust filters or reset likes from Profile.</p></div>`);
  }
  const node = el(`
    <div class="discover">
      <div class="filters">
        <span class="filter-pill">${state.filters.county}</span>
        <span class="filter-pill">≤ ${state.filters.maxKm} km</span>
        <span class="filter-pill">${state.filters.minAge}–${state.filters.maxAge}</span>
      </div>
      <div class="stack">
        <article class="person">
          <div class="photo" style="background-image:url('${top.photo}')"></div>
          <div class="info">
            <h2>${top.name}, ${top.age}</h2>
            <p class="tiny">${top.county} · ${top.km} km · ${top.religion}</p>
            <p style="margin-top:8px">${top.bio}</p>
            <div class="chip-row">${top.interests.map(i=>`<span class="chip">${i}</span>`).join("")}</div>
          </div>
        </article>
      </div>
      <div class="actions">
        <button class="round no" id="no">✕</button>
        <button class="btn danger" id="rep">Report</button>
        <button class="round yes" id="yes">♥</button>
      </div>
    </div>
  `);
  node.querySelector("#no").onclick = () => { state.passes.push(top.id); persist(); render(); };
  node.querySelector("#yes").onclick = () => {
    state.likes.push(top.id);
    if (!state.matches.includes(top.id)) {
      state.matches.push(top.id);
      state.chats[top.id] = state.chats[top.id] || [
        { me: false, text: `Sasa ${state.user.name.split(" ")[0]} 👋 from ${top.county}.` }
      ];
    }
    persist();
    render();
  };
  node.querySelector("#rep").onclick = () => { state.sheet = "report"; state.reportId = top.id; render(); };
  return node;
}

function matches() {
  const people = MOCK.filter(p => state.matches.includes(p.id));
  if (!people.length) return el(`<div class="empty"><h2>No matches yet</h2><p>Like someone on Discover.</p></div>`);
  const node = el(`<div class="list">${people.map(p => `
    <button class="match-row" data-id="${p.id}">
      <img class="avatar" src="${p.photo}" alt="" />
      <div class="grow"><strong>${p.name}</strong><div class="tiny">${p.county} · ${p.km} km</div></div>
      <span class="tiny">Chat →</span>
    </button>`).join("")}</div>`);
  node.querySelectorAll("[data-id]").forEach(b => b.onclick = () => { state.tab = "chat"; state.activeChat = b.dataset.id; render(); });
  return node;
}

function chat() {
  if (!state.activeChat) {
    const people = MOCK.filter(p => state.matches.includes(p.id));
    if (!people.length) return el(`<div class="empty"><h2>No chats</h2><p>Match first, then talk.</p></div>`);
    const node = el(`<div class="list">${people.map(p => `
      <button class="chat-row" data-id="${p.id}">
        <img class="avatar" src="${p.photo}" alt="" />
        <div class="grow"><strong>${p.name}</strong><div class="tiny">${(state.chats[p.id]||[]).slice(-1)[0]?.text || "Say hi"}</div></div>
      </button>`).join("")}</div>`);
    node.querySelectorAll("[data-id]").forEach(b => b.onclick = () => { state.activeChat = b.dataset.id; render(); });
    return node;
  }
  const p = MOCK.find(x => x.id === state.activeChat);
  const msgs = state.chats[p.id] || [];
  const node = el(`
    <div class="chat-screen">
      <header class="topbar" style="border:0">
        <button class="btn ghost" id="back">←</button>
        <strong>${p.name}</strong>
        <span class="tiny">${p.county}</span>
      </header>
      <div class="bubbles" id="bubbles">
        ${msgs.map(m => `<div class="bubble ${m.me?"me":""}">${m.text}</div>`).join("")}
      </div>
      <form class="composer" id="form">
        <input name="text" placeholder="Write a message…" autocomplete="off" />
        <button class="btn primary" type="submit">Send</button>
      </form>
    </div>
  `);
  node.querySelector("#back").onclick = () => { state.activeChat = null; render(); };
  node.querySelector("#form").onsubmit = (e) => {
    e.preventDefault();
    const text = e.target.text.value.trim();
    if (!text) return;
    state.chats[p.id] = [...msgs, { me: true, text }];
    persist();
    render();
    setTimeout(() => {
      const replies = ["Poa 😊", "Unasema aje?", "Tuko same side of town.", "Let's grab chai sometime."];
      state.chats[p.id].push({ me: false, text: replies[Math.floor(Math.random()*replies.length)] });
      persist();
      render();
    }, 700);
  };
  return node;
}

function profile() {
  const u = state.user;
  const node = el(`
    <div class="list">
      <div class="panel">
        <h2>${u.name}, ${u.age}</h2>
        <p class="tiny">${u.county} · ${u.tribe} · ${u.religion}</p>
        <p style="margin-top:10px">${u.bio || "No bio yet."}</p>
        <div class="chip-row" style="margin-top:10px">${(u.interests||[]).map(i=>`<span class="chip">${i}</span>`).join("") || "<span class='tiny'>No interests tagged</span>"}</div>
      </div>
      <button class="btn" id="edit">Edit profile</button>
      <button class="btn primary" id="prem">Go Premium · M-Pesa</button>
      <button class="btn" id="reset">Reset likes & matches</button>
      <p class="tiny">This is a frontend demo. Real GPS, photo uploads, and live chat need a backend (Supabase / Firebase / Node).</p>
    </div>
  `);
  node.querySelector("#edit").onclick = () => { state.view = "setup"; render(); };
  node.querySelector("#prem").onclick = () => { state.sheet = "premium"; render(); };
  node.querySelector("#reset").onclick = () => {
    state.likes = []; state.passes = []; state.matches = []; state.chats = {}; persist(); render();
  };
  return node;
}

function filtersSheet() {
  const f = state.filters;
  const node = el(`
    <div class="modal-bg"><div class="sheet">
      <h3>Filters</h3>
      <div class="field"><label>County</label>
        <select id="fc"><option>All</option>${COUNTIES.map(c=>`<option ${c===f.county?"selected":""}>${c}</option>`).join("")}</select>
      </div>
      <div class="row-2">
        <div class="field"><label>Max km</label><input id="fk" type="number" value="${f.maxKm}" /></div>
        <div class="field"><label>Religion</label>
          <select id="fr"><option>All</option>${RELIGIONS.map(r=>`<option ${r===f.religion?"selected":""}>${r}</option>`).join("")}</select>
        </div>
      </div>
      <div class="row-2">
        <div class="field"><label>Min age</label><input id="fmin" type="number" value="${f.minAge}" /></div>
        <div class="field"><label>Max age</label><input id="fmax" type="number" value="${f.maxAge}" /></div>
      </div>
      <button class="btn primary full" id="apply">Apply</button>
      <button class="btn full" id="close" style="margin-top:8px">Close</button>
    </div></div>
  `);
  node.querySelector("#close").onclick = () => { state.sheet = null; render(); };
  node.querySelector("#apply").onclick = () => {
    state.filters = {
      county: node.querySelector("#fc").value,
      maxKm: +node.querySelector("#fk").value || 50,
      religion: node.querySelector("#fr").value,
      minAge: +node.querySelector("#fmin").value || 18,
      maxAge: +node.querySelector("#fmax").value || 99
    };
    state.sheet = null;
    render();
  };
  return node;
}

function reportSheet() {
  const node = el(`
    <div class="modal-bg"><div class="sheet">
      <h3>Report this profile</h3>
      <p class="muted" style="margin:8px 0 14px">Fake photos, harassment, underage, or scam? We’ll hide them from your deck.</p>
      <button class="btn danger full" id="do">Hide & report</button>
      <button class="btn full" id="close" style="margin-top:8px">Cancel</button>
    </div></div>
  `);
  node.querySelector("#close").onclick = () => { state.sheet = null; render(); };
  node.querySelector("#do").onclick = () => {
    if (state.reportId) state.passes.push(state.reportId);
    persist();
    state.sheet = null;
    render();
  };
  return node;
}

function premiumSheet() {
  const node = el(`
    <div class="modal-bg"><div class="sheet">
      <h3>Karibu Gold</h3>
      <p class="muted" style="margin:8px 0 14px">See who liked you, rewind last swipe, and boost in your county. Pay with M-Pesa (Daraja) when you add a backend.</p>
      <p><strong>KSh 499 / month</strong> · demo only</p>
      <button class="btn primary full" id="close" style="margin-top:12px">Got it</button>
    </div></div>
  `);
  node.querySelector("#close").onclick = () => { state.sheet = null; render(); };
  return node;
}

state.view = state.user ? "app" : "landing";
render();
