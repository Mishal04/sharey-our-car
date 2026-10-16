// Share Your Car - host dashboard behaviour (front-end demo only)
(() => {
  const $ = (s) => document.querySelector(s);
  const all = (s) => document.querySelectorAll(s);

  const toast = $("#toast");
  let timer;
  const say = (t) => {
    toast.textContent = t; toast.classList.add("show");
    clearTimeout(timer); timer = setTimeout(() => toast.classList.remove("show"), 3200);
  };
  all("[data-demo]").forEach((el) =>
    el.addEventListener("click", (e) => { e.preventDefault(); say(el.dataset.demo); }));

  // Panel navigation (supports #insurance style links)
  const btns = all(".side button"), panels = all(".panel");
  function open(id) {
    if (!$("#" + id) || !$("#" + id).classList.contains("panel")) id = "overview";
    panels.forEach((p) => (p.hidden = p.id !== id));
    btns.forEach((b) => b.setAttribute("aria-current", String(b.dataset.panel === id)));
    history.replaceState(null, "", "#" + id);
  }
  btns.forEach((b) => b.addEventListener("click", () => open(b.dataset.panel)));
  open(location.hash.slice(1) || "overview");
  window.addEventListener("hashchange", () => open(location.hash.slice(1)));

  // Vehicle filter tabs
  all("[data-vf]").forEach((t) => t.addEventListener("click", () => {
    all("[data-vf]").forEach((x) => x.setAttribute("aria-pressed", String(x === t)));
    all("#vtable tbody tr").forEach((r) => (r.hidden = t.dataset.vf !== "all" && r.dataset.s !== t.dataset.vf));
  }));

  // Sample document selection (no upload happens)
  $("#doc").addEventListener("change", (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { e.target.value = ""; return say("File is larger than 5 MB. Choose a smaller file."); }
    $("#doc-name").textContent = f.name;
    const b = $("#doc-badge"); b.textContent = "Pending review (demo)"; b.className = "badge pending";
    say("File selected in your browser. Nothing was uploaded.");
  });
})();