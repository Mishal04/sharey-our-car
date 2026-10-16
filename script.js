// Share Your Car - homepage behaviour (front-end demo only, no backend)
(() => {
  const $ = (s) => document.querySelector(s);

  // Sample data. All demonstration content; replace with real listings later.
  const cars = [
    { id: 1, name: "Compact Sedan", loc: "Downtown", price: 48, type: "Sedan", trans: "Automatic", seats: 5, fuel: "Petrol", color: "#c9ced4" },
    { id: 2, name: "Family SUV", loc: "Northside", price: 82, type: "SUV", trans: "Automatic", seats: 7, fuel: "Hybrid", color: "#2f3a45" },
    { id: 3, name: "City Hatchback", loc: "Riverside", price: 39, type: "Hatchback", trans: "Manual", seats: 4, fuel: "Petrol", color: "#4f86a8" },
    { id: 4, name: "Mid-size Sedan", loc: "Airport area", price: 59, type: "Sedan", trans: "Automatic", seats: 5, fuel: "Petrol", color: "#8a2f2f" },
    { id: 5, name: "Cargo Van", loc: "Eastside", price: 95, type: "Van", trans: "Manual", seats: 3, fuel: "Diesel", color: "#e7e3da" },
    { id: 6, name: "Compact SUV", loc: "Old Town", price: 68, type: "SUV", trans: "Automatic", seats: 5, fuel: "Petrol", color: "#d9a43a" }
  ];
  const plans = {
    hour: { label: "Hourly", unit: "/hr", rate: (p) => Math.ceil(p / 8) },
    day: { label: "Daily", unit: "/day", rate: (p) => p },
    month: { label: "Monthly", unit: "/month", rate: (p) => p * 22 }
  };
  let selected = cars[0], plan = "day";
  const saved = new Set();

  // Toast
  const toast = $("#toast"); let timer;
  const say = (t) => { toast.textContent = t; toast.classList.add("show"); clearTimeout(timer); timer = setTimeout(() => toast.classList.remove("show"), 3200); };
  document.querySelectorAll("[data-demo]").forEach((el) => el.addEventListener("click", (e) => { e.preventDefault(); say(el.dataset.demo); closeMenu(); }));

  // Mobile menu
  const btn = $("#menu-btn"), nav = $("#nav");
  function closeMenu() { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.textContent = "Menu"; }
  btn.addEventListener("click", () => { const o = nav.classList.toggle("open"); btn.setAttribute("aria-expanded", String(o)); btn.textContent = o ? "Close" : "Menu"; });
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeMenu(); closeSheet(); } });
  window.addEventListener("resize", () => { if (innerWidth > 820) closeMenu(); });

  // Simple vehicle illustration (replace with real photos)
  const art = (c) => `<svg viewBox="0 0 200 80" role="img" aria-label="Sample illustration of a ${c.name}">
    <path d="M8 58q0-14 20-18l26-4q14-20 46-20h22q22 4 34 22l26 4q10 4 10 16v6H8z" fill="${c.color}"/>
    <path d="M62 38q10-14 38-14h14q14 4 22 14z" fill="#fff" opacity=".55"/>
    <circle cx="48" cy="62" r="12" fill="#222"/><circle cx="48" cy="62" r="5" fill="#aaa"/>
    <circle cx="156" cy="62" r="12" fill="#222"/><circle cx="156" cy="62" r="5" fill="#aaa"/></svg>`;
  const ico = (d) => `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const heart = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z"/></svg>';

  // Listings
  const list = $("#car-list"), count = $("#count");
  const fType = $("#f-type"), fTrans = $("#f-trans"), fPrice = $("#f-price"), q = $("#q");
  let locQuery = "";
  function filtered() {
    const max = Number(fPrice.value) || Infinity, text = q.value.trim().toLowerCase();
    return cars.filter((c) => (!fType.value || c.type === fType.value) && (!fTrans.value || c.trans === fTrans.value) &&
      c.price <= max && (!text || (c.name + " " + c.type).toLowerCase().includes(text)));
  }
  function render() {
    const out = filtered();
    count.textContent = `${out.length} vehicle${out.length === 1 ? "" : "s"} for rent`;
    list.innerHTML = out.length ? out.map((c) => `
      <div class="car" role="button" tabindex="0" data-id="${c.id}" aria-pressed="${c.id === selected.id}">
        <div class="top"><div><h3>${c.name}</h3><span class="small muted">${c.loc} (demo)</span></div>
          <button class="heart" data-heart="${c.id}" aria-pressed="${saved.has(c.id)}" aria-label="Save ${c.name}">${heart}</button></div>
        <div class="art">${art(c)}</div>
        <div class="foot"><span>${ico('<circle cx="12" cy="7" r="3"/><path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"/>')}${c.seats} seats &middot; ${c.trans}</span><span class="price">$${c.price}<small class="muted" style="font-weight:400">/day</small></span></div>
      </div>`).join("") : '<div class="empty">No sample vehicles match. Try another type or a higher price.</div>';
  }
  [fType, fTrans, fPrice].forEach((f) => f.addEventListener("change", render));
  q.addEventListener("input", render);
  $("#clear").addEventListener("click", () => { fType.value = fTrans.value = fPrice.value = q.value = ""; render(); });

  // Detail panel
  const detail = $("#detail"), scrim = $("#scrim");
  function showDetail() {
    const c = selected, p = plans[plan];
    $("#d-art").innerHTML = art(c);
    $("#d-name").textContent = c.name;
    $("#d-rate").textContent = `$${p.rate(c.price)}${p.unit}`;
    $("#d-facts").innerHTML = [c.fuel, c.seats + " seats", c.trans, c.type].map((t) => `<span>${t}</span>`).join("");
    $("#d-plans").innerHTML = Object.entries(plans).map(([k, v]) =>
      `<button data-plan="${k}" aria-pressed="${k === plan}">${v.label}<small>$${v.rate(c.price)}${v.unit}</small></button>`).join("");
    $("#d-loc").textContent = `${c.loc} (demo location)`;
    $("#d-total").innerHTML = `$${p.rate(c.price)}<small style="font-size:.8rem;font-weight:400;color:#b9b5ad">${p.unit}</small>`;
  }
  function openSheet() { if (innerWidth <= 1180) { detail.classList.add("open"); scrim.classList.add("show"); } }
  function closeSheet() { detail.classList.remove("open"); scrim.classList.remove("show"); }
  $("#close").addEventListener("click", closeSheet); scrim.addEventListener("click", closeSheet);
  $("#d-plans").addEventListener("click", (e) => { const b = e.target.closest("[data-plan]"); if (b) { plan = b.dataset.plan; showDetail(); } });
  $("#book").addEventListener("click", () => say("Demo only: bookings and payments are not connected."));

  function pick(el) {
    selected = cars.find((c) => c.id === Number(el.dataset.id)); render(); showDetail(); openSheet();
  }
  list.addEventListener("click", (e) => {
    const h = e.target.closest("[data-heart]");
    if (h) { const id = Number(h.dataset.heart); saved.has(id) ? saved.delete(id) : saved.add(id); render(); say(saved.has(id) ? "Saved to favourites (demo)." : "Removed from favourites."); return; }
    const c = e.target.closest(".car"); if (c) pick(c);
  });
  list.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("car")) { e.preventDefault(); pick(e.target); } });

  // Search validation
  const msg = $("#search-msg"), today = new Date().toISOString().slice(0, 10);
  $("#pickup").min = today; $("#return").min = today;
  const show = (t, ok) => { msg.textContent = t; msg.className = "msg " + (ok ? "ok" : "err"); };
  $("#search").addEventListener("submit", (e) => {
    e.preventDefault();
    const loc = $("#loc").value.trim(), p = $("#pickup").value, r = $("#return").value;
    if (!loc) return show("Enter a pickup location.", false);
    if (!p) return show("Choose a pickup date.", false);
    if (p < today) return show("Pickup date can't be in the past.", false);
    if (!r) return show("Choose a return date.", false);
    if (r <= p) return show("Return date must be after the pickup date.", false);
    locQuery = loc; render();
    show(`Demo search for ${loc}. These are sample listings with no live availability.`, true);
  });
  $("#pickup").addEventListener("change", (e) => { $("#return").min = e.target.value || today; });

  render(); showDetail();
})();