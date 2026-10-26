// Copy an install command.
for (const button of document.querySelectorAll(".cmd")) {
  button.addEventListener("click", async () => {
    const status = button.querySelector(".copied");
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      status.textContent = "Copied";
    } catch {
      status.textContent = "Select and copy";
    }
    setTimeout(() => (status.textContent = ""), 1800);
  });
}

// Demo tabs: one video, swapped per language.
const tabs = [...document.querySelectorAll('[role="tab"]')];
const panel = document.getElementById("demo-panel");
const video = document.getElementById("demo-video");

function select(tab) {
  for (const t of tabs) {
    const on = t === tab;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
  }
  panel.setAttribute("aria-labelledby", tab.id);
  const name = tab.dataset.demo;
  video.poster = `/assets/demo/${name}.jpg`;
  video.src = `/assets/demo/${name}.mp4`;
}

tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => select(tab));
  tab.addEventListener("keydown", (event) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    const next = tabs[(i + step + tabs.length) % tabs.length];
    select(next);
    next.focus();
  });
});

// The hero responds to the reader: point at (or tab to) a language, and its message runs
// down the rail and lands as the frame on the wire. Nothing moves on its own.
const rail = document.querySelector(".rail");
if (rail && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const wire = rail.querySelector(".stop.wire");
  // Top of a 14px dot centred on a stop's marker, which sits 11px below the stop's top.
  const dotTop = (stop) =>
    stop.getBoundingClientRect().top - rail.getBoundingClientRect().top + 11 - 7;
  let current = null;
  let glow = 0;

  function send(lang) {
    const stop = rail.querySelector(`.stop.${lang}`);
    const packet = rail.querySelector(`.packet.${lang}`);
    current?.cancel();
    clearTimeout(glow);
    wire.classList.remove("arrived");
    const from = dotTop(stop);
    const to = dotTop(wire);
    current = packet.animate(
      [
        { transform: `translateY(${from}px) scale(1)`, opacity: 1 },
        { transform: `translateY(${to}px) scale(1)`, opacity: 1, offset: 0.9 },
        { transform: `translateY(${to}px) scale(0.3)`, opacity: 0 },
      ],
      { duration: 300 + (to - from) * 1.6, easing: "cubic-bezier(0.45, 0, 0.3, 1)" },
    );
    current.finished
      .then(() => {
        wire.classList.add("arrived");
        glow = setTimeout(() => wire.classList.remove("arrived"), 450);
      })
      .catch(() => {}); // cancelled by the next language
  }

  for (const lang of ["py", "ts", "go"]) {
    const stop = rail.querySelector(`.stop.${lang}`);
    stop.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse") send(lang);
    });
    stop.addEventListener("focusin", () => send(lang));
  }
}
