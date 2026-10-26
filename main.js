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

// The hero's one motion: a message leaves each language and arrives as the same frame.
const rail = document.querySelector(".rail");
if (rail && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const railTop = rail.getBoundingClientRect().top;
  const dotY = (stop) => stop.getBoundingClientRect().top - railTop + 5;
  const wire = rail.querySelector(".stop.wire");
  const to = dotY(wire) + 2;
  for (const lang of ["py", "ts", "go"]) {
    const packet = rail.querySelector(`.packet.${lang}`);
    packet.style.setProperty("--from", `${dotY(rail.querySelector(`.stop.${lang}`)) + 1}px`);
    packet.style.setProperty("--to", `${to}px`);
  }
  rail.querySelector(".packet.go").addEventListener("animationend", () => {
    wire.classList.add("arrived");
    setTimeout(() => wire.classList.remove("arrived"), 900);
  });
  requestAnimationFrame(() => rail.classList.add("run"));
}
