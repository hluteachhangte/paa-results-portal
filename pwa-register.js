(function registerPwa() {
  const canUseServiceWorker = "serviceWorker" in navigator;
  const isLocalPreview = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  if (canUseServiceWorker && isLocalPreview) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.getRegistrations()
        .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
        .catch(() => {});
      if ("caches" in window) {
        caches.keys()
          .then((keys) => Promise.all(keys.filter((key) => key.startsWith("paa-results-portal-")).map((key) => caches.delete(key))))
          .catch(() => {});
      }
    });
    return;
  }

  const canRegister = canUseServiceWorker && window.location.protocol === "https:";
  if (!canRegister) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js", {
      scope: "./",
      updateViaCache: "none"
    }).then((registration) => {
      registration.update().catch(() => {});
      if (registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            worker.postMessage({ type: "SKIP_WAITING" });
          }
        });
      });
    }).catch(() => {
      // The app works without PWA registration.
    });
  });
})();
