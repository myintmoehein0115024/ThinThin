(() => {
  "use strict";
  const INSTALL_STYLE_ID = "thinthin-pwa-install-style";
  const BUTTON_ID = "thinthin-pwa-install";
  const DIALOG_ID = "thinthin-pwa-install-dialog";
  let deferredPrompt = null;

  const isStandalone = () =>
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.matchMedia?.("(display-mode: fullscreen)").matches ||
    window.navigator.standalone === true;

  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  const isSafari = () => {
    const ua = navigator.userAgent;
    return /Safari/i.test(ua) && !/CriOS|Chrome|Android|Edg|OPR|FxiOS/i.test(ua);
  };

  const getPlatform = () => {
    if (isIOS()) return "ios";
    if (isSafari()) return "safari";
    if (/Android/i.test(navigator.userAgent)) return "android";
    if (/Windows/i.test(navigator.userAgent)) return "windows";
    if (/Macintosh|Mac OS X/i.test(navigator.userAgent)) return "mac";
    return "other";
  };

  function injectStyles() {
    if (document.getElementById(INSTALL_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = INSTALL_STYLE_ID;
    style.textContent = `
      #${BUTTON_ID}{
        position:fixed;right:max(16px,env(safe-area-inset-right));
        top:max(14px,env(safe-area-inset-top));z-index:2147483646;
        display:none;align-items:center;gap:8px;min-height:42px;
        padding:9px 14px;border:1px solid rgba(255,255,255,.92);border-radius:999px;
        background:rgba(255,255,255,.78);color:#765f80;
        font:700 12px/1 "Segoe UI",system-ui,sans-serif;letter-spacing:.02em;
        box-shadow:0 10px 28px rgba(99,75,130,.14),inset 0 1px 0 rgba(255,255,255,.98);
        backdrop-filter:blur(15px);-webkit-backdrop-filter:blur(15px);
        cursor:pointer;transition:transform .2s ease,box-shadow .2s ease,background .2s ease;
        -webkit-tap-highlight-color:transparent;
      }
      #${BUTTON_ID}:hover{transform:translateY(-2px);box-shadow:0 14px 32px rgba(99,75,130,.19);background:rgba(255,255,255,.90)}
      #${BUTTON_ID}:active{transform:scale(.98)}
      #${BUTTON_ID} .pwa-icon{display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:linear-gradient(145deg,#fff,#fceff8);color:#c17da9;font-size:15px}
      #${DIALOG_ID}{position:fixed;inset:0;z-index:2147483647;display:none;align-items:center;justify-content:center;padding:22px;background:rgba(43,31,52,.24);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
      #${DIALOG_ID}.show{display:flex}
      #${DIALOG_ID} .pwa-dialog-card{width:min(410px,calc(100vw - 28px));padding:26px 23px 21px;border-radius:26px;border:1px solid rgba(255,255,255,.9);background:linear-gradient(145deg,rgba(255,255,255,.97),rgba(250,245,255,.95));box-shadow:0 28px 80px rgba(55,38,70,.24);text-align:center;color:#67566f}
      #${DIALOG_ID} .pwa-dialog-heart{font:32px/1 Georgia,serif;color:#c17da9;margin-bottom:8px}
      #${DIALOG_ID} h2{margin:0 0 8px;font:700 21px/1.25 Georgia,"Times New Roman",serif;color:#655270}
      #${DIALOG_ID} p{margin:0 auto 13px;max-width:330px;font:13px/1.75 "Segoe UI",system-ui,sans-serif;color:#816f88}
      #${DIALOG_ID} .pwa-steps{margin:10px auto 18px;text-align:left;max-width:330px;padding:13px 15px;border-radius:17px;background:rgba(255,250,254,.72);border:1px solid rgba(195,126,170,.12)}
      #${DIALOG_ID} .pwa-steps div{margin:6px 0;font:600 12px/1.55 "Segoe UI",system-ui,sans-serif;color:#745f7b}
      #${DIALOG_ID} .pwa-close{min-height:44px;padding:10px 18px;border:1px solid rgba(195,126,170,.22);border-radius:999px;background:linear-gradient(135deg,#fff,#fff2f8);color:#7d607e;font:700 13px/1 "Segoe UI",system-ui,sans-serif;cursor:pointer}
      @media(max-width:600px){#${BUTTON_ID}{right:max(12px,env(safe-area-inset-right));top:max(11px,env(safe-area-inset-top));min-height:40px;padding:8px 11px;font-size:11px}#${BUTTON_ID} .pwa-label{display:none}}
      @media(min-width:601px) and (max-width:1024px){#${BUTTON_ID}{top:max(16px,env(safe-area-inset-top));right:max(18px,env(safe-area-inset-right))}}
      @media(prefers-reduced-motion:reduce){#${BUTTON_ID}{transition:none}}
    `;
    document.head.appendChild(style);
  }

  function buildUI() {
    if (document.getElementById(BUTTON_ID)) return;
    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.type = "button";
    button.innerHTML = '<span class="pwa-icon">♡</span><span class="pwa-label">Add to Home</span>';
    button.setAttribute("aria-label", "Add Always yours to your home screen or desktop");
    document.body.appendChild(button);

    const dialog = document.createElement("div");
    dialog.id = DIALOG_ID;
    dialog.innerHTML = `
      <div class="pwa-dialog-card" role="dialog" aria-modal="true" aria-labelledby="pwa-install-title">
        <div class="pwa-dialog-heart">♡</div>
        <h2 id="pwa-install-title">Keep our little world close</h2>
        <p class="pwa-dialog-copy"></p>
        <div class="pwa-steps"></div>
        <button class="pwa-close" type="button">Maybe later</button>
      </div>`;
    document.body.appendChild(dialog);

    dialog.querySelector(".pwa-close").addEventListener("click", () => dialog.classList.remove("show"));
    dialog.addEventListener("click", e => { if (e.target === dialog) dialog.classList.remove("show"); });

    button.addEventListener("click", async () => {
      if (deferredPrompt) {
        try {
          deferredPrompt.prompt();
          await deferredPrompt.userChoice;
        } catch (_) {}
        deferredPrompt = null;
        button.style.display = "none";
        return;
      }
      showHelp();
    });
    return button;
  }

  function showHelp() {
    const dialog = document.getElementById(DIALOG_ID);
    if (!dialog) return;
    const copy = dialog.querySelector(".pwa-dialog-copy");
    const steps = dialog.querySelector(".pwa-steps");
    const platform = getPlatform();
    if (platform === "ios") {
      copy.textContent = "On iPhone or iPad, save this private little story to your Home Screen from Safari.";
      steps.innerHTML = `<div>① Tap the Share button in Safari.</div><div>② Choose “Add to Home Screen”.</div><div>③ Tap “Add” and open it like an app. ♡</div>`;
    } else if (platform === "safari") {
      copy.textContent = "Safari can keep this story as a web app on your Mac.";
      steps.innerHTML = `<div>① Open the Safari menu.</div><div>② Choose “Add to Dock”.</div><div>③ Open “Always yours” from your Dock. ♡</div>`;
    } else if (platform === "android") {
      copy.textContent = "Use your browser’s install option to keep this story on your Home Screen.";
      steps.innerHTML = `<div>① Open the browser menu ⋮.</div><div>② Choose “Install app” or “Add to Home screen”.</div><div>③ Confirm the install. ♡</div>`;
    } else {
      copy.textContent = "Your browser can install this page as an app when it exposes the install option.";
      steps.innerHTML = `<div>① Open the browser menu or address-bar install icon.</div><div>② Choose “Install Always yours” / “Add to desktop”.</div><div>③ Confirm and open it like a private app. ♡</div>`;
    }
    dialog.classList.add("show");
  }

  async function registerSW() {
    if (!("serviceWorker" in navigator)) return;
    try {
      const manifest = document.querySelector('link[rel="manifest"]');
      const base = manifest ? new URL(manifest.href, document.baseURI) : new URL("./", document.baseURI);
      const swUrl = new URL("service-worker.js", base);
      const scope = new URL("./", base).href;
      await navigator.serviceWorker.register(swUrl.href, { scope, updateViaCache: "none" });
    } catch (_) {}
  }

  function init() {
    injectStyles();
    const button = buildUI();
    if (isStandalone()) { button.style.display = "none"; return; }

    window.addEventListener("beforeinstallprompt", e => {
      e.preventDefault();
      deferredPrompt = e;
      button.style.display = "inline-flex";
    });

    window.addEventListener("appinstalled", () => {
      deferredPrompt = null;
      button.style.display = "none";
    });

    // Keep a visible fallback on mobile Safari and browsers with menu-based install.
    window.setTimeout(() => {
      if (isStandalone()) return;
      if (deferredPrompt || isIOS() || isSafari() || /Android|Windows|Macintosh|Linux/i.test(navigator.userAgent)) {
        button.style.display = "inline-flex";
      }
    }, 900);

    registerSW();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
})();
