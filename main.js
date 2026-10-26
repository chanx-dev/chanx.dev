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

// The hero's one motion: each language sends its message down the rail, and all three
// arrive as the same frame. Replays while the rail is on screen.
const rail = document.querySelector(".rail");
if (rail && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const wire = rail.querySelector(".stop.wire");
  const packets = ["py", "ts", "go"].map((lang) => ({
    el: rail.querySelector(`.packet.${lang}`),
    stop: rail.querySelector(`.stop.${lang}`),
  }));
  // Top of a 14px dot centred on a stop's marker, which sits 11px below the stop's top.
  const dotTop = (stop) =>
    stop.getBoundingClientRect().top - rail.getBoundingClientRect().top + 11 - 7;

  let visible = false;
  let playing = false;
  let timer = 0;

  const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // One message at a time: each dot runs the rail at the same speed and lands in the
  // wire frame before the next one leaves.
  async function play() {
    if (playing) return;
    playing = true;
    const to = dotTop(wire);
    for (const { el, stop } of packets) {
      if (!visible) break;
      const from = dotTop(stop);
      await el.animate(
        [
          { transform: `translateY(${from}px) scale(1)`, opacity: 1 },
          { transform: `translateY(${to}px) scale(1)`, opacity: 1, offset: 0.9 },
          { transform: `translateY(${to}px) scale(0.3)`, opacity: 0 },
        ],
        { duration: 300 + (to - from) * 1.6, easing: "cubic-bezier(0.45, 0, 0.3, 1)" },
      ).finished;
      wire.classList.add("arrived");
      await pause(260);
      wire.classList.remove("arrived");
      await pause(200);
    }
    playing = false;
    timer = setTimeout(() => visible && play(), 3200);
  }

  new IntersectionObserver(([entry]) => {
    const wasVisible = visible;
    visible = entry.isIntersecting;
    if (visible && !wasVisible) {
      clearTimeout(timer);
      timer = setTimeout(play, 500);
    }
  }).observe(rail);
}
