document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  document.querySelectorAll("[data-fill]").forEach((bar) => {
    const value = bar.getAttribute("data-fill");
    bar.innerHTML = `<span style="width:${value}%"></span>`;
  });
});
