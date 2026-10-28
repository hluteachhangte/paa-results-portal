(function () {
  let registration;
  let banner;
  let requested = false;
  let checking = false;
  let lastCheck = 0;
  const version = (doc) => doc.querySelector('meta[name="app-version"]')?.content || "";
  const initial = version(document);

  function loadLatestPage() {
    const url = new URL(location.href);
    url.searchParams.set("appRefresh", String(Date.now()));
    location.replace(url.href);
  }

  function showUpdate() {
    if (banner || requested) return;
    banner = document.createElement("aside");
    banner.className = "app-update-banner";
    banner.setAttribute("aria-label", "App update");
    const message = document.createElement("span");
    message.setAttribute("role", "status");
    message.textContent = "A new version is available.";
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Update";
    button.addEventListener("click", () => {
      const reason = window.MarkHubUpdateBlockReason?.();
      if (reason) { message.textContent = reason; return; }
      if (!window.confirm("Update now? Finish any unsaved form entries before continuing.")) return;
      requested = true;
      banner.remove();
      banner = null;
      if (registration?.waiting) {
        button.disabled = true;
        button.textContent = "Updating...";
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      } else loadLatestPage();
    });
    banner.append(message, button);
    document.body.appendChild(banner);
  }

  window.addEventListener("markhub-update-ready", (event) => {
    registration = event.detail;
    checkUpdate();
  });
  if ("serviceWorker" in navigator) navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (requested) loadLatestPage();
  });

  async function checkUpdate() {
    if (requested || checking || document.hidden || Date.now() - lastCheck < 60000) return;
    checking = true;
    lastCheck = Date.now();
    try {
      const url = new URL("./index.html", location.href);
      url.searchParams.set("updateCheck", String(lastCheck));
      const response = await fetch(url, { cache: "no-store" });
      if (response.ok) {
        const doc = new DOMParser().parseFromString(await response.text(), "text/html");
        if (doc.querySelector("#appShell")) {
          const latest = version(doc);
          if (initial && latest && latest > initial) showUpdate();
          else if (banner) { banner.remove(); banner = null; }
        }
      }
      await registration?.update();
    } catch {
      // A failed update check must not interrupt offline work.
    } finally { checking = false; }
  }
  window.addEventListener("load", () => {
    checkUpdate();
    setInterval(checkUpdate, 300000);
  });
  window.addEventListener("focus", checkUpdate);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) checkUpdate(); });
})();
