(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  var setTheme = function (theme) {
    var nextTheme = theme === "dark" ? "dark" : "light";
    root.dataset.theme = nextTheme;

    document.querySelectorAll("[data-theme-toggle]").forEach(function (toggle) {
      var label = toggle.querySelector("[data-theme-label]");
      var isDark = nextTheme === "dark";
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      if (label) label.textContent = isDark ? "Light" : "Dark";
    });
  };

  setTheme(root.dataset.theme);

  document.querySelectorAll("[data-theme-toggle]").forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      var nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      setTheme(nextTheme);
      try {
        localStorage.setItem("khk-theme", nextTheme);
      } catch (error) {
        return;
      }
    });
  });

  var revealItems = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  var cursor = document.getElementById("custom-cursor");
  var cursorLabel = cursor ? cursor.querySelector("span") : null;
  var canUseCursor = cursor && cursorLabel && !reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (canUseCursor) {
    document.documentElement.classList.add("cursor-enabled");
    var targetX = -40;
    var targetY = -40;
    var currentX = targetX;
    var currentY = targetY;

    window.addEventListener("mousemove", function (event) {
      targetX = event.clientX;
      targetY = event.clientY;
    });

    document.addEventListener("mouseover", function (event) {
      var item = event.target.closest("[data-cursor]");
      if (!item) return;
      cursor.classList.add("is-hovering");
      cursorLabel.textContent = item.getAttribute("data-cursor") || "Open";
    });

    document.addEventListener("mouseout", function (event) {
      if (!event.target.closest("[data-cursor]")) return;
      cursor.classList.remove("is-hovering");
      cursorLabel.textContent = "";
    });

    var moveCursor = function () {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      cursor.style.transform = "translate3d(" + currentX + "px, " + currentY + "px, 0)";
      window.requestAnimationFrame(moveCursor);
    };

    moveCursor();
  }

  var modal = document.querySelector("[data-modal]");
  if (modal && typeof modal.showModal === "function") {
    var modalImage = modal.querySelector("[data-modal-image]");
    var modalCaption = modal.querySelector("[data-modal-caption]");
    var closeButton = modal.querySelector("[data-close]");

    document.querySelectorAll("[data-lightbox]").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var image = trigger.querySelector("img");
        modalImage.src = trigger.getAttribute("data-lightbox");
        modalImage.alt = image ? image.alt : "";
        modalCaption.textContent = trigger.getAttribute("data-caption") || "";
        modal.showModal();
        closeButton.focus();
      });
    });

    closeButton.addEventListener("click", function () {
      modal.close();
    });

    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.close();
      }
    });
  }
}());
