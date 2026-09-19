(() => {
  "use strict";

  const START_DATE = new Date(2024, 2, 20);
  const UNLOCK_KEY = "thinthin_story_unlocked_at";
  const UNLOCK_DURATION = 15 * 60 * 1000;
  const counter = document.getElementById("runtime_span");
  const music = document.getElementById("bg-music");
  const musicToggle = document.getElementById("music-toggle");

  function updateRuntime() {
    if (!counter) return;

    const now = new Date();
    const current = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let years = current.getFullYear() - START_DATE.getFullYear();
    let anchor = new Date(START_DATE.getFullYear() + years, START_DATE.getMonth(), START_DATE.getDate());
    if (anchor > current) {
      years--;
      anchor = new Date(START_DATE.getFullYear() + years, START_DATE.getMonth(), START_DATE.getDate());
    }

    let months = current.getMonth() - anchor.getMonth();
    if (months < 0) months += 12;

    let monthAnchor = new Date(anchor.getFullYear(), anchor.getMonth() + months, anchor.getDate());
    if (monthAnchor > current) {
      months--;
      monthAnchor = new Date(anchor.getFullYear(), anchor.getMonth() + months, anchor.getDate());
    }

    const days = Math.floor((current - monthAnchor) / 86400000);
    const yearLabel = years === 1 ? "Year" : "Years";
    const monthLabel = months === 1 ? "Month" : "Months";
    const dayLabel = days === 1 ? "Day" : "Days";

    counter.textContent = `We're In Love · ${years} ${yearLabel} · ${months} ${monthLabel} · ${days} ${dayLabel}`;
  }

  function setMusicState(isPlaying) {
    if (!musicToggle) return;
    musicToggle.classList.toggle("playing", isPlaying);
    musicToggle.setAttribute("aria-pressed", String(isPlaying));
    musicToggle.setAttribute("aria-label", isPlaying ? "Pause music" : "Play music");
    const label = musicToggle.querySelector(".music-label");
    if (label) label.textContent = isPlaying ? "Playing" : "Music";
  }

  if (music && musicToggle) {
    musicToggle.addEventListener("click", async () => {
      try {
        if (music.paused) {
          await music.play();
          setMusicState(true);
        } else {
          music.pause();
          setMusicState(false);
        }
      } catch (error) {
        setMusicState(false);
      }
    });

    music.addEventListener("play", () => setMusicState(true));
    music.addEventListener("pause", () => setMusicState(false));
  }

  // Before opening any internal story page, refresh the shared unlock timestamp
  // in both storage buckets. This prevents a navigation flash/redirect when
  // one storage bucket is temporarily unavailable or contains an older value.
  function syncUnlockBeforeNavigate() {
    try {
      if (!document.documentElement.classList.contains("story-unlocked")) return;
      const raw = localStorage.getItem(UNLOCK_KEY) || sessionStorage.getItem(UNLOCK_KEY);
      const t = Number(raw);
      if (!Number.isFinite(t) || t <= 0 || (Date.now() - t) >= UNLOCK_DURATION) return;
      const now = String(t);
      localStorage.setItem(UNLOCK_KEY, now);
      sessionStorage.setItem(UNLOCK_KEY, now);
      sessionStorage.setItem("thinthin_story_unlocked", "2024-03-20");
    } catch (error) {
      try {
        const t = Number(sessionStorage.getItem(UNLOCK_KEY));
        if (Number.isFinite(t) && t > 0 && (Date.now() - t) < UNLOCK_DURATION) {
          sessionStorage.setItem("thinthin_story_unlocked", "2024-03-20");
        }
      } catch (_) {}
    }
  }

  document.querySelectorAll('a[href="./message/index.html"], a[href="./Love/love.html"], a[href="./heartbeat/index.html"]').forEach(link => {
    link.addEventListener("click", syncUnlockBeforeNavigate, {capture: true});
  });

  const intro = document.getElementById("love-intro");
  const enterLove = document.getElementById("enter-love");

  const storyGate = document.getElementById("story-date-gate");
  const storyDateInput = document.getElementById("story-date-input");
  const storyDateSubmit = document.getElementById("story-date-submit");
  const storyDateBack = document.getElementById("story-date-back");
  const storyDateError = document.getElementById("story-date-error");

  function closeStoryGate() {
    if (!storyGate) return;
    storyGate.classList.remove("is-open");
    storyGate.setAttribute("aria-hidden", "true");
    if (storyDateError) storyDateError.textContent = "";
  }

  function openStory() {
    intro.classList.add("is-hidden");
    document.body.classList.remove("intro-locked");
    window.setTimeout(() => intro.remove(), 700);
  }

  function hasValidUnlock() {
    try {
      const raw = localStorage.getItem(UNLOCK_KEY) || sessionStorage.getItem(UNLOCK_KEY);
      const t = Number(raw);
      if (Number.isFinite(t) && t > 0 && (Date.now() - t) < UNLOCK_DURATION) {
        try {
          localStorage.setItem(UNLOCK_KEY, String(t));
          sessionStorage.setItem(UNLOCK_KEY, String(t));
        } catch (_) {}
        return true;
      }
      localStorage.removeItem(UNLOCK_KEY);
      sessionStorage.removeItem(UNLOCK_KEY);
    } catch (error) {
      try {
        const t = Number(sessionStorage.getItem(UNLOCK_KEY));
        return Number.isFinite(t) && t > 0 && (Date.now() - t) < UNLOCK_DURATION;
      } catch (_) { return false; }
    }
    return false;
  }

  if (intro && enterLove && storyGate) {
    if (hasValidUnlock()) openStory();
    enterLove.addEventListener("click", () => {
      storyGate.classList.add("is-open");
      storyGate.setAttribute("aria-hidden", "false");
      window.setTimeout(() => storyDateInput?.focus(), 180);
    });

    storyDateBack?.addEventListener("click", closeStoryGate);

    storyDateSubmit?.addEventListener("click", () => {
      const rawValue = (storyDateInput?.value || "").trim();
      const value = rawValue.replace(/\s+/g, "").replace(/\//g, "-").replace(/\./g, "-");
      if (value !== "2024-03-20") {
        if (storyDateError) storyDateError.textContent = "That date is not quite our beginning. Try again, my love. ♡";
        storyDateInput?.classList.add("has-error");
        return;
      }
      storyDateInput.classList.remove("has-error");
      try {
        const now = String(Date.now());
        localStorage.setItem("thinthin_story_unlocked_at", now);
        sessionStorage.setItem("thinthin_story_unlocked_at", now);
        sessionStorage.setItem("thinthin_story_unlocked", "2024-03-20");
      } catch (error) {}
      closeStoryGate();
      openStory();
    });

    storyDateInput?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") storyDateSubmit?.click();
      if (event.key === "Escape") closeStoryGate();
    });
  }

  updateRuntime();
  window.setInterval(updateRuntime, 60000);
})();
