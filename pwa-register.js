(function registerPwa() {
  const canRegister = "serviceWorker" in navigator
    && (window.location.protocol === "https:"
      || window.location.hostname === "localhost"
      || window.location.hostname === "127.0.0.1");

  if (!canRegister) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js", { scope: "./" }).catch(() => {});
  });
})();
